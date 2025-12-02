package services

import (
	"backend/adapters/repositories"
	"backend/application/model"
	"errors"

	"gorm.io/gorm"
)

type UpdateAlunoInput struct {
	Nome        string `json:"nome"`
	Email       string `json:"email"`
	CPF         string `json:"cpf"`
	RG          string `json:"rg"`
	Endereco    string `json:"endereco"`
	Curso       string `json:"curso"`
	SaldoMoedas int    `json:"saldo_moedas"`
}

type AlunoService struct {
	alunoRepo     *repositories.AlunoRepository
	userRepo      *repositories.UserRepository
	emailService  *EmailService
	transacaoRepo *repositories.TransacaoMoedaRepository
}

func (s *AlunoService) UpdateSaldo(userID uint, valor int) any {
	panic("unimplemented")
}

func NewAlunoService(alunoRepo *repositories.AlunoRepository, userRepo *repositories.UserRepository, emailService *EmailService, transacaoRepo *repositories.TransacaoMoedaRepository) *AlunoService {
	return &AlunoService{
		alunoRepo:     alunoRepo,
		userRepo:      userRepo,
		emailService:  emailService,
		transacaoRepo: transacaoRepo,
	}
}

func (s *AlunoService) CreateAluno(aluno *model.Aluno) error {
	existingAluno, err := s.alunoRepo.FindByCPF(aluno.CPF)
	if err == nil && existingAluno != nil {
		return errors.New("CPF já cadastrado")
	}

	return s.alunoRepo.Create(aluno)
}

func (s *AlunoService) GetAlunoByUserID(userID uint) (*model.Aluno, error) {
	return s.alunoRepo.FindByUserID(userID)
}

func (s *AlunoService) GetAlunoByID(id uint) (*model.Aluno, error) {
	return s.alunoRepo.FindByID(id)
}

func (s *AlunoService) UpdateSaldoByUserID(userID uint, valor int) error {
	// Buscar aluno pelo user_id
	aluno, err := s.alunoRepo.FindByUserID(userID)
	if err != nil {
		return errors.New("aluno não encontrado")
	}

	// Atualizar saldo
	aluno.SaldoMoedas += valor
	if aluno.SaldoMoedas < 0 {
		return errors.New("saldo insuficiente")
	}

	// Salvar no banco
	return s.alunoRepo.Update(aluno)
}

func (s *AlunoService) ListAlunos() ([]model.Aluno, error) {
	return s.alunoRepo.List()
}

func (s *AlunoService) GetExtrato(userID uint) (map[string]interface{}, error) {
	aluno, err := s.alunoRepo.FindByUserID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("aluno não encontrado")
		}
		return nil, err
	}

	// Buscar transações do aluno
	transacoes, err := s.transacaoRepo.FindByAlunoID(aluno.ID)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"aluno":        aluno,
		"saldo_moedas": aluno.SaldoMoedas,
		"transacoes":   transacoes,
	}, nil
}

func (s *AlunoService) UpdateAlunoPerfil(userID uint, input *UpdateAlunoInput) (*model.Aluno, error) {
	aluno, err := s.alunoRepo.FindByUserID(userID)
	if err != nil {
		return nil, errors.New("aluno não encontrado")
	}

	if input.Email != aluno.User.Email {
		existingUser, _ := s.userRepo.FindByEmail(input.Email)
		if existingUser != nil && existingUser.ID != aluno.UserID {
			return nil, errors.New("email já está em uso por outra conta")
		}
	}

	if input.CPF != aluno.CPF {
		existingAluno, _ := s.alunoRepo.FindByCPF(input.CPF)
		if existingAluno != nil && existingAluno.ID != aluno.ID {
			return nil, errors.New("CPF já está em uso por outra conta")
		}
	}

	aluno.Nome = input.Nome
	aluno.CPF = input.CPF
	aluno.RG = input.RG
	aluno.Endereco = input.Endereco
	aluno.Curso = input.Curso
	aluno.SaldoMoedas = input.SaldoMoedas

	aluno.User.Email = input.Email

	if err := s.alunoRepo.Update(aluno); err != nil {
		return nil, err
	}

	return aluno, nil
}

func (s *AlunoService) DeleteAlunoPerfil(userID uint) error {
	aluno, err := s.alunoRepo.FindByUserID(userID)
	if err != nil {
		return errors.New("aluno não encontrado")
	}

	if err := s.alunoRepo.Delete(aluno.ID); err != nil {
		return err
	}

	if err := s.userRepo.Delete(aluno.UserID); err != nil {
		return err
	}

	return nil
}


func (s * AlunoService) GetAlunosByPrefix(prefix string) (*[]model.Aluno, error) {
	return s.alunoRepo.GetAlunoByPrefix(prefix)
}