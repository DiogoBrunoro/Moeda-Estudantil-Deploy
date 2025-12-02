package services

import (
	"backend/adapters/repositories"
	"backend/application/model"
	"errors"

	"golang.org/x/crypto/bcrypt" // Importado para substituir o utils.HashPassword
)

// DTO para registrar um novo professor, seguindo o padrão do AlunoService.
type RegisterProfessorInput struct {
	Nome         string `json:"nome" binding:"required"`
	Email        string `json:"email" binding:"required"`
	Password     string `json:"password" binding:"required"` // O input recebe a senha pura
	CPF          string `json:"cpf" binding:"required"`
	Departamento string `json:"departamento"`
}

// DTO para atualizar um professor, seguindo o padrão do AlunoService.
type UpdateProfessorInput struct {
	Nome         string `json:"nome"`
	Departamento string `json:"departamento"`
}

// ***** EnviarMoedasInput FOI REMOVIDO DESTE ARQUIVO *****

type InstituicaoService struct {
	instituicaoRepo *repositories.InstituicaoEnsinoRepository
	professorRepo   *repositories.ProfessorRepository
	userRepo        *repositories.UserRepository
	parceriaRepo    *repositories.ParceriaRepository
}

func NewInstituicaoService(
	ir *repositories.InstituicaoEnsinoRepository,
	pr *repositories.ProfessorRepository,
	ur *repositories.UserRepository,
	parRepo *repositories.ParceriaRepository,
) *InstituicaoService {
	return &InstituicaoService{
		instituicaoRepo: ir,
		professorRepo:   pr,
		userRepo:        ur,
		parceriaRepo:    parRepo,
	}
}

func (s *InstituicaoService) ListInstituicoes() ([]model.InstituicaoEnsino, error) {
	return s.instituicaoRepo.FindAll()
}

func (s *InstituicaoService) GetInstituicaoByID(id uint) (*model.InstituicaoEnsino, error) {
	instituicao, err := s.instituicaoRepo.FindByID(id)
	if err != nil {
		return nil, errors.New("instituição não encontrada")
	}
	return instituicao, nil
}

func (s *InstituicaoService) UpdateInstituicao(id uint, input *model.InstituicaoEnsino) (*model.InstituicaoEnsino, error) {
	instituicao, err := s.GetInstituicaoByID(id) 
	if err != nil {
		return nil, err
	}

	instituicao.Nome = input.Nome
	if err := s.instituicaoRepo.Update(instituicao); err != nil {
		return nil, errors.New("erro ao atualizar instituição")
	}
	return instituicao, nil
}

func (s *InstituicaoService) RegisterProfessor(instID uint, input *RegisterProfessorInput) (*model.Professor, error) {
	
	
	if _, err := s.userRepo.FindByEmail(input.Email); err == nil {
		return nil, errors.New("email já está em uso")
	}
	if _, err := s.professorRepo.FindByCPF(input.CPF); err == nil {
		return nil, errors.New("CPF já está em uso")
	}

	hashedPasswordBytes, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("erro interno ao processar senha")
	}

	newUser := &model.User{
		Email:        input.Email,
		PasswordHash: string(hashedPasswordBytes), 
		Role:         "professor",
	}

	if err := s.userRepo.Create(newUser); err != nil {
		return nil, errors.New("erro ao criar usuário para o professor")
	}

	newProfessor := &model.Professor{
		UserID:              newUser.ID,
		Nome:                input.Nome,
		CPF:                 input.CPF,
		Departamento:        input.Departamento,
		InstituicaoEnsinoID: instID,
		SaldoMoedas:         0, 
	}
	if err := s.professorRepo.Create(newProfessor); err != nil {
		return nil, errors.New("erro ao criar perfil do professor")
	}

	newProfessor.User = *newUser 
	return newProfessor, nil
}

func (s *InstituicaoService) ListProfessoresByInstituicao(instID uint) ([]model.Professor, error) {
	return s.professorRepo.FindByInstituicaoID(instID)
}

func (s *InstituicaoService) GetProfessorByID(instID, profID uint) (*model.Professor, error) {
	professor, err := s.professorRepo.FindByID(profID)
	if err != nil {
		return nil, errors.New("professor não encontrado")
	}

	if professor.InstituicaoEnsinoID != instID {
		return nil, errors.New("acesso negado: professor não pertence a esta instituição")
	}

	return professor, nil
}

func (s *InstituicaoService) UpdateProfessor(instID, profID uint, input *UpdateProfessorInput) (*model.Professor, error) {
	professor, err := s.GetProfessorByID(instID, profID)
	if err != nil {
		return nil, err
	}

	professor.Nome = input.Nome
	professor.Departamento = input.Departamento

	if err := s.professorRepo.Update(professor); err != nil {
		return nil, errors.New("erro ao atualizar professor")
	}
	return professor, nil
}

func (s *InstituicaoService) DeleteProfessor(instID, profID uint) error {
	professor, err := s.GetProfessorByID(instID, profID)
	if err != nil {
		return err
	}

	if err := s.professorRepo.Delete(professor.ID); err != nil {
		return errors.New("erro ao deletar perfil do professor")
	}

	if err := s.userRepo.Delete(professor.UserID); err != nil {
		return errors.New("erro ao deletar usuário do professor")
	}

	return nil
}

// --- Gestão de Parcerias ---

func (s *InstituicaoService) ListParcerias(instID uint) ([]model.Parceria, error) {
	return s.parceriaRepo.FindByInstituicaoID(instID)
}

func (s *InstituicaoService) CreateParceria(instID, empresaID uint) (*model.Parceria, error) {
	if _, err := s.parceriaRepo.Find(instID, empresaID); err == nil {
		return nil, errors.New("parceria já existe")
	}

	parceria := &model.Parceria{
		Id_instituicao: instID,
		Id_empresa:     empresaID,
	}

	if err := s.parceriaRepo.Create(parceria); err != nil {
		return nil, errors.New("erro ao criar parceria")
	}
	return parceria, nil
}

func (s *InstituicaoService) DeleteParceria(instID, empresaID uint) error {
	parceria, err := s.parceriaRepo.Find(instID, empresaID)
	if err != nil {
		return errors.New("parceria não encontrada")
	}

	return s.parceriaRepo.Delete(parceria)
}

func (s *InstituicaoService) GetInstituicaoByUserID(userID uint) (*model.InstituicaoEnsino, error) {
	instituicao, err := s.instituicaoRepo.FindByUserID(userID)
	if err != nil {
		return nil, errors.New("instituição não encontrada para este usuário")
	}
	return instituicao, nil
}
