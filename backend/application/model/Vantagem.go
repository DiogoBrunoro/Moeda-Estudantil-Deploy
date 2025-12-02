package model

import (
	"gorm.io/gorm"
)

type Vantagem struct {
    gorm.Model
    EmpresaParceiraID uint            `gorm:"not null" json:"empresa_parceira_id"`
    EmpresaParceira   EmpresaParceira `json:"empresa_parceira"`
    Titulo            string          `gorm:"type:varchar(255);not null" json:"titulo"` 
    Descricao         string          `gorm:"type:text;not null" json:"descricao"`
    FotoURL           string          `gorm:"type:varchar(255)" json:"foto_url"`
    CustoMoedas       int             `gorm:"not null" json:"custo_moedas"` 
    Ativa             bool            `gorm:"default:true" json:"ativa"` 
    Quantidade        int             `gorm:"not null" json:"quantidade"`
    Estoque           int             `gorm:"not null" json:"estoque"`

    Resgates []ResgateVantagem `gorm:"foreignKey:VantagemID" json:"resgates,omitempty"`
}
