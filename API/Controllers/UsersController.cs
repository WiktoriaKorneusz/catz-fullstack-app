using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Extensions;
using API.Helpers;
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
        private readonly IPostRepository _postRepository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRepository, IPostRepository postRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _postRepository = postRepository;
            _mapper = mapper;

        }



        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();
            return Ok(users);
        }

        [HttpGet("get-by-id/{id}")]
        public async Task<ActionResult<MemberDto>> GetUserById(int id)
        {
            var user = await _userRepository.GetUserInfo(id);
            return Ok(user);
        }


        //users in the client
        [HttpGet("infos")]
        public async Task<ActionResult<PagedList<UserInfoDto>>> GetUsersInfo([FromQuery] UserParams userParams)
        {
            var currentUser = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            userParams.CurrentUsername = currentUser.UserName;
            var users = await _userRepository.GetUsersInfo(userParams);
            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));
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

        [HttpGet("photos/{id}")]
        public async Task<ActionResult<IEnumerable<PhotoDto>>> GetPhotos(int id)
        {
            var photos = await _userRepository.GetUserPhotosAsync(id);
            return Ok(photos);
        }

        [HttpGet("photo/{id}")]
        public async Task<ActionResult<Photo>> GetPhoto(int id)
        {
            var photo = await _userRepository.GetUserPhotoAsync(id);
            return Ok(photo);
        }
        [HttpGet("main-photo")]
        public async Task<ActionResult<Photo>> GetMainPhoto()
        {
            var username = User.GetUsername();
            // if (post.User.UserName != username) return Unauthorized();

            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user == null) return Unauthorized();

            var id = user.Id;
            var photosDto = await _userRepository.GetUserPhotosAsync(id);

            var mainPhotoDto = photosDto.FirstOrDefault(x => x.IsMain);
            if (mainPhotoDto == null) return NotFound();

            var mainPhotoId = mainPhotoDto.Id;

            var photo = await _userRepository.GetUserPhotoAsync(mainPhotoId);
            return Ok(photo);


        }

        [HttpPut("set-main-photo/{postId}/{newMainPhotoId}")]
        public async Task<ActionResult> SetMainPhoto(int postId, int newMainPhotoId)
        {
            //validation
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user == null) return Unauthorized();

            var post = await _postRepository.GetPostByIdAsync(postId);
            if (post == null) return NotFound();
            if (post.User.UserName != username) return Unauthorized();

            var photo = post.Photos.FirstOrDefault(x => x.Id == newMainPhotoId);
            if (photo == null) return NotFound();

            var userId = user.Id;
            var photosDto = await _userRepository.GetUserPhotosAsync(userId);

            var mainPhotoDto = photosDto.FirstOrDefault(x => x.IsMain);
            if (mainPhotoDto != null)
            {
                var mainPhotoId = mainPhotoDto.Id;
                if (mainPhotoId == newMainPhotoId) return BadRequest("Photo is already main photo");

                var currentMainPhoto = await _userRepository.GetUserPhotoAsync(mainPhotoId);
                currentMainPhoto.IsMain = false;
            }



            var newMainPhoto = await _userRepository.GetUserPhotoAsync(newMainPhotoId);
            newMainPhoto.IsMain = true;

            if (await _userRepository.SaveAllAsync())
            {

                return NoContent();
            }

            return BadRequest("Failed to set main photo");


        }
    }
}