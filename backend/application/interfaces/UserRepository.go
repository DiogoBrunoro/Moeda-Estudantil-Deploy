package interfaces

import (
	"backend/application/model"
	"context"
)

type UserDAO interface {
	CreateUser(ctx context.Context, user *model.User) error
	GetUserByID(ctx context.Context, id uint) (*model.User, error)
	GetUserByEmail(ctx context.Context, email string) (*model.User, error)
	UpdateUser(ctx context.Context, user *model.User) error
	DeleteUser(ctx context.Context, id uint) error
}