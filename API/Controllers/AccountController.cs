using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Extensions;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController(DataContext context, ITokenService tokenService, IMapper mapper, IUserRepository userRepository, UserManager<User> userManager) : BaseController
    {
        // private readonly DataContext _context = context;
        // private readonly ITokenService _tokenService = tokenService;
        // private readonly IMapper _mapper = mapper;
        // private readonly IUserRepository _userRepository = userRepository;
        // private readonly UserManager<User> _userManager = userManager;

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("User with that username already exists!");

            var user = mapper.Map<User>(registerDto);
            user.UserName = registerDto.Username.ToLower();
            // user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            // user.PasswordSalt = hmac.Key;

            // _context.Users.Add(user);
            // await _context.SaveChangesAsync();

            var result = await userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);


            return new UserDto
            {
                Username = user.UserName,
                Token = await tokenService.CreateToken(user),
                KnownAs = user.KnownAs
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            // Console.WriteLine("\n\n\n\n\n" + loginDto.Username + "\n\n\n\n");
            var user = await userManager.Users.FirstOrDefaultAsync(u => u.NormalizedUserName == loginDto.Username.ToUpper());
            // Console.WriteLine(user.UserName);
            if (user == null || user.UserName == null) return Unauthorized("Invalid password or username");

            // using var hmac = new HMACSHA512(user.PasswordSalt);

            // var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            // for (int i = 0; i < computedHash.Length; i++)
            // {
            //     if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password or username");
            // }
            return new UserDto
            {
                Username = user.UserName,
                Token = await tokenService.CreateToken(user),
                KnownAs = user.KnownAs
            };
        }

        // [HttpDelete("{username}")]
        // public async Task<IActionResult> DeleteUser(string username)
        // {
        //     var currentUsername = User.GetUsername();
        //                 var user = await _userRepository.GetUserByUsernameAsync(username);


        // }


        private async Task<bool> UserExists(string username)
        {

            return await context.Users.AnyAsync(x => x.NormalizedUserName == username.ToUpper());
        }
    }
}