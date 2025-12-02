package interfaces

import (
	"backend/application/model"
	"context"
)

type EmpresaParceiraDAO interface {
    CreateEmpresaParceira(ctx context.Context, empresa *model.EmpresaParceira) error
    GetEmpresaParceiraByID(ctx context.Context, id uint) (*model.EmpresaParceira, error)
    GetEmpresaParceiraByCNPJ(ctx context.Context, cnpj string) (*model.EmpresaParceira, error)
    GetAllEmpresasParceiras(ctx context.Context) ([]model.EmpresaParceira, error)
    UpdateEmpresaParceira(ctx context.Context, empresa *model.EmpresaParceira) error
    DeleteEmpresaParceira(ctx context.Context, id uint) error
}