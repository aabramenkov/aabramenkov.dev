using System.Threading.Tasks;
using jsite.api.Dtos;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace jsite.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class EmailController : ControllerBase
    {
        private readonly IConfiguration _config;
        public EmailController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost]
        public async Task<IActionResult> SendEmail(MessageDto messageDto)
        {
            string msgText = "New message from: " + messageDto.Email + "<br><br>"
             + "Message: " + messageDto.Message + "<br><br>"
             + "Message sent: " + System.DateTime.Now;

            await SendEmailAsync(_config.GetSection("MailSettings:MailTo").Value, "New Message from aabramenkov.dev", msgText);
            return Ok();
        }

        private async Task SendEmailAsync(string email, string subject, string message)
        {
            var emailMessage = new MimeMessage();

            emailMessage.From.Add(new MailboxAddress(_config.GetSection("MailSettings:MailFromAlias").Value, _config.GetSection("MailSettings:MailFrom").Value));
            emailMessage.To.Add(new MailboxAddress("", email));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = message
            };

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync("smtp.gmail.com", 587, false);
                await client.AuthenticateAsync(_config.GetSection("MailSettings:Login").Value, _config.GetSection("MailSettings:Password").Value);
                await client.SendAsync(emailMessage);

                await client.DisconnectAsync(true);
            }
        }
    }
}