package services

import (
	"backend/config"
	"bytes"
	"encoding/base64"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"net/smtp"
	"net/textproto"
	"strings"

	"github.com/google/uuid"
	"github.com/skip2/go-qrcode"
)

type EmailService struct {
	config *config.Config
}

type InlineImage struct {
	CID  string
	Data []byte
	Mime string
}

func NewEmailService(cfg *config.Config) *EmailService {
	return &EmailService{config: cfg}
}

func (s *EmailService) SendEmail(to, subject, body string, inlineImages []InlineImage) error {
	from := s.config.SMTPUser
	password := s.config.SMTPPassword
	addr := fmt.Sprintf("%s:%s", s.config.SMTPHost, s.config.SMTPPort)
	auth := smtp.PlainAuth("", from, password, s.config.SMTPHost)

	if len(inlineImages) == 0 {
		msg := []byte(fmt.Sprintf("To: %s\r\n"+
			"Subject: %s\r\n"+
			"Content-Type: text/html; charset=UTF-8\r\n"+
			"\r\n"+
			"%s\r\n", to, subject, body))
		err := smtp.SendMail(addr, auth, from, []string{to}, msg)
		if err != nil {
			return fmt.Errorf("erro ao enviar email simples: %w", err)
		}
		return nil
	}


	buf := new(bytes.Buffer)
	writer := multipart.NewWriter(buf)
	boundary := writer.Boundary()

	fmt.Fprintf(buf, "To: %s\r\n", to)
	fmt.Fprintf(buf, "From: %s\r\n", from)
	fmt.Fprintf(buf, "Subject: %s\r\n", subject)
	fmt.Fprintf(buf, "MIME-Version: 1.0\r\n")
	fmt.Fprintf(buf, "Content-Type: multipart/related; boundary=\"%s\"\r\n\r\n", boundary)

	htmlHeader := make(textproto.MIMEHeader)
	htmlHeader.Set("Content-Type", "text/html; charset=UTF-8")
	partWriter, err := writer.CreatePart(htmlHeader)
	if err != nil {
		return fmt.Errorf("erro ao criar parte HTML: %w", err)
	}
	_, err = partWriter.Write([]byte(body))
	if err != nil {
		return fmt.Errorf("erro ao escrever parte HTML: %w", err)
	}

	for _, img := range inlineImages {
		imgHeader := make(textproto.MIMEHeader)
		mimeType := "image/png"
		if img.Mime != "" {
			mimeType = img.Mime
		}

		imgHeader.Set("Content-Type", mimeType)
		imgHeader.Set("Content-Transfer-Encoding", "base64")
		imgHeader.Set("Content-ID", "<"+img.CID+">")
		imgHeader.Set("Content-Disposition", "inline")

		partWriter, err = writer.CreatePart(imgHeader)
		if err != nil {
			return fmt.Errorf("erro ao criar parte da imagem: %w", err)
		}

		b64Writer := base64.NewEncoder(base64.StdEncoding, partWriter)
		_, err = b64Writer.Write(img.Data)
		if err != nil {
			return fmt.Errorf("erro ao escrever dados da imagem: %w", err)
		}
		b64Writer.Close()
	}

	writer.Close()

	err = smtp.SendMail(addr, auth, from, []string{to}, buf.Bytes())
	if err != nil {
		return fmt.Errorf("erro ao enviar email multipart: %w", err)
	}

	return nil
}

