package model

import (
	"gorm.io/gorm"
)

type Professor struct {
	gorm.Model
	UserID              uint              `gorm:"not null;uniqueIndex" json:"user_id"`
	User                User              `json:"user"`
	Nome                string            `gorm:"type:varchar(255);not null" json:"nome"`
	CPF                 string            `gorm:"type:varchar(14);not null;uniqueIndex" json:"cpf"`
	Departamento        string            `gorm:"type:varchar(100)" json:"departamento"`
	InstituicaoEnsinoID uint              `gorm:"not null" json:"instituicao_ensino_id"`
	InstituicaoEnsino   InstituicaoEnsino `json:"instituicao_ensino"`
	SaldoMoedas         int               `gorm:"default:0" json:"saldo_moedas"`
	TotalSend           int               `gorm:"default:0" json:"total_send"`
	TotalReceive           int               `gorm:"default:0" json:"total_receive"`
	TransacoesEnviadas  []TransacaoMoeda  `gorm:"foreignKey:ProfessorID" json:"transacoes_enviadas,omitempty"`
}
