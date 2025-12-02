package model

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email        string `gorm:"type:varchar(255);not null;uniqueIndex" json:"email"`
	PasswordHash string `gorm:"type:varchar(255);not null" json:"-"`
	Role         string `gorm:"type:varchar(50);not null" json:"role"` // aluno, professor, empresa
}