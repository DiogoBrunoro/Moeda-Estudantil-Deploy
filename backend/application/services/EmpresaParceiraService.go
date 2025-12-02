package services

import (
	"backend/adapters/repositories"
	"backend/application/model"
	"errors"

	"gorm.io/gorm"
)

type EmpresaParceiraService struct {
	empresaRepo *repositories.EmpresaParceiraRepository
	userRepo    *repositories.UserRepository
}

func NewEmpresaParceiraService(empresaRepo *repositories.EmpresaParceiraRepository, userRepo *repositories.UserRepository) *EmpresaParceiraService {
	return &EmpresaParceiraService{
		empresaRepo: empresaRepo,
		userRepo:    userRepo,
	}
}

func (s *EmpresaParceiraService) CreateEmpresa(empresa *model.EmpresaParceira) error {
	// Verificar se CNPJ já existe
	existingEmpresa, err := s.empresaRepo.FindByCNPJ(empresa.CNPJ)
	if err == nil && existingEmpresa != nil {
		return errors.New("CNPJ já cadastrado")
	} else if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err // erro real de DB
	}

	return s.empresaRepo.Create(empresa)
}

func (s *EmpresaParceiraService) GetEmpresaByUserID(userID uint) (*model.EmpresaParceira, error) {
	return s.empresaRepo.FindByUserID(userID)
}

func (s *EmpresaParceiraService) GetEmpresaByID(id uint) (*model.EmpresaParceira, error) {
	return s.empresaRepo.FindByID(id)
}

func (s *EmpresaParceiraService) UpdateEmpresa(empresa *model.EmpresaParceira) error {
	return s.empresaRepo.Update(empresa)
}
