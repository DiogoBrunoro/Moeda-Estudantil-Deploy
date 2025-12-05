package services

import (
	"backend/config"
	"context"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/google/uuid"
	"github.com/mailersend/mailersend-go"
	"github.com/skip2/go-qrcode"
)

type EmailService struct {
    config *config.Config
    client *mailersend.Mailersend
}


type InlineImage struct {
	CID  string
	Data []byte
	Mime string
}

func NewEmailService(cfg *config.Config) *EmailService {
	client := mailersend.NewMailersend(cfg.MailerSendAPIKey)

	return &EmailService{
		config: cfg,
		client: client,
	}
}

func (s *EmailService) SendEmail(to, subject, body string, inlineImages []InlineImage) error {

	msg := s.client.Email.NewMessage()
	msg.SetFrom(mailersend.From{ Email: s.config.EmailFrom, Name: s.config.EmailFromName })
	msg.SetRecipients([]mailersend.Recipient{
		{ Email: to, Name: to },
	})
	msg.SetSubject(subject)
	msg.SetHTML(body)

	// anexos inline
	for _, img := range inlineImages {
		encoded := base64.StdEncoding.EncodeToString(img.Data)
		msg.Attachments = append(msg.Attachments, mailersend.Attachment{
			Content:     encoded,
			Filename:    img.CID + ".png",
			Disposition: "inline",
			ID:          img.CID,
		})
	}

	_, err := s.client.Email.Send(context.Background(), msg)
	if err != nil {
		return fmt.Errorf("erro ao enviar email via MailerSend API: %w", err)
	}

	return nil
}



func (s *EmailService) SendMoedasRecebidas(toEmail, alunoNome, professorNome string, valor int, motivo string) error {
	subject := "Você recebeu moedas!"
	body := fmt.Sprintf(`
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Olá, %s!</h2>
            <p>Você recebeu <strong>%d moedas</strong> do professor <strong>%s</strong>.</p>
            <p><strong>Motivo:</strong> %s</p>
            <p>Acesse o sistema para verificar seu saldo e trocar por vantagens!</p>
        </body>
        </html>
    `, alunoNome, valor, professorNome, motivo)

	return s.SendEmail(toEmail, subject, body, nil)
}

func (s *EmailService) SendCupomResgate(toEmail, alunoNome, vantagemTitulo, codigoCupom, vantagemImagemUrl string) error {
	images := []InlineImage{}

	// QR Code
	qrData, err := qrcode.Encode(codigoCupom, qrcode.Medium, 256)
	if err != nil {
		return fmt.Errorf("erro ao gerar QR code: %w", err)
	}

	qrCID := "qrcode-" + uuid.New().String()
	images = append(images, InlineImage{CID: qrCID, Data: qrData, Mime: "image/png"})

	var vantagemImgHtml string

	// imagem da vantagem
	if vantagemImagemUrl != "" {
		imgData, mimeType, err := s.downloadImage(vantagemImagemUrl)
		if err == nil {
			vantCID := "vantagem-" + uuid.New().String()
			images = append(images, InlineImage{CID: vantCID, Data: imgData, Mime: mimeType})

			vantagemImgHtml = fmt.Sprintf(`
				<div style="margin: 20px 0;">
					<img src="cid:%s" alt="%s" style="max-width: 100%%; max-height: 250px; border-radius: 8px;">
				</div>
			`, vantCID, vantagemTitulo)
		}
	}

	subject := "Cupom de Resgate - " + vantagemTitulo

	body := fmt.Sprintf(`
        <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px; color: #333;">
            <h2>Olá, %s!</h2>
            <p>Seu resgate foi realizado com sucesso!</p>
            <p style="font-size: 18px;"><strong>Vantagem:</strong> %s</p>

            %s

            <p style="font-size: 24px; font-weight: bold; color: #007bff; margin: 10px; padding: 15px; border: 2px dashed #007bff; display: inline-block; background: #f4faff;">
                %s
            </p>

            <img src="cid:%s" style="width: 200px; height: 200px; margin: 20px auto;">
        </body>
        </html>
    `, alunoNome, vantagemTitulo, vantagemImgHtml, codigoCupom, qrCID)

	return s.SendEmail(toEmail, subject, body, images)
}

func (s *EmailService) SendNotificacaoEmpresa(toEmail, empresaNome, alunoNome, vantagemTitulo, codigoCupom string) error {
	qrData, err := qrcode.Encode(codigoCupom, qrcode.Medium, 256)
	if err != nil {
		return fmt.Errorf("erro ao gerar QR code: %w", err)
	}

	cid := "qrcode-" + uuid.New().String()

	body := fmt.Sprintf(`
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Olá, %s!</h2>
            <p>Um aluno realizou o resgate de uma vantagem.</p>

            <p><strong>Aluno:</strong> %s</p>
            <p><strong>Vantagem:</strong> %s</p>

            <p style="font-size: 24px; font-weight: bold; border: 2px dashed #007bff; display: inline-block; padding: 15px;">
                %s
            </p>

            <img src="cid:%s" style="width: 200px; height: 200px; margin-top: 20px;">
        </body>
        </html>
    `, empresaNome, alunoNome, vantagemTitulo, codigoCupom, cid)

	inlineImage := InlineImage{
		CID:  cid,
		Data: qrData,
		Mime: "image/png",
	}

	return s.SendEmail(toEmail, "Novo Resgate de Vantagem", body, []InlineImage{inlineImage})
}

func (s *EmailService) downloadImage(url string) ([]byte, string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, "", fmt.Errorf("erro ao baixar imagem: %d", resp.StatusCode)
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, "", err
	}

	mimeType := http.DetectContentType(data)

	if strings.Contains(url, ".png") {
		mimeType = "image/png"
	}
	if strings.Contains(url, ".jpg") || strings.Contains(url, ".jpeg") {
		mimeType = "image/jpeg"
	}

	return data, mimeType, nil
}
