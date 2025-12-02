// backend/application/controllers/parceria_controller.go
package controllers

import (
	"backend/application/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ParceriaController struct {
	service *services.ParceriaService
}

func NewParceriaController(s *services.ParceriaService) *ParceriaController {
	return &ParceriaController{
		service: s,
	}
}

// Rota: GET /api/parcerias/instituicao
func (ctrl *ParceriaController) GetParceriasByInstituicao(c *gin.Context) {
	// A instituição logada lista suas parcerias
	// Assumindo que o middleware injeta "instituicao_id" no contexto
	instituicaoID := c.GetUint("instituicao_id")
	if instituicaoID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário (Instituição) não autorizado"})
		return
	}

	parcerias, err := ctrl.service.ListParceriasByInstituicao(instituicaoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao listar parcerias: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, parcerias)
}

// Rota: GET /api/parcerias/empresa
func (ctrl *ParceriaController) GetParceriasByEmpresa(c *gin.Context) {
	// A empresa logada lista suas parcerias
	// Assumindo que o middleware injeta "empresa_id" no contexto
	empresaID := c.GetUint("empresa_id")
	if empresaID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário (Empresa) não autorizado"})
		return
	}

	parcerias, err := ctrl.service.ListParceriasByEmpresa(empresaID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao listar parcerias: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, parcerias)
}

// Rota: POST /api/parcerias/empresa/:id
func (ctrl *ParceriaController) SolicitarParceria(c *gin.Context) {
	// A instituição logada solicita parceria com uma empresa
	instituicaoID := c.GetUint("instituicao_id")
	if instituicaoID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário (Instituição) não autorizado"})
		return
	}

	empresaIDParam := c.Param("id")
	empresaID, err := strconv.ParseUint(empresaIDParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID da empresa inválido"})
		return
	}

	parceria, err := ctrl.service.CreateParceria(instituicaoID, uint(empresaID))
	if err != nil {
		// Ex: "Parceria já existe"
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, parceria)
}

// Rota: DELETE /api/parcerias/empresa/:id
func (ctrl *ParceriaController) RemoverParceria(c *gin.Context) {
	// A instituição logada remove uma parceria
	instituicaoID := c.GetUint("instituicao_id")
	if instituicaoID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário (Instituição) não autorizado"})
		return
	}

	empresaIDParam := c.Param("id")
	empresaID, err := strconv.ParseUint(empresaIDParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID da empresa inválido"})
		return
	}

	if err := ctrl.service.DeleteParceria(instituicaoID, uint(empresaID)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// Segue o padrão do AlunoController.DeletePerfil
	c.JSON(http.StatusOK, gin.H{"message": "Parceria removida com sucesso"})
}