package services

import (
	"backend/adapters/repositories"
	"backend/application/model"
	"errors"
	"time"
)

type TransacaoMoedaService struct {
	transacaoRepo *repositories.TransacaoMoedaRepository
	professorRepo *repositories.ProfessorRepository
	alunoRepo     *repositories.AlunoRepository
	emailService  *EmailService
}

func NewTransacaoMoedaService(
	transacaoRepo *repositories.TransacaoMoedaRepository,
	professorRepo *repositories.ProfessorRepository,
	alunoRepo *repositories.AlunoRepository,
	emailService *EmailService,
) *TransacaoMoedaService {
	return &TransacaoMoedaService{
		transacaoRepo: transacaoRepo,
		professorRepo: professorRepo,
		alunoRepo:     alunoRepo,
		emailService:  emailService,
	}
}

func (s *TransacaoMoedaService) EnviarMoedas(professorID, alunoID uint, valor int, motivo string) error {
	if valor <= 0 {
		return errors.New("valor deve ser maior que zero")
	}

	if motivo == "" {
		return errors.New("motivo é obrigatório")
	}

	// Buscar professor
	professor, err := s.professorRepo.FindByID(professorID)
	if err != nil {
		return errors.New("professor não encontrado")
	}

	// Verificar saldo do professor
	if professor.SaldoMoedas < valor {
		return errors.New("saldo insuficiente")
	}

	// Buscar aluno
	aluno, err := s.alunoRepo.FindByID(alunoID)
	if err != nil {
		return errors.New("aluno não encontrado")
	}

	// Atualizar saldos
	professor.SaldoMoedas -= valor
	aluno.SaldoMoedas += valor

	if err := s.professorRepo.Update(professor); err != nil {
		return err
	}

	if err := s.alunoRepo.Update(aluno); err != nil {
		// Reverter saldo do professor em caso de erro
		professor.SaldoMoedas += valor
		s.professorRepo.Update(professor)
		return err
	}

	// Criar transação
	transacao := &model.TransacaoMoeda{
		ProfessorID: &professor.ID,
		AlunoID:     &aluno.ID,
		Valor:       valor,
		Motivo:      motivo,
		DataHora:    time.Now(),
	}

	if err := s.transacaoRepo.Create(transacao); err != nil {
		return err
	}

	// Enviar email para o aluno
	go s.emailService.SendMoedasRecebidas(aluno.User.Email, aluno.Nome, professor.Nome, valor, motivo)

	return nil
}

func (s *TransacaoMoedaService) GetExtratoAluno(alunoID uint) ([]model.TransacaoMoeda, error) {
	return s.transacaoRepo.FindByAlunoID(alunoID)
}

func (s *TransacaoMoedaService) GetExtratoProfessor(professorID uint) ([]model.TransacaoMoeda, error) {
	return s.transacaoRepo.FindByProfessorID(professorID)
}


func (s *TransacaoMoedaService) CreateTransacao(transacao *model.TransacaoMoeda) error {
	return s.transacaoRepo.Create(transacao)
}

