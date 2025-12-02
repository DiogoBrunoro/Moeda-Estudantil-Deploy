package jwtutil

import (
    "errors" 
    "fmt"
    "time"

    "github.com/golang-jwt/jwt/v5" 
)

var (
    ErrInvalidToken     = fmt.Errorf("invalid token")
    ErrExpiredToken     = fmt.Errorf("token expired")
    ErrSignatureInvalid = fmt.Errorf("invalid token signature")
)

type JWTManager struct {
    secretKey []byte
}

func NewJWTManager(secretKey string) *JWTManager {
    return &JWTManager{
        secretKey: []byte(secretKey),
    }
}

func (m *JWTManager) GenerateToken(claims map[string]interface{}, duration time.Duration) (string, error) {
    stdClaims := jwt.MapClaims{
        "exp": time.Now().Add(duration).Unix(), 
        "iat": time.Now().Unix(),              
    }

    for key, value := range claims {
        stdClaims[key] = value
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, stdClaims)

    signedToken, err := token.SignedString(m.secretKey)
    if err != nil {
        return "", fmt.Errorf("falha ao assinar o token: %w", err)
    }

    return signedToken, nil
}

func (m *JWTManager) ParseToken(tokenString string) (jwt.MapClaims, error) {
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, ErrSignatureInvalid
        }
        return m.secretKey, nil
    }, jwt.WithValidMethods([]string{"HS256"})) 

    if err != nil {
        if errors.Is(err, jwt.ErrSignatureInvalid) {
            return nil, ErrSignatureInvalid
        }
        if errors.Is(err, jwt.ErrTokenExpired) {
            return nil, ErrExpiredToken
        }
        if errors.Is(err, jwt.ErrTokenNotValidYet) {
            return nil, ErrInvalidToken 
        }
        if errors.Is(err, jwt.ErrTokenMalformed) || errors.Is(err, jwt.ErrTokenInvalidId) {
            return nil, ErrInvalidToken
        }
        return nil, fmt.Errorf("falha no parse do token: %w", err)
    }

    if !token.Valid {
        return nil, ErrInvalidToken
    }

    claims, ok := token.Claims.(jwt.MapClaims)
    if !ok {
        return nil, fmt.Errorf("claims do token não são do tipo jwt.MapClaims ou estão ausentes")
    }

    return claims, nil
}