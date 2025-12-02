package model

import (
	"gorm.io/gorm"
)

type Aluno struct {
	gorm.Model
	UserID              uint              `gorm:"not null;uniqueIndex" json:"user_id"`
	User                User              `json:"user"`
	Nome                string            `gorm:"type:varchar(255);not null" json:"nome"`
	CPF                 string            `gorm:"type:varchar(14);not null;uniqueIndex" json:"cpf"`
	RG                  string            `gorm:"type:varchar(20)" json:"rg"`
	Endereco            string            `gorm:"type:varchar(255)" json:"endereco"`
	InstituicaoEnsinoID uint              `gorm:"not null" json:"instituicao_ensino_id"`
	InstituicaoEnsino   InstituicaoEnsino `json:"instituicao_ensino"`
	Curso               string            `gorm:"type:varchar(100)" json:"curso"`
	SaldoMoedas         int               `gorm:"default:0" json:"saldo_moedas"`

	TransacoesRecebidas []TransacaoMoeda  `gorm:"foreignKey:AlunoID" json:"transacoes_recebidas,omitempty"`
	ResgatesVantagens   []ResgateVantagem `gorm:"foreignKey:AlunoID" json:"resgates_vantagens,omitempty"`
}
