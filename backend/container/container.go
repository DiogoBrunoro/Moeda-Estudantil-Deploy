package container

import (
	"backend/adapters/controllers"
	"backend/adapters/repositories"
	"backend/application/services"
	"backend/config"

	"gorm.io/gorm"
)

type Container struct {
	UserController        *controllers.UserController
	AlunoController       *controllers.AlunoController
	ProfessorController   *controllers.ProfessorController
	EmpresaController     *controllers.EmpresaParceiraController
	InstituicaoController *controllers.InstituicaoController
	VantagemController    *controllers.VantagemController
	ParceriaController    *controllers.ParceriaController

	Config *config.Config
}

func NewContainer(db *gorm.DB, cfg *config.Config) *Container {

	// --- Repositories ---
	alunoRepo := repositories.NewAlunoRepository(db)
	userRepo := repositories.NewUserRepository(db)
	empresaRepo := repositories.NewEmpresaParceiraRepository(db)
	professorRepo := repositories.NewProfessorRepository(db)
	resgateVantagemRepo := repositories.NewResgateVantagemRepository(db)
	transacaoMoedaRepo := repositories.NewTransacaoMoedaRepository(db)
	vantagemRepo := repositories.NewVantagemRepository(db)
	instituicaoRepo := repositories.NewInstituicaoEnsinoRepository(db)
	parceriaRepo := repositories.NewParceriaRepository(db)

	// --- Services ---
	emailService := services.NewEmailService(cfg)
	alunoService := services.NewAlunoService(alunoRepo, userRepo, emailService, transacaoMoedaRepo)
	userService := services.NewUserService(userRepo, cfg, db) 
	empresaService := services.NewEmpresaParceiraService(empresaRepo, userRepo)

	professorService := services.NewProfessorService(professorRepo, alunoRepo, transacaoMoedaRepo)

	resgateVantagemService := services.NewResgateVantagemService(resgateVantagemRepo, alunoRepo, vantagemRepo, emailService, transacaoMoedaRepo)
	transacaoMoedaService := services.NewTransacaoMoedaService(transacaoMoedaRepo, professorRepo, alunoRepo, emailService)
	vantagemService := services.NewVantagemService(vantagemRepo, empresaRepo, resgateVantagemRepo, alunoRepo)

	instituicaoService := services.NewInstituicaoService(instituicaoRepo, professorRepo, userRepo, parceriaRepo)
	parceriaService := services.NewParceriaService(parceriaRepo)

	// --- Controllers ---
	userController := controllers.NewUserController(userService, alunoService, empresaService)
	alunoController := controllers.NewAlunoController(alunoService, transacaoMoedaService)

	professorController := controllers.NewProfessorController(professorService)

	empresaController := controllers.NewEmpresaParceiraController(empresaService, vantagemService)

	instituicaoController := controllers.NewInstituicaoController(instituicaoService)

	vantagemController := controllers.NewVantagemController(vantagemService, resgateVantagemService)

	parceriaController := controllers.NewParceriaController(parceriaService)

	return &Container{
		UserController:        userController,
		AlunoController:       alunoController,
		ProfessorController:   professorController,
		EmpresaController:     empresaController,
		InstituicaoController: instituicaoController,
		VantagemController:    vantagemController,
		ParceriaController:    parceriaController,
		Config:                cfg,
	}

}
