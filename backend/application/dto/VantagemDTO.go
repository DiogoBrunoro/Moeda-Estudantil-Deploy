package dto

import "backend/application/model"

type VantagemComStatusDTO struct {
	Vantagem    *model.Vantagem `json:"vantagem"`
	JaResgatada bool           `json:"ja_resgatada"`
}