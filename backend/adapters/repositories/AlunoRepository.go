package repositories

import (
	"backend/application/model"

	"gorm.io/gorm"
)

type AlunoRepository struct {
	db *gorm.DB
}

func NewAlunoRepository(db *gorm.DB) *AlunoRepository {
	return &AlunoRepository{db: db}
}

func (r *AlunoRepository) Create(aluno *model.Aluno) error {
	return r.db.Create(aluno).Error
}

func (r *AlunoRepository) FindByUserID(userID uint) (*model.Aluno, error) {
	var aluno model.Aluno
	err := r.db.Preload("User").Preload("InstituicaoEnsino").Where("user_id = ?", userID).First(&aluno).Error
	if err != nil {
		return nil, err
	}
	return &aluno, nil
}

func (r *AlunoRepository) FindByID(id uint) (*model.Aluno, error) {
	var aluno model.Aluno
	err := r.db.Preload("User").Preload("InstituicaoEnsino").First(&aluno, id).Error
	if err != nil {
		return nil, err
	}
	return &aluno, nil
}

func (r *AlunoRepository) FindByCPF(cpf string) (*model.Aluno, error) {
	var aluno model.Aluno
	err := r.db.Where("cpf = ?", cpf).First(&aluno).Error
	if err != nil {
		return nil, err
	}
	return &aluno, nil
}

func (r *AlunoRepository) Update(aluno *model.Aluno) error {
	return r.db.Save(aluno).Error
}

func (r *AlunoRepository) List() ([]model.Aluno, error) {
	var alunos []model.Aluno
	err := r.db.Preload("User").Preload("InstituicaoEnsino").Find(&alunos).Error
	return alunos, err
}

func (r *AlunoRepository) Delete(id uint) error {
	return r.db.Delete(&model.Aluno{}, id).Error
}

func (r *AlunoRepository) GetAlunoByPrefix(prefix string) (*[]model.Aluno, error) {
	var alunos []model.Aluno

	err := r.db.
		Preload("User").
		Preload("InstituicaoEnsino").
		Where("nome ILIKE ?", prefix+"%").
		Find(&alunos).Error

	if err != nil {
		return nil, err
	}

	return &alunos, nil
}
