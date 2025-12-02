package repositories

import (
	"backend/application/model"
	"errors"

	"gorm.io/gorm"
)

type ResgateVantagemRepository struct {
	db *gorm.DB
}

func NewResgateVantagemRepository(db *gorm.DB) *ResgateVantagemRepository {
	return &ResgateVantagemRepository{db: db}
}

func (r *ResgateVantagemRepository) Create(resgate *model.ResgateVantagem) error {
	return r.db.Create(resgate).Error
}

func (r *ResgateVantagemRepository) FindByAlunoID(alunoID uint) ([]model.ResgateVantagem, error) {
	var resgates []model.ResgateVantagem
	err := r.db.Preload("Vantagem").Preload("Vantagem.EmpresaParceira").Where("aluno_id = ?", alunoID).Order("data_hora DESC").Find(&resgates).Error
	return resgates, err
}

func (r *ResgateVantagemRepository) FindByEmpresaID(empresaID uint) ([]model.ResgateVantagem, error) {
	var resgates []model.ResgateVantagem
	err := r.db.Preload("Aluno").Preload("Aluno.User").Preload("Vantagem").
		Joins("JOIN vantagens ON vantagens.id = resgate_vantagens.vantagem_id").
		Where("vantagens.empresa_parceira_id = ?", empresaID).
		Order("resgate_vantagens.data_hora DESC").
		Find(&resgates).Error
	return resgates, err
}

func (r *ResgateVantagemRepository) FindByCodigoCupom(codigo string) (*model.ResgateVantagem, error) {
	var resgate model.ResgateVantagem
	err := r.db.Preload("Aluno").Preload("Vantagem").Where("codigo_cupom = ?", codigo).First(&resgate).Error
	if err != nil {
		return nil, err
	}
	return &resgate, nil
}

func (r *ResgateVantagemRepository) FindByAlunoAndVantagem(alunoID, vantagemID uint) (*model.ResgateVantagem, error) {
    var resgate model.ResgateVantagem
    err := r.db.Where("aluno_id = ? AND vantagem_id = ?", alunoID, vantagemID).First(&resgate).Error

    if err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, nil
        }
        return nil, err
    }
    
    return &resgate, nil
}
