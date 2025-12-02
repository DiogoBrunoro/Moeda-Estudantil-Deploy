// backend/application/model/parceria.go
package model

import (
	"time"
)

type Parceria struct {
	// Chave primária composta
	Id_instituicao uint `gorm:"primaryKey;autoIncrement:false" json:"id_instituicao"`
	Id_empresa     uint `gorm:"primaryKey;autoIncrement:false" json:"id_empresa"`

	CreatedAt time.Time `json:"createdAt"`

	InstituicaoEnsino InstituicaoEnsino `gorm:"foreignKey:Id_instituicao;references:ID"`
	EmpresaParceira   EmpresaParceira   `gorm:"foreignKey:Id_empresa;references:ID"`
}