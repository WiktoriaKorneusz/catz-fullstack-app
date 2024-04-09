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
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;

        public AccountController(DataContext context, ITokenService tokenService, IMapper mapper, IUserRepository userRepository)
        {
            _context = context;
            _tokenService = tokenService;
            _mapper = mapper;
            _userRepository = userRepository;

        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("User with that username already exists!");

            var user = _mapper.Map<User>(registerDto);
            using var hmac = new HMACSHA512();
            user.UserName = registerDto.Username.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            user.PasswordSalt = hmac.Key;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                KnownAs = user.KnownAs
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == loginDto.Username);

            if (user == null) return Unauthorized("Invalid password or username");

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password or username");
            }
            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
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

            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}