package interfaces

import (
	"backend/application/model"
	"context"
)

type AlunoDAO interface {
    CreateAluno(ctx context.Context, aluno *model.Aluno) error
    GetAlunoByID(ctx context.Context, id uint) (*model.Aluno, error)
    GetAlunoByCPF(ctx context.Context, cpf string) (*model.Aluno, error)
    GetAllAlunos(ctx context.Context) ([]model.Aluno, error)
    UpdateAluno(ctx context.Context, aluno *model.Aluno) error
    UpdateAlunoSaldo(ctx context.Context, alunoID uint, novoSaldo int) error
    DeleteAluno(ctx context.Context, id uint) error
}