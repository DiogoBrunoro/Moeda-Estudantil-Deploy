package interfaces

import (
	"backend/application/model"
	"context"
)

type ProfessorDAO interface {
    CreateProfessor(ctx context.Context, professor *model.Professor) error
    GetProfessorByID(ctx context.Context, id uint) (*model.Professor, error)
    GetProfessorByCPF(ctx context.Context, cpf string) (*model.Professor, error)
    GetAllProfessores(ctx context.Context) ([]model.Professor, error)
    UpdateProfessor(ctx context.Context, professor *model.Professor) error
    UpdateProfessorSaldo(ctx context.Context, professorID uint, novoSaldo int) error
    DeleteProfessor(ctx context.Context, id uint) error
}