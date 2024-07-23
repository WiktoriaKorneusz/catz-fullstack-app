using API.DTOs;
using API.Helpers;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController(ITokenService tokenService, IMapper mapper, UserManager<User> userManager, IEmailService emailService) : BaseController
    {

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username, registerDto.Email)) return BadRequest("User with that data already exists!");

            var user = mapper.Map<User>(registerDto);
            user.UserName = registerDto.Username.ToLower();

            var result = await userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);

            var emailMessage = await SendEmail(token, user, registerDto.ClientUri, "Confirm your email");
            if (!emailMessage) return BadRequest();

            var roleResult = await userManager.AddToRoleAsync(user, "User");

            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            return Created();
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await userManager.Users.FirstOrDefaultAsync(u => u.NormalizedUserName == loginDto.Username.ToUpper());
            if (user == null || user.UserName == null) return Unauthorized("Invalid password or username");
            if (!await userManager.IsEmailConfirmedAsync(user)) return Unauthorized("Please confirm your email");
            if (!await userManager.CheckPasswordAsync(user, loginDto.Password)) return Unauthorized("Invalid password or username");

            return new UserDto
            {
                Username = user.UserName,
                Token = await tokenService.CreateToken(user),
                KnownAs = user.KnownAs
            };
        }

        [HttpGet("email-confirmation")]
        public async Task<ActionResult> ConfirmEmail([FromQuery] string token, [FromQuery] string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null) return NotFound();
            var result = await userManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded) return BadRequest("Something went wrong");
            return Ok();
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            if (!ModelState.IsValid) return BadRequest();
            var user = await userManager.FindByEmailAsync(forgotPasswordDto.Email);
            if (user == null) return BadRequest();
            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var result = await SendEmail(token, user, forgotPasswordDto.ClientUri, "Reset Password");
            if (!result) return BadRequest();
            return Ok();
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            if (!ModelState.IsValid) return BadRequest();
            var user = await userManager.FindByEmailAsync(resetPasswordDto.Email);
            if (user == null) return BadRequest();
            var result = await userManager.ResetPasswordAsync(user, resetPasswordDto.Token!, resetPasswordDto.Password!);
            if (!result.Succeeded) return BadRequest();
            return Ok();
        }

        private async Task<bool> UserExists(string username, string email)
        {
            return await userManager.Users.AnyAsync(x => x.NormalizedUserName == username.ToUpper() || x.NormalizedEmail == email.ToUpper());
        }
        private async Task<bool> SendEmail(string token, User user, string clientUri, string subject)

        {

            var param = new Dictionary<string, string?>{
                {"token", token},
                {"email", user.Email}
            };

            var callback = QueryHelpers.AddQueryString(clientUri, param);
            var content = $"{subject}\nlink: {callback}";
            var emailMessage = new EmailMessage
            {
                ToId = user.Email,
                ToName = user.UserName,
                Subject = subject,
                Body = content
            };
            return await emailService.SendEmail(emailMessage);

        }
    }
}