package repositories

import (
	"backend/application/model"

	"gorm.io/gorm"
)

type EmpresaParceiraRepository struct {
	db *gorm.DB
}

func NewEmpresaParceiraRepository(db *gorm.DB) *EmpresaParceiraRepository {
	return &EmpresaParceiraRepository{db: db}
}

func (r *EmpresaParceiraRepository) Create(empresa *model.EmpresaParceira) error {
	return r.db.Create(empresa).Error
}

func (r *EmpresaParceiraRepository) FindByUserID(userID uint) (*model.EmpresaParceira, error) {
	var empresa model.EmpresaParceira
	err := r.db.Preload("User").Where("user_id = ?", userID).First(&empresa).Error
	if err != nil {
		return nil, err
	}
	return &empresa, nil
}

func (r *EmpresaParceiraRepository) FindByID(id uint) (*model.EmpresaParceira, error) {
	var empresa model.EmpresaParceira
	err := r.db.Preload("User").First(&empresa, id).Error
	if err != nil {
		return nil, err
	}
	return &empresa, nil
}

func (r *EmpresaParceiraRepository) FindByCNPJ(cnpj string) (*model.EmpresaParceira, error) {
	var empresa model.EmpresaParceira
	err := r.db.Where("cnpj = ?", cnpj).First(&empresa).Error
	if err != nil {
		return nil, err
	}
	return &empresa, nil
}

func (r *EmpresaParceiraRepository) Update(empresa *model.EmpresaParceira) error {
	return r.db.Save(empresa).Error
}
