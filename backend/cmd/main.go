package main

import (
	"backend/adapters/routes"
	"backend/config"
	"backend/container"
	"log"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Carrega configurações
	cfg := config.LoadConfig()

	// Conecta ao banco
	db, err := config.Connect(cfg)
	if err != nil {
		log.Fatalf("❌ Falha ao conectar ao banco: %v", err)
	}

	// Se precisar rodar migrations
	// if err := config.RunMigrations(db); err != nil {
	// 	log.Printf("❌ Falha ao migrar o banco de dados: %v", err)
	// }

	// Inicializa container de dependências
	c := container.NewContainer(db, cfg)

	// Cria router Gin
	r := gin.Default()

	// Configura CORS
	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			// Permite localhost e o frontend deployado no Vercel
			return strings.HasPrefix(origin, "http://localhost:3000") ||
				strings.HasPrefix(origin, "https://moeda-estudantil-deploy.vercel.app")
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
	

	// Configura rotas
	routes.SetupRoutes(r, c)

	// Pega porta do Render via variável de ambiente
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // fallback local
	}

	log.Printf("🚀 Servidor iniciado na porta %s", port)
	// Inicia servidor
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("❌ Falha ao iniciar servidor: %v", err)
	}
}
