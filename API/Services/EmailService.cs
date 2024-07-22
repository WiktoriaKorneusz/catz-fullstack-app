using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
                //MimeMessage - a class from Mimekit
                MimeMessage email_Message = new();
                MailboxAddress email_From = new(mailSettings.Name, mailSettings.EmailId);
                email_Message.From.Add(email_From);
                MailboxAddress email_To = new MailboxAddress(emailMessage.EmailToName, emailMessage.EmailToId);
                email_Message.To.Add(email_To);
                email_Message.Subject = emailMessage.EmailSubject;
                BodyBuilder emailBodyBuilder = new BodyBuilder
                {
                    TextBody = emailMessage.EmailBody
                };
                email_Message.Body = emailBodyBuilder.ToMessageBody();
                //this is the SmtpClient class from the Mailkit.Net.Smtp namespace, not the System.Net.Mail one
                SmtpClient MailClient = new SmtpClient();
                await MailClient.ConnectAsync(mailSettings.Host, mailSettings.Port);
                await MailClient.AuthenticateAsync(mailSettings.EmailId, mailSettings.Password);
                await MailClient.SendAsync(email_Message);
                await MailClient.DisconnectAsync(true);
                MailClient.Dispose();
                return true;
            }
            catch (Exception ex)
            {
                // Exception Details
                Console.WriteLine(ex.Message);
                return false;
            }
        }

    }

}
