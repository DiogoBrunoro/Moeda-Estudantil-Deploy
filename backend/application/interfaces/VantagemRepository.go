package interfaces

import (
	"backend/application/model"
	"context"
)

type VantagemDAO interface {
    CreateVantagem(ctx context.Context, vantagem *model.Vantagem) error
    GetVantagemByID(ctx context.Context, id uint) (*model.Vantagem, error)
    GetVantagensByEmpresaID(ctx context.Context, empresaID uint) ([]model.Vantagem, error)
    GetAllVantagensAtivas(ctx context.Context) ([]model.Vantagem, error)
    UpdateVantagem(ctx context.Context, vantagem *model.Vantagem) error
    DeleteVantagem(ctx context.Context, id uint) error
}