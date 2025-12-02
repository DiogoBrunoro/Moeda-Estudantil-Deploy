package controllers

import (
	"backend/application/model"
	"backend/application/services"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserController struct {
    userService    *services.UserService
    alunoService   *services.AlunoService
    empresaService *services.EmpresaParceiraService
}

func NewUserController(userService *services.UserService, alunoService *services.AlunoService, empresaService *services.EmpresaParceiraService) *UserController {
    return &UserController{
        userService:    userService,
        alunoService:   alunoService,
        empresaService: empresaService,
    }
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}


type LoginRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required"`
}

type RegisterAlunoRequest struct {
    Email               string `json:"email" binding:"required,email"`
    Password            string `json:"password" binding:"required,min=6"`
    Nome                string `json:"nome" binding:"required"`
    CPF                 string `json:"cpf" binding:"required"`
    RG                  string `json:"rg"`
    Endereco            string `json:"endereco"`
    InstituicaoEnsinoID uint   `json:"instituicao_ensino_id" binding:"required"`
    Curso               string `json:"curso" binding:"required"`
}

type RegisterEmpresaRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=6"`
    Nome     string `json:"nome" binding:"required"`
    CNPJ     string `json:"cnpj" binding:"required"`
    Endereco string `json:"endereco"`
}

// *** DTO ADICIONADO ***
type RegisterInstituicaoRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=6"`
    Nome     string `json:"nome" binding:"required"`
    Cnpj     string `json:"cnpj" binding:"required"` // Corrigido para Cnpj
    Endereco string `json:"endereco"`
}

func (h *UserController) Login(c *gin.Context) {
	fmt.Println("Login endpoint hit") // Linha de debug
    var req LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

	fmt.Println("Login request received for email:", req.Email, req.Password) // Linha de debug
	
    token, user, err := h.userService.Login(req.Email, req.Password)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "token": token,
        "user":  user,
    })
}

func (h *UserController) RegisterAluno(c *gin.Context) {
    var req RegisterAlunoRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    err := h.userService.DB.Transaction(func(tx *gorm.DB) error {
        hashSenha, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
        user := &model.User{
            Email:        req.Email,
            PasswordHash: string(hashSenha),
            Role:         "aluno",
        }
        if err := tx.Create(user).Error; err != nil {
            return err
        }

        aluno := &model.Aluno{
            UserID:             user.ID,
            Nome:               req.Nome,
            CPF:                req.CPF,
            RG:                 req.RG,
            Endereco:           req.Endereco,
            Curso:              req.Curso,
            InstituicaoEnsinoID: req.InstituicaoEnsinoID,
        }
        if err := tx.Create(aluno).Error; err != nil {
            return err
        }
        return nil
    })

    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Aluno criado com sucesso"})
}


func (h *UserController) RegisterEmpresa(c *gin.Context) {
    var req RegisterEmpresaRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    err := h.userService.DB.Transaction(func(tx *gorm.DB) error {
        hashSenha, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
        user := &model.User{
            Email:        req.Email,
            PasswordHash: string(hashSenha),
            Role:         "empresa",
        }
        if err := tx.Create(user).Error; err != nil {
            return err
        }

        empresa := &model.EmpresaParceira{
            UserID:   user.ID,
            Nome:     req.Nome,
            CNPJ:     req.CNPJ,
            Endereco: req.Endereco,
        }
        if err := tx.Create(empresa).Error; err != nil {
            return err
        }
        return nil
    })

    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    token, _, err := h.userService.Login(req.Email, req.Password)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao gerar token"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message": "Empresa cadastrada com sucesso",
        "token":   token,
    })
}

func (h *UserController) RegisterInstituicao(c *gin.Context) {
    var req RegisterInstituicaoRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    err := h.userService.DB.Transaction(func(tx *gorm.DB) error {
        hashSenha, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
        user := &model.User{
            Email:        req.Email,
            PasswordHash: string(hashSenha),
            Role:         "instituicao",
        }
        if err := tx.Create(user).Error; err != nil {
            return err
        }

        // Agora cria o model InstituicaoEnsino com o UserID
        instituicao := &model.InstituicaoEnsino{ 
            UserID:   user.ID,
            Nome:     req.Nome,
            Cnpj:     req.Cnpj, // Corrigido para Cnpj
            Endereco: req.Endereco,
        }
        if err := tx.Create(instituicao).Error; err != nil {
            return err
        }
        return nil
    })

    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    token, _, err := h.userService.Login(req.Email, req.Password)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao gerar token"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message": "Instituição cadastrada com sucesso",
        "token":   token,
    })
}

func (h *UserController) ForgotPassword(c *gin.Context) {
	var req ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.userService.ForgotPassword(req.Email); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email de recuperação enviado (se o email existir)"})
}

func (h *UserController) ResetPassword(c *gin.Context) {
	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.userService.ResetPassword(req.Token, req.NewPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Senha atualizada com sucesso"})
}