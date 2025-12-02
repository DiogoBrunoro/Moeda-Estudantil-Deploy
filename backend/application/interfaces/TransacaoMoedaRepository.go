package interfaces

import (
	"backend/application/model"
	"context"
)

type TransacaoMoedaDAO interface {
    CreateTransacaoMoeda(ctx context.Context, transacao *model.TransacaoMoeda) error
    GetTransacaoMoedaByID(ctx context.Context, id uint) (*model.TransacaoMoeda, error)
    GetTransacoesByAlunoID(ctx context.Context, alunoID uint) ([]model.TransacaoMoeda, error)
    GetTransacoesByProfessorID(ctx context.Context, professorID uint) ([]model.TransacaoMoeda, error)
    GetAllTransacoesMoeda(ctx context.Context) ([]model.TransacaoMoeda, error) 
}