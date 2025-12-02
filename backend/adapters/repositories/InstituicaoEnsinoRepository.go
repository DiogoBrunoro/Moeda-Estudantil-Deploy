// backend/application/repositories/instituicao_ensino_repository.go
package repositories

import (
	"backend/application/model"

	"gorm.io/gorm"
)

type InstituicaoEnsinoRepository struct {
	db *gorm.DB
}

func NewInstituicaoEnsinoRepository(db *gorm.DB) *InstituicaoEnsinoRepository {
	return &InstituicaoEnsinoRepository{db: db}
}

func (r *InstituicaoEnsinoRepository) Create(instituicao *model.InstituicaoEnsino) error {
	return r.db.Create(instituicao).Error
}

func (r *InstituicaoEnsinoRepository) FindByID(id uint) (*model.InstituicaoEnsino, error) {
	var instituicao model.InstituicaoEnsino
	err := r.db.First(&instituicao, id).Error
	if err != nil {
		return nil, err
	}
	return &instituicao, nil
}

// FindAll (Usado pelo InstituicaoService.ListInstituicoes)
func (r *InstituicaoEnsinoRepository) FindAll() ([]model.InstituicaoEnsino, error) {
	var instituicoes []model.InstituicaoEnsino
	err := r.db.Find(&instituicoes).Error
	return instituicoes, err
}

// Update (Usado pelo InstituicaoService.UpdateInstituicao)
func (r *InstituicaoEnsinoRepository) Update(instituicao *model.InstituicaoEnsino) error {
	return r.db.Save(instituicao).Error
}

// Delete (Método de exclusão padrão, se necessário)
func (r *InstituicaoEnsinoRepository) Delete(id uint) error {
    return r.db.Delete(&model.InstituicaoEnsino{}, id).Error
}

func (r *InstituicaoEnsinoRepository) FindByUserID(userID uint) (*model.InstituicaoEnsino, error) {
	var instituicao model.InstituicaoEnsino
	if err := r.db.Where("user_id = ?", userID).First(&instituicao).Error; err != nil {
		return nil, err
	}
	return &instituicao, nil
}