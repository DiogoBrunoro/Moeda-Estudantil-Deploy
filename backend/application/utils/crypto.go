package utils

import (
	"golang.org/x/crypto/bcrypt"
)

// HashPassword usa bcrypt para gerar um hash de uma senha.
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14) // 14 é o custo
	return string(bytes), err
}

// CheckPasswordHash compara uma senha em texto puro com seu hash bcrypt.
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}