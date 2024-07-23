using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class UsersController(IUnitOfWork unitOfWork, IMapper mapper) : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await unitOfWork.UserRepository.GetMembersAsync();
            return Ok(users);
        }

        [HttpGet("get-by-id/{id}")]
        public async Task<ActionResult<MemberDto>> GetUserById(int id)
        {
            var user = await unitOfWork.UserRepository.GetUserInfo(id);
            return Ok(user);
        }


        //users in the client
        [HttpGet("infos")]
        public async Task<ActionResult<PagedList<UserInfoDto>>> GetUsersInfo([FromQuery] UserParams userParams)
        {
            // var currentUser = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            userParams.CurrentUsername = User.GetUsername();
            var users = await unitOfWork.UserRepository.GetUsersInfo(userParams);
            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));
            return Ok(users);
        }

        // [HttpGet("{Id}")] 
        // public async Task<ActionResult<User>> GetUserById(int id)
        // {
        //     return await unitOfWork.UserRepository.GetUserByIdAsync(id);

        // }
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            // var userFromDb = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            // var userToRetun = _mapper.Map<MemberDto>(userFromDb);
            return await unitOfWork.UserRepository.GetMemberByUsernameAsync(username);

        }
        [HttpGet("data/{username}")]
        public async Task<ActionResult<UserDataDto>> GetUserData(string username)
        {
            // var userFromDb = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            // var userToRetun = _mapper.Map<MemberDto>(userFromDb);
            return await unitOfWork.UserRepository.GetUserDataAsync(username);

        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(UserUpdateDto userUpdateDto)
        {
            var username = User.GetUsername();
            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            if (user == null) return NotFound();

            //updating user
            mapper.Map(userUpdateDto, user);

            if (await unitOfWork.Complete()) return NoContent();
            return BadRequest("Couldn't update user");
        }

        [HttpGet("photos/{id}")]
        public async Task<ActionResult<IEnumerable<PhotoDto>>> GetPhotos(int id)
        {
            var photos = await unitOfWork.UserRepository.GetUserPhotosAsync(id);
            return Ok(photos);
        }

        [HttpGet("photo/{id}")]
        public async Task<ActionResult<Photo>> GetPhoto(int id)
        {
            var photo = await unitOfWork.UserRepository.GetUserPhotoAsync(id);
            return Ok(photo);
        }
        [HttpGet("main-photo")]
        public async Task<ActionResult<Photo>> GetMainPhoto()
        {
            var username = User.GetUsername();
            // if (post.User.UserName != username) return Unauthorized();

            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            if (user == null) return Unauthorized();

            var id = user.Id;
            var photosDto = await unitOfWork.UserRepository.GetUserPhotosAsync(id);

            var mainPhotoDto = photosDto.FirstOrDefault(x => x.IsMain);
            if (mainPhotoDto == null) return NotFound();

            var mainPhotoId = mainPhotoDto.Id;

            var photo = await unitOfWork.UserRepository.GetUserPhotoAsync(mainPhotoId);
            return Ok(photo);


        }

        [HttpPut("set-main-photo/{postId}/{newMainPhotoId}")]
        public async Task<ActionResult> SetMainPhoto(int postId, int newMainPhotoId)
        {
            //validation
            var username = User.GetUsername();
            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            if (user == null) return Unauthorized();

            var post = await unitOfWork.PostRepository.GetPostByIdAsync(postId);
            if (post == null) return NotFound();
            if (post.User.UserName != username) return Unauthorized();

            var photo = post.Photos.FirstOrDefault(x => x.Id == newMainPhotoId);
            if (photo == null) return NotFound();

            var userId = user.Id;
            var photosDto = await unitOfWork.UserRepository.GetUserPhotosAsync(userId);

            var mainPhotoDto = photosDto.FirstOrDefault(x => x.IsMain);
            if (mainPhotoDto != null)
            {
                var mainPhotoId = mainPhotoDto.Id;
                if (mainPhotoId == newMainPhotoId) return BadRequest("Photo is already main photo");

                var currentMainPhoto = await unitOfWork.UserRepository.GetUserPhotoAsync(mainPhotoId);
                currentMainPhoto.IsMain = false;
            }



            var newMainPhoto = await unitOfWork.UserRepository.GetUserPhotoAsync(newMainPhotoId);
            newMainPhoto.IsMain = true;

            if (await unitOfWork.Complete())
            {

                return NoContent();
            }

            return BadRequest("Failed to set main photo");


        }
    }
}