package config

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL  string
	JWTSecret    string
	SMTPHost     string
	SMTPPort     string
	SMTPUser     string
	SMTPPassword string
	FrontendURL  string
}

// Função principal para carregar a configuração
func LoadConfig() *Config {

	envPath, err := findEnvFile()
	if err != nil {
		log.Printf("⚠️  Aviso: arquivo .env não encontrado, usando variáveis do ambiente.")
	} else {
		_ = godotenv.Load(envPath)
		log.Printf("✅ Arquivo .env carregado de: %s\n", envPath)
	}

	cfg := &Config{
		DatabaseURL:  os.Getenv("DATABASE_URL"),
		JWTSecret:    os.Getenv("JWT_SECRET"),
		SMTPHost:     os.Getenv("SMTP_HOST"),
		SMTPPort:     os.Getenv("SMTP_PORT"),
		SMTPUser:     os.Getenv("SMTP_USER"),
		SMTPPassword: os.Getenv("SMTP_PASSWORD"),
	}

	return cfg
}

func findEnvFile() (string, error) {
	dir, _ := os.Getwd()
	for {
		envPath := filepath.Join(dir, ".env")
		if _, err := os.Stat(envPath); err == nil {
			return envPath, nil
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}
	return "", fmt.Errorf(".env não encontrado")
}
