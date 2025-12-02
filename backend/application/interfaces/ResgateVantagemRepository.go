package interfaces

import (
	"backend/application/model"
	"context"
)

type ResgateVantagemDAO interface {
    CreateResgateVantagem(ctx context.Context, resgate *model.ResgateVantagem) error
    GetResgateVantagemByID(ctx context.Context, id uint) (*model.ResgateVantagem, error)
    GetResgateByCodigoCupom(ctx context.Context, codigoCupom string) (*model.ResgateVantagem, error)
    GetResgatesByAlunoID(ctx context.Context, alunoID uint) ([]model.ResgateVantagem, error)
    UpdateResgateVantagemStatus(ctx context.Context, resgateID uint, status string) error
    GetAllResgatesVantagem(ctx context.Context) ([]model.ResgateVantagem, error) 
}