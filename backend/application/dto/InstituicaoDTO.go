package dto

type RegisterProfessorInput struct {
	Email        string `json:"email" binding:"required,email"`
	Password     string `json:"password" binding:"required,min=6"`
	Nome         string `json:"nome" binding:"required"`
	CPF          string `json:"cpf" binding:"required"` 
	Departamento string `json:"departamento"`
}

type UpdateProfessorInput struct {
	Nome         string `json:"nome"`
	Departamento string `json:"departamento"`
}