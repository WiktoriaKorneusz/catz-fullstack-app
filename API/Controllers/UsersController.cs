using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Extensions;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;

        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();
            return Ok(users);
        }

        // [HttpGet("{Id}")] 
        // public async Task<ActionResult<User>> GetUserById(int id)
        // {
        //     return await _userRepository.GetUserByIdAsync(id);

        // }
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            // var userFromDb = await _userRepository.GetUserByUsernameAsync(username);
            // var userToRetun = _mapper.Map<MemberDto>(userFromDb);
            return await _userRepository.GetMemberByUsernameAsync(username);

        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(UserUpdateDto userUpdateDto)
        {
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user == null) return NotFound();

            //updating user
            _mapper.Map(userUpdateDto, user);

            if (await _userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Couldn't update user");
        }
    }
}