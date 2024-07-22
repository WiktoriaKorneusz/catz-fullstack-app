using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Models;
using API.Services;
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
            if (await UserExists(registerDto.Username)) return BadRequest("User with that username already exists!");

            var user = mapper.Map<User>(registerDto);
            user.UserName = registerDto.Username.ToLower();

            var result = await userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var emailToken = await userManager.GenerateEmailConfirmationTokenAsync(user);


            var param = new Dictionary<string, string?>{
                {"emailToken", emailToken},
                {"email", user.Email}
            };

            var callback = QueryHelpers.AddQueryString(registerDto.ClientUri, param);
            var emailMessage = new EmailMessage
            {
                EmailToId = user.Email,
                EmailToName = user.UserName,
                EmailSubject = "Confirm your email",
                EmailBody = callback
            };
            await emailService.SendEmail(emailMessage);

            var roleResult = await userManager.AddToRoleAsync(user, "User");

            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            return Created();
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            // Console.WriteLine("\n\n\n\n\n" + loginDto.Username + "\n\n\n\n");
            var user = await userManager.Users.FirstOrDefaultAsync(u => u.NormalizedUserName == loginDto.Username.ToUpper());
            // Console.WriteLine(user.UserName);
            if (user == null || user.UserName == null) return Unauthorized("Invalid password or username");
            // if (!await userManager.IsEmailConfirmedAsync(user)) return Unauthorized("Please confirm your email");
            // var result = await userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!await userManager.CheckPasswordAsync(user, loginDto.Password)) return Unauthorized("Invalid password or username");

            return new UserDto
            {
                Username = user.UserName,
                Token = await tokenService.CreateToken(user),
                KnownAs = user.KnownAs
            };
        }

        [HttpGet("email-confirmation")]
        public async Task<ActionResult> ConfirmEmail([FromQuery] string emailToken, [FromQuery] string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null) return NotFound();
            var result = await userManager.ConfirmEmailAsync(user, emailToken);
            if (!result.Succeeded) return BadRequest("Something went wrong");
            return Ok();
        }

        private async Task<bool> UserExists(string username)
        {

            return await userManager.Users.AnyAsync(x => x.NormalizedUserName == username.ToUpper());
        }
    }
}