using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MailController(IEmailService emailService) : BaseController
    {
        [HttpPost("send")]
        public async Task<ActionResult> SendEmail([FromBody] EmailMessage emailMessage)
        {

            return Ok(await emailService.SendEmail(emailMessage));
        }
    }
}