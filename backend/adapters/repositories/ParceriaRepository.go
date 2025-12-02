// backend/application/repositories/parceria_repository.go
package repositories

import (
	"backend/application/model"
	"gorm.io/gorm"
)

type ParceriaRepository struct {
	db *gorm.DB
}

func NewParceriaRepository(db *gorm.DB) *ParceriaRepository {
	return &ParceriaRepository{db: db}
}

// Create cria um novo registro de parceria
func (r *ParceriaRepository) Create(parceria *model.Parceria) error {
	return r.db.Create(parceria).Error
}

// Find busca uma parceria específica pela chave composta
func (r *ParceriaRepository) Find(instID, empresaID uint) (*model.Parceria, error) {
	var parceria model.Parceria
	err := r.db.Where("id_instituicao = ? AND id_empresa = ?", instID, empresaID).First(&parceria).Error
	return &parceria, err
}

// FindByInstituicaoID lista todas as parcerias de uma instituição
func (r *ParceriaRepository) FindByInstituicaoID(instID uint) ([]model.Parceria, error) {
	var parcerias []model.Parceria
	// Preload traz os dados da empresa junto
	err := r.db.Preload("EmpresaParceira").Where("id_instituicao = ?", instID).Find(&parcerias).Error
	return parcerias, err
}

// FindByEmpresaID lista todas as parcerias de uma empresa
func (r *ParceriaRepository) FindByEmpresaID(empresaID uint) ([]model.Parceria, error) {
	var parcerias []model.Parceria
	// Preload traz os dados da instituição junto
	err := r.db.Preload("InstituicaoEnsino").Where("id_empresa = ?", empresaID).Find(&parcerias).Error
	return parcerias, err
}

// Delete remove um registro de parceria
func (r *ParceriaRepository) Delete(parceria *model.Parceria) error {
	return r.db.Delete(parceria).Error
}