func (s *EmailService) SendMoedasRecebidas(toEmail, alunoNome, professorNome string, valor int, motivo string) error {
	subject := "Você recebeu moedas!"
	body := fmt.Sprintf(`
        <html style="font-family: Arial, sans-serif;">
        <body>
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
	var images []InlineImage

	pngData, err := qrcode.Encode(codigoCupom, qrcode.Medium, 256)
	if err != nil {
		fmt.Printf("ERRO: Falha ao gerar QR code para o aluno %s: %v\n", alunoNome, err)
		return fmt.Errorf("falha ao gerar QR code: %w", err)
	}

	qrCid := "qrcode-" + uuid.New().String()
	images = append(images, InlineImage{CID: qrCid, Data: pngData, Mime: "image/png"})

	var vantagemImgHtml string
	if vantagemImagemUrl != "" {
		imgData, mimeType, err := s.downloadImage(vantagemImagemUrl)
		if err == nil {
			vantagemCid := "vantagem-" + uuid.New().String()
			images = append(images, InlineImage{CID: vantagemCid, Data: imgData, Mime: mimeType})

			// Cria o HTML para a imagem da vantagem
			vantagemImgHtml = fmt.Sprintf(`
				<div style="margin: 20px 0;">
					<img src="cid:%s" alt="%s" style="max-width: 100%%; max-height: 250px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
				</div>
			`, vantagemCid, vantagemTitulo)
		} else {
			fmt.Printf("AVISO: Não foi possível baixar imagem da vantagem para email: %v\n", err)
		}
	}

	subject := "Cupom de Resgate - " + vantagemTitulo
	body := fmt.Sprintf(`
        <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px; color: #333;">
            <h2>Olá, %s!</h2>
            <p>Seu resgate foi realizado com sucesso!</p>
            <p style="font-size: 18px;"><strong>Vantagem:</strong> %s</p>
            
            %s <!-- Imagem da vantagem -->

            <p style="margin-top: 25px;"><strong>Código do Cupom:</strong></p>
            <p style="font-size: 24px; font-weight: bold; color: #007bff; margin: 10px; padding: 15px; border: 2px dashed #007bff; display: inline-block; background: #f4faff;">
                %s
            </p>
            
            <p style="margin-top: 25px;"><strong>Ou apresente este QR Code:</strong></p>
            
            <img src="cid:%s" alt="QR Code do Cupom" style="width: 200px; height: 200px; margin: 10px auto; display: block;">
            
            <p style="margin-top: 30px; color: #555; font-size: 14px;">
                Apresente este código ou o QR Code no estabelecimento parceiro para utilizar sua vantagem.
            </p>
        </body>
        </html>
    `, alunoNome, vantagemTitulo, vantagemImgHtml, codigoCupom, qrCid)

	return s.SendEmail(toEmail, subject, body, images)
}

func (s *EmailService) SendNotificacaoEmpresa(toEmail, empresaNome, alunoNome, vantagemTitulo, codigoCupom string) error {
	subject := "Novo Resgate de Vantagem"

	var pngData []byte
	pngData, err := qrcode.Encode(codigoCupom, qrcode.Medium, 256)
	if err != nil {
		fmt.Printf("ERRO: Falha ao gerar QR code para notificar empresa %s: %v\n", empresaNome, err)
		return fmt.Errorf("falha ao gerar QR code para notificação: %w", err)
	}

	cid := "qrcode-" + uuid.New().String()

	body := fmt.Sprintf(`
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Olá, %s!</h2>
            <p>Um aluno realizou o resgate de uma vantagem.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p><strong>Aluno:</strong> %s</p>
            <p><strong>Vantagem:</strong> %s</p>
            
            <p style="margin-top: 25px;"><strong>Código do Cupom:</strong></p>
            <p style="font-size: 24px; font-weight: bold; color: #007bff; margin: 10px 0; padding: 15px; border: 2px dashed #007bff; display: inline-block; background: #f4faff;">
                %s
            </p>
            
            <p style="margin-top: 25px;"><strong>QR Code para validação:</strong></p>
            
            <!-- 🔹 Imagem agora usa src="cid:..." -->
            <img src="cid:%s" alt="QR Code do Cupom" style="width: 200px; height: 200px; margin: 10px 0; display: block;">
            
            <p style="margin-top: 30px; color: #555; font-size: 14px;">
                Aguarde a apresentação deste código ou QR Code para validar o resgate.
            </p>
        </body>
        </html>
    `, empresaNome, alunoNome, vantagemTitulo, codigoCupom, cid)

	inlineImage := InlineImage{
		CID:  cid,
		Data: pngData,
		Mime: "image/png", 
	}

	return s.SendEmail(toEmail, subject, body, []InlineImage{inlineImage})
}

func (s *EmailService) downloadImage(url string) ([]byte, string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, "", fmt.Errorf("status code error: %d %s", resp.StatusCode, resp.Status)
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, "", err
	}

	mimeType := http.DetectContentType(data)
	if strings.Contains(strings.ToLower(url), ".png") {
		mimeType = "image/png"
	} else if strings.Contains(strings.ToLower(url), ".jpg") || strings.Contains(strings.ToLower(url), ".jpeg") {
		mimeType = "image/jpeg"
	}

	return data, mimeType, nil
}