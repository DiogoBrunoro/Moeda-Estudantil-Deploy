// backend/application/repositories/professor_repository.go
package repositories

import (
	"backend/application/model"
	"gorm.io/gorm"
)

type ProfessorRepository struct {
	db *gorm.DB
}

func NewProfessorRepository(db *gorm.DB) *ProfessorRepository {
	return &ProfessorRepository{db: db}
}

// Create (Corrigido de CreateWithTx)
// Usado pelo InstituicaoService.RegisterProfessor
func (r *ProfessorRepository) Create(professor *model.Professor) error {
	return r.db.Create(professor).Error
}

// FindByID (com User)
// Usado pelo InstituicaoService.GetProfessorByID
func (r *ProfessorRepository) FindByID(id uint) (*model.Professor, error) {
	var professor model.Professor
	// Preload("User") traz os dados do usuário associado
	err := r.db.Preload("User").First(&professor, id).Error
	return &professor, err
}

// FindByUserID (com User)
// Usado pelo ProfessorService.GetPerfil
func (r *ProfessorRepository) FindByUserID(userID uint) (*model.Professor, error) {
	var professor model.Professor
	// Adicionado Preload("User") para consistência
	err := r.db.Preload("User").Where("user_id = ?", userID).First(&professor).Error
	return &professor, err
}

// FindByCPF
// Usado pelo InstituicaoService.RegisterProfessor
func (r *ProfessorRepository) FindByCPF(cpf string) (*model.Professor, error) {
	var professor model.Professor
	// Adicionado Preload("User") para consistência
	err := r.db.Preload("User").Where("cpf = ?", cpf).First(&professor).Error
	return &professor, err
}

// FindByInstituicaoID lista todos os professores de uma instituição
// Usado pelo InstituicaoService.ListProfessoresByInstituicao
func (r *ProfessorRepository) FindByInstituicaoID(instID uint) ([]model.Professor, error) {
	var professores []model.Professor
	err := r.db.Preload("User").Where("instituicao_ensino_id = ?", instID).Find(&professores).Error
	return professores, err
}

// Update
// Usado pelo ProfessorService.EnviarMoedas e InstituicaoService.UpdateProfessor
func (r *ProfessorRepository) Update(professor *model.Professor) error {
	return r.db.Save(professor).Error
}

// Delete (Corrigido de DeleteWithTx)
// Usado pelo InstituicaoService.DeleteProfessor
func (r *ProfessorRepository) Delete(id uint) error {
	return r.db.Delete(&model.Professor{}, id).Error
}