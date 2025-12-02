// backend/application/services/parceria_service.go
package services

import (
	"backend/application/model"
	"backend/adapters/repositories"
	"errors"
)

type ParceriaService struct {
	parceriaRepo *repositories.ParceriaRepository
	// Você pode precisar dos repositórios de Instituicao e Empresa
	// para verificar se os IDs existem antes de criar a parceria.
}

func NewParceriaService(pRepo *repositories.ParceriaRepository) *ParceriaService {
	return &ParceriaService{
		parceriaRepo: pRepo,
	}
}

// CreateParceria cria o vínculo entre instituição e empresa
func (s *ParceriaService) CreateParceria(instID, empresaID uint) (*model.Parceria, error) {
	// Verificar se a parceria já existe
	if _, err := s.parceriaRepo.Find(instID, empresaID); err == nil {
		return nil, errors.New("parceria já existe")
	}

	// (Opcional: verificar se instID e empresaID são válidos)

	parceria := &model.Parceria{
		Id_instituicao: instID,
		Id_empresa:     empresaID,
	}

	if err := s.parceriaRepo.Create(parceria); err != nil {
		return nil, errors.New("erro ao criar parceria")
	}
	return parceria, nil
}

// DeleteParceria remove o vínculo
func (s *ParceriaService) DeleteParceria(instID, empresaID uint) error {
	parceria, err := s.parceriaRepo.Find(instID, empresaID)
	if err != nil {
		return errors.New("parceria não encontrada")
	}
	return s.parceriaRepo.Delete(parceria)
}

// ListParceriasByInstituicao
func (s *ParceriaService) ListParceriasByInstituicao(instID uint) ([]model.Parceria, error) {
	return s.parceriaRepo.FindByInstituicaoID(instID)
}

// ListParceriasByEmpresa
func (s *ParceriaService) ListParceriasByEmpresa(empresaID uint) ([]model.Parceria, error) {
	return s.parceriaRepo.FindByEmpresaID(empresaID)
}