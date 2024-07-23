using API.DTOs;
using API.Helpers;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MailController(IEmailService emailService) : BaseController
    {
        [HttpPost("send")]
        public async Task<ActionResult> SendEmail([FromBody] ContactFormDto contactForm)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var emailMessage = new EmailMessage()
            {
                ToId = "wiktoriakorneusz@gmail.com",
                ToName = "wiktoriakorneusz@gmail.com",
                Subject = $"Message from {contactForm.FullName}",
                Body = $"From: {contactForm.FullName}\nEmail: {contactForm.Email}\nMessage: {contactForm.Message}"
            };

            return Ok(await emailService.SendEmail(emailMessage));
        }
    }
}