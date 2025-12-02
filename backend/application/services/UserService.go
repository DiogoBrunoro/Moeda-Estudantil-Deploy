package services

import (
	"backend/adapters/repositories"
	"backend/application/model"
	"backend/config"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService struct {
	userRepo *repositories.UserRepository
	emailService *EmailService
	config   *config.Config
	DB       *gorm.DB
}


func (s *UserService) HashPassword(password string) (any, any) {
	panic("unimplemented")
}

func NewUserService(userRepo *repositories.UserRepository, cfg *config.Config, db *gorm.DB) *UserService {
	return &UserService{
		userRepo:    userRepo,
		emailService: NewEmailService(cfg), 
		config:     cfg,
		DB:         db,
	}
}


func (s *UserService) Login(email, password string) (string, *model.User, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", nil, errors.New("credenciais inválidas")
		}
		return "", nil, err
	}

	// Verificar senha
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return "", nil, errors.New("credenciais inválidas")
	}

	// Gerar token JWT
	token, err := s.generateToken(user)
	if err != nil {
		return "", nil, err
	}

	return token, user, nil
}

func (s *UserService) CreateUser(email, password, role string) (*model.User, error) {
	// Verificar se usuário já existe
	existingUser, err := s.userRepo.FindByEmail(email)
	if err == nil && existingUser != nil {
		return nil, errors.New("email já cadastrado")
	}

	// Hash da senha
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &model.User{
		Email:        email,
		PasswordHash: string(hashedPassword),
		Role:         role,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) generateToken(user *model.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 dias
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.config.JWTSecret))
}

func (s *UserService) generateResetToken(user *model.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"type":    "reset_password",                     
		"exp":     time.Now().Add(time.Hour * 1).Unix(), 
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.config.JWTSecret))
}

func (s *UserService) ForgotPassword(email string) error {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}

	// Gerar token de recuperação específico (duração curta, ex: 1 hora)
	resetToken, err := s.generateResetToken(user)
	if err != nil {
		return err
	}

	resetLink := fmt.Sprintf("http://localhost:3000/reset-password?token=%s", resetToken)

	subject := "Recuperação de Senha - Sistema de Moedas"
	body := fmt.Sprintf(`
		<html>
		<body style="font-family: Arial, sans-serif; color: #333;">
			<h2>Olá!</h2>
			<p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
			<p>Clique no botão abaixo para criar uma nova senha:</p>
			
			<p style="margin: 20px 0;">
				<a href="%s" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Redefinir Minha Senha</a>
			</p>
			
			<p style="font-size: 14px; color: #666;">Este link é válido por 1 hora.</p>
			<p style="font-size: 14px; color: #666;">Se você não solicitou esta alteração, por favor ignore este email.</p>
			<hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
			<p style="font-size: 12px; color: #999;">Caso o botão não funcione, copie e cole o link no seu navegador: %s</p>
		</body>
		</html>
	`, resetLink, resetLink)

	return s.emailService.SendEmail(user.Email, subject, body, nil)
}

func (s *UserService) ResetPassword(tokenString, newPassword string) error {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("método de assinatura inesperado: %v", token.Header["alg"])
		}
		return []byte(s.config.JWTSecret), nil
	})

	if err != nil || !token.Valid {
		return errors.New("token inválido ou expirado")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return errors.New("claims inválidos")
	}

	tokenType, ok := claims["type"].(string)
	if !ok || tokenType != "reset_password" {
		return errors.New("tipo de token inválido")
	}

	email, ok := claims["email"].(string)
	if !ok {
		return errors.New("email inválido no token")
	}

	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return errors.New("usuário não encontrado")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.PasswordHash = string(hashedPassword)
	if err := s.userRepo.Update(user); err != nil {
		return err
	}

	return nil
}