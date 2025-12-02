package model

import (
    "gorm.io/gorm"
)

type InstituicaoEnsino struct {
    gorm.Model
    UserID   uint   `gorm:"not null;uniqueIndex" json:"user_id"` 
    User     User   `json:"user"`
    Nome     string `gorm:"type:varchar(255);not null;uniqueIndex" json:"nome"`
    Cnpj     string `gorm:"type:varchar(20);not null;uniqueIndex" json:"cnpj"`
    Endereco string `gorm:"type:varchar(255)" json:"endereco"`
}