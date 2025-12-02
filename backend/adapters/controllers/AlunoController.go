package controllers

import (
	"backend/application/model"
	"backend/application/services"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type AlunoController struct {
	alunoService *services.AlunoService
	transacaoService *services.TransacaoMoedaService
}

type UpdateSaldoRequest struct {
    Valor int `json:"valor" binding:"required"` 
}

func NewAlunoController(alunoService *services.AlunoService, transacaoService *services.TransacaoMoedaService) *AlunoController {
	return &AlunoController{alunoService: alunoService, transacaoService: transacaoService}
}

func (h *AlunoController) GetPerfil(c *gin.Context) {
	userID := c.GetUint("user_id")

	aluno, err := h.alunoService.GetAlunoByUserID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Aluno não encontrado"})
		return
	}

	c.JSON(http.StatusOK, aluno)
}

func (h *AlunoController) UpdatePerfil(c *gin.Context) {
	userID := c.GetUint("user_id")

	var input services.UpdateAlunoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedAluno, err := h.alunoService.UpdateAlunoPerfil(userID, &input)
	if err != nil {
		if err.Error() == "email já está em uso por outra conta" || err.Error() == "CPF já está em uso por outra conta" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar perfil"})
		return
	}

	c.JSON(http.StatusOK, updatedAluno)
}

func (h *AlunoController) DeletePerfil(c *gin.Context) {
	userID := c.GetUint("user_id")

	if err := h.alunoService.DeleteAlunoPerfil(userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Aluno e usuário associado deletados com sucesso"})
}

func (h *AlunoController) GetExtrato(c *gin.Context) {
	userID := c.GetUint("user_id")

	extrato, err := h.alunoService.GetExtrato(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, extrato)
}

func (h *AlunoController) ListAlunos(c *gin.Context) {
	alunos, err := h.alunoService.ListAlunos()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, alunos)
}

func (c *AlunoController) UpdateSaldo(ctx *gin.Context) {
    userID := ctx.GetUint("user_id") // vem do JWT

    // Faz o parse do body
    var req UpdateSaldoRequest
    if err := ctx.ShouldBindJSON(&req); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Requisição inválida: " + err.Error()})
        return
    }

    // Atualiza o saldo do aluno pelo user_id
    err := c.alunoService.UpdateSaldoByUserID(userID, req.Valor)
    if err != nil {
        if err.Error() == "saldo insuficiente" {
            ctx.JSON(http.StatusConflict, gin.H{"error": "Saldo insuficiente"})
            return
        }
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar saldo: " + err.Error()})
        return
    }

    // Busca o aluno atualizado pelo user_id
    aluno, err := c.alunoService.GetAlunoByUserID(userID)
    if err != nil {
         ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Saldo atualizado, mas falha ao buscar perfil"})
         return
    }

	transacao := &model.TransacaoMoeda{
		AlunoID:   &aluno.ID,
		ProfessorID: nil,
		Valor:     req.Valor,
		Motivo:   "Resgate de Vantagem",
		DataHora: time.Now(),
	}

	c.transacaoService.CreateTransacao(transacao)
    ctx.JSON(http.StatusOK, aluno)
}


func (c *AlunoController) GetAlunosByPrefix(ctx *gin.Context) {
	prefix := ctx.Query("prefix")
	if prefix == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Prefixo é obrigatório"})
		return
	}

	alunos, err := c.alunoService.GetAlunosByPrefix(prefix)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar alunos: " + err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, alunos)
}