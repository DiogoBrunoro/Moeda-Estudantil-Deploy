package interfaces

import (
	"backend/application/model"
	"context"
)

type InstituicaoEnsinoDAO interface {
	CreateInstituicaoEnsino(ctx context.Context, instituicao *model.InstituicaoEnsino) error
	GetInstituicaoEnsinoByID(ctx context.Context, id uint) (*model.InstituicaoEnsino, error)
	GetInstituicaoEnsinoByName(ctx context.Context, name string) (*model.InstituicaoEnsino, error)
	GetAllInstituicoesEnsino(ctx context.Context) ([]model.InstituicaoEnsino, error)
	UpdateInstituicaoEnsino(ctx context.Context, instituicao *model.InstituicaoEnsino) error
	DeleteInstituicaoEnsino(ctx context.Context, id uint) error
}