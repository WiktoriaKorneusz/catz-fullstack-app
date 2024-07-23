using API.Helpers;

namespace API.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendEmail(EmailMessage emailMessage);
    }
}