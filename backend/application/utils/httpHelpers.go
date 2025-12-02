package utils

import (
	"errors"
	"github.com/gin-gonic/gin"
)

func SendError(c *gin.Context, code int, message string) {
	c.JSON(code, gin.H{"error": message})
}

func GetInstituicaoIDFromContext(c *gin.Context) (uint, error) {
	id, exists := c.Get("userID")
	if !exists {
		return 0, errors.New("chave 'userID' (ID da instituição) não encontrada no contexto")
	}

	instituicaoID, ok := id.(uint) 
	if !ok {
		if idFloat, ok := id.(float64); ok {
			return uint(idFloat), nil
		}
		return 0, errors.New("formato de 'userID' inválido no contexto")
	}

	return instituicaoID, nil
}