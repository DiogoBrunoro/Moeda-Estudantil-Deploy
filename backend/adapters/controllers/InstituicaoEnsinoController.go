package controllers

import (
	"backend/application/model"
	"backend/application/services" // DTOs virão daqui
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)
// Pacotes 'utils' e 'dto' foram removidos

type InstituicaoController struct {
	service *services.InstituicaoService
}

func NewInstituicaoController(s *services.InstituicaoService) *InstituicaoController {
	return &InstituicaoController{
		service: s,
	}
}

// Rota: GET /api/instituicoes
func (ctrl *InstituicaoController) ListInstituicoes(c *gin.Context) {
	instituicoes, err := ctrl.service.ListInstituicoes()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao listar instituições"})
		return
	}
	c.JSON(http.StatusOK, instituicoes)
}

// Rota: GET /api/instituicao/perfil
func (ctrl *InstituicaoController) GetPerfil(c *gin.Context) {
	userID := c.GetUint("user_id")
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário (Instituição) não autorizado"})
		return
	}

	perfil, err := ctrl.service.GetInstituicaoByUserID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Perfil da instituição não encontrado"})
		return
	}

	c.JSON(http.StatusOK, perfil)
}

// Rota: PUT /api/instituicao
func (ctrl *InstituicaoController) AtualizarInstituicao(c *gin.Context) {
	instituicaoID := c.GetUint("instituicao_id")
	if instituicaoID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário (Instituição) não autorizado"})
		return
	}

	var input model.InstituicaoEnsino // Ou um DTO de atualização
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados de entrada inválidos"})
		return
	}

	updatedPerfil, err := ctrl.service.UpdateInstituicao(instituicaoID, &input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar perfil"})
		return
	}

	c.JSON(http.StatusOK, updatedPerfil)
}

// Rota: POST /api/instituicao/professores
func (ctrl *InstituicaoController) RegisterProfessor(c *gin.Context) {
	userID := c.GetUint("user_id")
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário (Instituição) não autorizado"})
		return
	}

	var input services.RegisterProfessorInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados de entrada inválidos: " + err.Error()})
		return
	}

	professor, err := ctrl.service.RegisterProfessor(userID, &input)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, professor)
}


// Rota: GET /api/instituicao/professores
func (ctrl *InstituicaoController) ListProfessores(c *gin.Context) {
	instituicaoID := c.GetUint("instituicao_id")
	if instituicaoID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário (Instituição) não autorizado"})
		return
	}

	professores, err := ctrl.service.ListProfessoresByInstituicao(instituicaoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao listar professores"})
		return
	}

	c.JSON(http.StatusOK, professores)
}

// Rota: GET /api/instituicao/professores/:id
func (ctrl *InstituicaoController) GetProfessor(c *gin.Context) {
	instituicaoID := c.GetUint("instituicao_id")
	if instituicaoID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário (Instituição) não autorizado"})
		return
	}

	professorID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID do professor inválido"})
		return
	}

	professor, err := ctrl.service.GetProfessorByID(instituicaoID, uint(professorID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Professor não encontrado"})
		return
	}

	c.JSON(http.StatusOK, professor)
}

// Rota: PUT /api/instituicao/professores/:id
func (ctrl *InstituicaoController) UpdateProfessor(c *gin.Context) {
	instituicaoID := c.GetUint("instituicao_id")
	if instituicaoID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário (Instituição) não autorizado"})
		return
	}

	professorID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID do professor inválido"})
		return
	}

	// CORRIGIDO: Usa o DTO do pacote 'services'
	var input services.UpdateProfessorInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados de entrada inválidos: " + err.Error()})
		return
	}

	// Agora a chamada é válida
	professor, err := ctrl.service.UpdateProfessor(instituicaoID, uint(professorID), &input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar professor"})
		return
	}

	c.JSON(http.StatusOK, professor)
}

// Rota: DELETE /api/instituicao/professores/:id
func (ctrl *InstituicaoController) DeleteProfessor(c *gin.Context) {
	instituicaoID := c.GetUint("instituicao_id")
	if instituicaoID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário (Instituição) não autorizado"})
		return
	}

	professorID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID do professor inválido"})
		return
	}

	if err := ctrl.service.DeleteProfessor(instituicaoID, uint(professorID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao deletar professor"})
		return
	}

	// Resposta padronizada (como em AlunoController)
	c.JSON(http.StatusOK, gin.H{"message": "Professor deletado com sucesso"})
}

// Rota: GET /api/instituicao/parcerias
func (ctrl *InstituicaoController) ListParcerias(c *gin.Context) {
	instituicaoID := c.GetUint("instituicao_id")
	if instituicaoID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário (Instituição) não autorizado"})
		return
	}

	parcerias, err := ctrl.service.ListParcerias(instituicaoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao listar parcerias"})
		return
	}

	c.JSON(http.StatusOK, parcerias)
}

// Rota: POST /api/instituicao/parcerias/solicitar/:empresa_id
func (ctrl *InstituicaoController) SolicitarParceria(c *gin.Context) {
	instituicaoID := c.GetUint("instituicao_id")
	if instituicaoID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário (Instituição) não autorizado"})
		return
	}

	empresaID, err := strconv.ParseUint(c.Param("empresa_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID da empresa inválido"})
		return
	}

	parceria, err := ctrl.service.CreateParceria(instituicaoID, uint(empresaID))
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()}) // Ex: "Parceria já existe"
		return
	}

	c.JSON(http.StatusCreated, parceria)
}

// Rota: DELETE /api/instituicao/parcerias/:empresa_id
func (ctrl *InstituicaoController) RemoverParceria(c *gin.Context) {
	instituicaoID := c.GetUint("instituicao_id")
	if instituicaoID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário (Instituição) não autorizado"})
		return
	}

	empresaID, err := strconv.ParseUint(c.Param("empresa_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID da empresa inválido"})
		return
	}

	if err := ctrl.service.DeleteParceria(instituicaoID, uint(empresaID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao remover parceria"})
		return
	}

	// Resposta padronizada
	c.JSON(http.StatusOK, gin.H{"message": "Parceria removida com sucesso"})
}