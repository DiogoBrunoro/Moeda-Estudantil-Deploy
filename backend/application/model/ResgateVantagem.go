package model

import (
	"time"

	"gorm.io/gorm"
)

type ResgateVantagem struct {
    gorm.Model
    AlunoID    	uint      `gorm:"not null" json:"aluno_id"`
    Aluno      	Aluno     `json:"aluno"`
    VantagemID 	uint      `gorm:"not null" json:"vantagem_id"`
    Vantagem   	Vantagem  `json:"vantagem"`
    DataHora   	time.Time `gorm:"not null;default:CURRENT_TIMESTAMP" json:"data_hora"`
    CodigoCupom string    `gorm:"type:varchar(50);not null;uniqueIndex" json:"codigo_cupom"` 
    Status     	string    `gorm:"type:varchar(50);default:'pendente'" json:"status"` // pendente, utilizado, cancelado        
    DataExpiracao time.Time `json:"data_expiracao"`
}