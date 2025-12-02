package repositories

import (
	"backend/application/model"

	"gorm.io/gorm"
)

type TransacaoMoedaRepository struct {
	db *gorm.DB
}

func NewTransacaoMoedaRepository(db *gorm.DB) *TransacaoMoedaRepository {
	return &TransacaoMoedaRepository{db: db}
}

func (r *TransacaoMoedaRepository) Create(transacao *model.TransacaoMoeda) error {
	return r.db.Create(transacao).Error
}

func (r *TransacaoMoedaRepository) FindByProfessorID(professorID uint) ([]model.TransacaoMoeda, error) {
	var transacoes []model.TransacaoMoeda
	err := r.db.Preload("Aluno").Preload("Aluno.User").Where("professor_id = ?", professorID).Order("data_hora DESC").Find(&transacoes).Error
	return transacoes, err
}

func (r *TransacaoMoedaRepository) FindByAlunoID(alunoID uint) ([]model.TransacaoMoeda, error) {
	var transacoes []model.TransacaoMoeda
	err := r.db.Preload("Professor").Preload("Professor.User").Where("aluno_id = ?", alunoID).Order("data_hora DESC").Find(&transacoes).Error
	return transacoes, err
}

func (r *TransacaoMoedaRepository) List() ([]model.TransacaoMoeda, error) {
	var transacoes []model.TransacaoMoeda
	err := r.db.Preload("Professor").Preload("Professor.User").Preload("Aluno").Preload("Aluno.User").Order("data_hora DESC").Find(&transacoes).Error
	return transacoes, err
}
