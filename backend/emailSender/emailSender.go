package emailsender

import (
	"backend/config"
	"crypto/tls"
	"fmt"
	"strconv"
	"strings"

	"gopkg.in/gomail.v2"
)

// SendEmail envia um email via SMTP configurado em config.LoadConfig().
// Retorna erro para o chamador lidar (log, retry, etc).
// sender: email remetente (ex: "Prof Nome <prof@escola.com>")
// to: destinatário (ex: "aluno@example.com")
// tipo: "moeda" ou outros tipos que você queira tratar
// valor: usado no tipo "moeda"
func SendEmail( to string, tipo string, valor int) error {
	cfg := config.LoadConfig()

	host := strings.TrimSpace(cfg.SMTPHost)
	portStr := strings.TrimSpace(cfg.SMTPPort)
	user := strings.TrimSpace(cfg.SMTPUser)
	password := strings.TrimSpace(cfg.SMTPPassword)

	if host == "" || portStr == "" || user == "" || password == "" {
		return fmt.Errorf("configuração SMTP incompleta (host/port/user/password)")
	}

	port, err := strconv.Atoi(portStr)
	if err != nil {
		return fmt.Errorf("porta SMTP inválida: %w", err)
	}

	msg := gomail.NewMessage()

	sender := user

	// Se o caller passou apenas um email como sender (ex: "prof@ex.com"), define From simples.
	// Se passou "Nome <email>" o gomail aceita diretamente.
	msg.SetHeader("From", sender)
	msg.SetHeader("To", to)

	// Subject dinâmico por tipo
	switch tipo {
	case "aluno":
		msg.SetHeader("Subject", fmt.Sprintf("🎉 Parabéns! Você recebeu %d moedas do seu professor!", valor))
	case "professor" :
		msg.SetHeader("Subject", "Confirmação de envio de moedas")
	default:
		msg.SetHeader("Subject", "Notificação do sistema")
	}

	// Corpo HTML — customize conforme necessário
	switch tipo {
	case "aluno":
	body := fmt.Sprintf(`
	<table width="100%%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;padding:20px 0;">
	  <tr>
	    <td align="center">
	      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:10px;padding:24px;text-align:center;font-family:Arial, sans-serif;">
	        <tr>
	          <td>
	            <h2 style="color:#333;margin-bottom:6px;">🎉 Parabéns!</h2>
				<p style="font-size:16px;color:#555;margin-top:0;">%s</p>
	            <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNm9wb2RhZXp3N2F5MnM4bWQ1NTB1MTM5c2Jza2k3bnVmYm92NXlueiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13kdbpQWKWKjQI/giphy.gif" 
	                 alt="celebration" width="360" style="display:block;margin:12px auto;border-radius:8px;" />
	            <p style="font-size:14px;color:#888;margin-top:8px;">Continue se esforçando! 💪</p>
	          </td>
	        </tr>
	      </table>
	    </td>
	  </tr>
	</table>`, subjectBody(tipo, valor))
	msg.SetBody("text/html", body)
	case "professor" :
	body := fmt.Sprintf(`
	<table width="100%%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;padding:20px 0;">
	  <tr>
	    <td align="center">
	      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:10px;padding:24px;text-align:center;font-family:Arial, sans-serif;">
	        <tr>
	          <td>
	            <h2 style="color:#333;margin-bottom:6px;">🎉 Parabéns!</h2>
				<p style="font-size:16px;color:#555;margin-top:0;">%s</p>
	            <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNm9wb2RhZXp3N2F5MnM4bWQ1NTB1MTM5c2Jza2k3bnVmYm92NXlueiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13kdbpQWKWKjQI/giphy.gif" 
	                 alt="celebration" width="360" style="display:block;margin:12px auto;border-radius:8px;" />
	            <p style="font-size:14px;color:#888;margin-top:8px;">Continue engajando seus alunos! 💪</p>
	          </td>
	        </tr>
	      </table>
	    </td>
	  </tr>
	</table>`, subjectBody(tipo, valor))
	msg.SetBody("text/html", body)
	}
	
	


	// Dialer com TLS forced (boa prática em produção)
	dialer := gomail.NewDialer(host, port, user, password)
	dialer.TLSConfig = &tls.Config{InsecureSkipVerify: false, ServerName: host}

	// Envia
	if err := dialer.DialAndSend(msg); err != nil {
		return fmt.Errorf("falha ao enviar e-mail: %w", err)
	}

	return nil
}

// subjectBody retorna o parágrafo principal dependendo do tipo do e-mail.
func subjectBody(tipo string, valor int) string {
	switch tipo {
	case "aluno":
		return fmt.Sprintf("Você recebeu %d moedas do seu professor! Acesse sua conta para ver os detalhes.", valor)
	case "professor":
		return fmt.Sprintf("Você enviou %d moedas ao seu aluno! Acesse sua conta para ver os detalhes.", valor)
	default:
		return "Você recebeu uma nova notificação do sistema."
	}
}
