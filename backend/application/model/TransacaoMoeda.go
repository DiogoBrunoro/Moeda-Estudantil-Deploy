package model

import (
	"time"

	"gorm.io/gorm"
)

type TransacaoMoeda struct {
    gorm.Model
    ProfessorID *uint     `gorm:"index" json:"professor_id"` 
    Professor   Professor `json:"professor"`
    AlunoID     *uint     `gorm:"index" json:"aluno_id"`     
    Aluno       Aluno     `json:"aluno"`
    Valor       int       `gorm:"not null" json:"valor"`
    Motivo      string    `gorm:"type:text;not null" json:"motivo"`
    DataHora    time.Time `gorm:"not null;default:CURRENT_TIMESTAMP" json:"data_hora"`
}