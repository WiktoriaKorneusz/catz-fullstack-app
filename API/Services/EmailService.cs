using API.Helpers;
using API.Interfaces;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;



namespace API.Services
{
    public class EmailService(IOptions<MailSettings> options) : IEmailService
    {

        MailSettings mailSettings = options.Value;

        public async Task<bool> SendEmail(EmailMessage emailMessage)
        {

            try
            {
                MimeMessage mimeMessage = new();
                MailboxAddress emailFrom = new(mailSettings.Name, mailSettings.EmailId);
                mimeMessage.From.Add(emailFrom);
                MailboxAddress emailTo = new(emailMessage.ToName, emailMessage.ToId);
                mimeMessage.To.Add(emailTo);
                mimeMessage.Subject = emailMessage.Subject;
                BodyBuilder emailBodyBuilder = new()
                {
                    TextBody = emailMessage.Body
                };
                mimeMessage.Body = emailBodyBuilder.ToMessageBody();
                SmtpClient MailClient = new();
                await MailClient.ConnectAsync(mailSettings.Host, mailSettings.Port);
                await MailClient.AuthenticateAsync(mailSettings.EmailId, mailSettings.Password);
                await MailClient.SendAsync(mimeMessage);
                await MailClient.DisconnectAsync(true);
                MailClient.Dispose();
                return true;
            }
            catch (Exception ex)
            {

                return false;
            }
        }

    }

}
