package services

import (
	"backend/adapters/repositories"
	"backend/application/dto"
	"backend/application/model"
	"errors"
	"fmt"
)

type VantagemService struct {
	vantagemRepo *repositories.VantagemRepository
	empresaRepo  *repositories.EmpresaParceiraRepository
	resgateRepo  *repositories.ResgateVantagemRepository 
    alunoRepo    *repositories.AlunoRepository
}

func NewVantagemService(vantagemRepo *repositories.VantagemRepository, empresaRepo *repositories.EmpresaParceiraRepository, resgateRepo *repositories.ResgateVantagemRepository, 
    alunoRepo *repositories.AlunoRepository,) *VantagemService {
	return &VantagemService{
		vantagemRepo: vantagemRepo,
		empresaRepo:  empresaRepo,
		resgateRepo:  resgateRepo,
		alunoRepo:    alunoRepo,
	}
}

func (s *VantagemService) CreateVantagem(vantagem *model.Vantagem) error {
	// Verificar se empresa existe
	_, err := s.empresaRepo.FindByID(vantagem.EmpresaParceiraID)
	if err != nil {
		return errors.New("empresa parceira não encontrada")
	}

	return s.vantagemRepo.Create(vantagem)
}

func (s *VantagemService) FindByEmpresaAndID(empresaID uint, id uint) (*model.Vantagem, error) {
	return s.vantagemRepo.FindByEmpresaAndID(empresaID, id)
}

func (s *VantagemService) UpdateVantagem(id uint, vantagem *model.Vantagem) error {
	existing, err := s.vantagemRepo.FindByID(id)
	if err != nil {
		return errors.New("vantagem não encontrada")
	}

	existing.Titulo = vantagem.Titulo
	existing.Descricao = vantagem.Descricao
	existing.FotoURL = vantagem.FotoURL
	existing.CustoMoedas = vantagem.CustoMoedas
	existing.Ativa = vantagem.Ativa

	return s.vantagemRepo.Update(existing)
}

func (s *VantagemService) DeleteVantagem(id uint) error {
	return s.vantagemRepo.Delete(id)
}

func (s *VantagemService) GetVantagemByID(id uint) (*model.Vantagem, error) {
	return s.vantagemRepo.FindByID(id)
}

func (s *VantagemService) ListVantagensAtivas() ([]model.Vantagem, error) {
	return s.vantagemRepo.ListActive()
}

func (s *VantagemService) ListVantagensByEmpresa(empresaID uint) ([]model.Vantagem, error) {
	return s.vantagemRepo.ListByEmpresa(empresaID)
}

func (s *VantagemService) ListVantagensParaAluno(userID uint) ([]dto.VantagemComStatusDTO, error) {
    
    // 1. Buscar o aluno (precisamos do Aluno.ID)
    aluno, err := s.alunoRepo.FindByUserID(userID)
    if err != nil {
        return nil, errors.New("aluno não encontrado")
    }
    
    // 2. Buscar todas as vantagens ativas (usando o repo existente)
    vantagensAtivas, err := s.vantagemRepo.ListActive()
    if err != nil {
        return nil, fmt.Errorf("erro ao listar vantagens ativas: %w", err)
    }

    // 3. Buscar todos os resgates feitos por ESTE aluno
    //    (Assumindo que ResgateVantagemRepository tem o método FindByAlunoID)
    resgatesDoAluno, err := s.resgateRepo.FindByAlunoID(aluno.ID)
    if err != nil {
        return nil, fmt.Errorf("erro ao buscar resgates do aluno: %w", err)
    }

    // 4. Criar um map para consulta rápida (O(1)) dos resgates
    //    (mapa onde a chave é a VantagemID e o valor é true)
    mapResgates := make(map[uint]bool)
    for _, resgate := range resgatesDoAluno {
        mapResgates[resgate.VantagemID] = true
    }

    // 5. Montar a resposta (o DTO)
    //    (Usando o DTO que você criou na pasta /dto)
    var respostaDTO []dto.VantagemComStatusDTO

    for _, vantagem := range vantagensAtivas {
        // Verifica no mapa se a VantagemID existe
        jaResgatou := mapResgates[vantagem.ID] 

        dto := dto.VantagemComStatusDTO{
            Vantagem:    &vantagem,
            JaResgatada: jaResgatou,
        }
        respostaDTO = append(respostaDTO, dto)
    }

    return respostaDTO, nil
}