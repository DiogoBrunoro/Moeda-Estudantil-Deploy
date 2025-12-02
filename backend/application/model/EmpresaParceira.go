package model

import (
	"gorm.io/gorm"
)

type EmpresaParceira struct {
	gorm.Model
	UserID   uint   `gorm:"not null;uniqueIndex" json:"user_id"` // Cada empresa tem um User associado
	User     User   `json:"user"`
	Nome     string `gorm:"type:varchar(255);not null" json:"nome"`
	CNPJ     string `gorm:"type:varchar(18);not null;uniqueIndex" json:"cnpj"`
	Endereco string `gorm:"type:varchar(255)" json:"endereco"`
	Descricao string `gorm:"type:text" json:"descricao"`

	// Relacionamento com as vantagens que ela oferece
	Vantagens []Vantagem `gorm:"foreignKey:EmpresaParceiraID" json:"vantagens,omitempty"`
}
