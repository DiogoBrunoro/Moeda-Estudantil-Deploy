package routes

import (
	"backend/container"
	"backend/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, c *container.Container) {

	public := r.Group("/api")
	{
		public.POST("/auth/login", c.UserController.Login)
		public.POST("/auth/register/aluno", c.UserController.RegisterAluno)
		public.POST("/auth/register/empresa", c.UserController.RegisterEmpresa)
		public.POST("/auth/register/instituicao", c.UserController.RegisterInstituicao)
		public.GET("/instituicoes", c.InstituicaoController.ListInstituicoes)
		public.GET("/vantagens", c.VantagemController.ListVantagens)

		public.POST("/auth/forgot-password", c.UserController.ForgotPassword)
		public.POST("/auth/reset-password", c.UserController.ResetPassword)
	}

	protected := r.Group("/api")
	protected.Use(middlewares.AuthMiddleware(c.Config.JWTSecret))
	{
		aluno := protected.Group("/aluno")
		aluno.Use(middlewares.RoleMiddleware("aluno"))
		{
			aluno.GET("/perfil", c.AlunoController.GetPerfil)
			aluno.GET("/extrato", c.AlunoController.GetExtrato)
			aluno.POST("/resgatar-vantagem", c.VantagemController.ResgatarVantagem)
			aluno.GET("/vantagens", c.VantagemController.ListVantagensParaAluno)
			aluno.PUT("", c.AlunoController.UpdatePerfil)
			aluno.DELETE("", c.AlunoController.DeletePerfil)
			aluno.PATCH("/saldo", c.AlunoController.UpdateSaldo)
			aluno.GET("/prefix", c.AlunoController.GetAlunosByPrefix)
		}

		professor := protected.Group("/professor")
		professor.Use(middlewares.RoleMiddleware("professor"))
		{
			professor.GET("/perfil", c.ProfessorController.GetPerfil)
			professor.GET("/extrato", c.ProfessorController.GetExtrato)
			professor.POST("/enviar-moedas", c.ProfessorController.EnviarMoedas)
			professor.GET("/alunos", c.AlunoController.ListAlunos)
			professor.GET("/prefix", c.AlunoController.GetAlunosByPrefix)

		}

		empresa := protected.Group("/empresa")
		empresa.Use(middlewares.RoleMiddleware("empresa"))
		{
			empresa.GET("/perfil", c.EmpresaController.GetPerfil)
			empresa.PUT("", c.EmpresaController.AtualizarEmpresa)
			empresa.POST("/vantagens", c.EmpresaController.CriarVantagem)
			empresa.PUT("/vantagens/:id", c.EmpresaController.AtualizarVantagem)
			empresa.DELETE("/vantagens/:id", c.EmpresaController.DeletarVantagem)
			empresa.GET("/vantagens", c.EmpresaController.ListVantagens)
			empresa.GET("/vantagens/:id", c.EmpresaController.GetVantagem)
			empresa.GET("/resgates", c.EmpresaController.ListResgates)
			empresa.GET("/parcerias", c.ParceriaController.GetParceriasByEmpresa)
		}

		instituicao := protected.Group("/instituicao")
		instituicao.Use(middlewares.RoleMiddleware("instituicao"))
		{
			instituicao.GET("/perfil", c.InstituicaoController.GetPerfil)
			instituicao.PUT("", c.InstituicaoController.AtualizarInstituicao)

			instituicao.POST("/professores", c.InstituicaoController.RegisterProfessor)
			instituicao.GET("/professores", c.InstituicaoController.ListProfessores)
			instituicao.GET("/professores/:id", c.InstituicaoController.GetProfessor)
			instituicao.PUT("/professores/:id", c.InstituicaoController.UpdateProfessor)
			instituicao.DELETE("/professores/:id", c.InstituicaoController.DeleteProfessor)

			instituicao.GET("/alunos", c.AlunoController.ListAlunos)

			instituicao.GET("/parcerias", c.ParceriaController.GetParceriasByInstituicao)
			instituicao.POST("/parcerias/empresa/:id", c.ParceriaController.SolicitarParceria)
			instituicao.DELETE("/parcerias/empresa/:id", c.ParceriaController.RemoverParceria)
		}
	}
}
