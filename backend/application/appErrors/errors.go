package appErrors

import "errors"

var (
    ErrNotFound           = errors.New("not found")
    ErrAlreadyExists      = errors.New("already exists")
    ErrInvalidCredentials = errors.New("invalid credentials")
    ErrInvalidRole        = errors.New("invalid user role for operation")
    ErrUserNotAssociated  = errors.New("user not associated with provided entity")
    ErrInstitutionNotFound = errors.New("institution not found")
    ErrInvalidPassword    = errors.New("invalid password")
    ErrCPFAlreadyInUse    = errors.New("CPF already in use")
)