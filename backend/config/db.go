package config

import (
	"backend/application/model"
	"fmt"
	"log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect(cfg *Config) (*gorm.DB, error) {
	databaseURL := cfg.DatabaseURL

	if databaseURL == "" {
		return nil, fmt.Errorf("a variável de ambiente DATABASE_URL não foi definida")
	}

	// ✅ Garante compatibilidade com Supabase
	// Evita o erro: prepared statement already exists (SQLSTATE 42P05)
	// Se já tiver parâmetros, apenas acrescente "&statement_cache_mode=describe"
	if !containsStatementCacheMode(databaseURL) {
		databaseURL += "?sslmode=require&statement_cache_mode=describe"
	}

	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  databaseURL,
		PreferSimpleProtocol: true, // força o driver a usar simple queries
	}), &gorm.Config{
		PrepareStmt: false,
	})
	
	if err != nil {
		return nil, fmt.Errorf("erro ao conectar ao banco de dados: %w", err)
	}

	// ✅ Garante que a sessão do GORM também não use prepared statements
	db = db.Session(&gorm.Session{PrepareStmt: false})

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("erro ao obter instância DB: %w", err)
	}

	// ✅ Ajusta conexões para estabilidade
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetMaxOpenConns(10)

	log.Println("✅ Conexão com o banco de dados estabelecida com sucesso!")
	return db, nil
}

// Pequeno helper para evitar duplicar o parâmetro na URL
func containsStatementCacheMode(url string) bool {
	return (len(url) > 0 && 
		(len(url) >= 25 && 
			(url[len(url)-25:] == "statement_cache_mode=describe" ||
				url[len(url)-26:] == "&statement_cache_mode=describe")))
}

func RunMigrations(db *gorm.DB) error {
	return db.AutoMigrate(
		&model.User{},
		&model.InstituicaoEnsino{},
		&model.Aluno{},
		&model.Professor{},
		&model.EmpresaParceira{},
		&model.Vantagem{},
		&model.TransacaoMoeda{},
		&model.ResgateVantagem{},
	)
}
