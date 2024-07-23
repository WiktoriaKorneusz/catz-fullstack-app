using API.DTOs;
using API.Helpers;
using API.Models;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class AdminController(UserManager<User> userManager, IUnitOfWork unitOfWork, IPhotoService photoService) : BaseController
    {
        [Authorize("RequireAdminRole")]
        [HttpGet("users")]
        public async Task<ActionResult<PagedList<UserRolesDto>>> GetUsers([FromQuery] PaginationParams paginationParams)
        {
            var users = await unitOfWork.UserRepository.GetUsersWithRoles(paginationParams);
            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));


            return Ok(users);
        }

        [Authorize("RequireAdminRole")]
        [HttpPost("edit-roles/{userId:int}")]
        public async Task<ActionResult> EditRoles(int userId, string roles)
        {
            if (string.IsNullOrEmpty(roles)) return BadRequest("you must select role");
            var selectedRoles = roles.Split(',').ToArray();
            var user = await userManager.FindByIdAsync(userId.ToString());
            if (user == null) return NotFound("User not found");

            var userRoles = await userManager.GetRolesAsync(user);

            var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
            if (!result.Succeeded) return BadRequest("Failed to add to roles");

            result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
            if (!result.Succeeded) return BadRequest("Failed to remove from roles");

            return Ok(await userManager.GetRolesAsync(user));
        }

        [Authorize("RequireModeratorRole")]
        [HttpGet("posts")]
        public async Task<ActionResult<PagedList<UserPostDto>>> GetPosts([FromQuery] PaginationParams paginationParams)
        {
            var posts = await unitOfWork.PostRepository.GetUnapprovedPosts(paginationParams);
            Response.AddPaginationHeader(new PaginationHeader(posts.CurrentPage, posts.PageSize, posts.TotalCount, posts.TotalPages));
            return Ok(posts);

        }
        [Authorize("RequireModeratorRole")]
        [HttpGet("posts/{postId:int}")]
        public async Task<ActionResult<PostDisplayDto>> GetPost(int postId)
        {
            var post = await unitOfWork.PostRepository.GetUnapprovedPost(postId);
            if (post == null)
            {
                return NotFound();
            }
            return Ok(post);

        }

        [Authorize("RequireModeratorRole")]
        [HttpPut("posts/{postId:int}")]
        public async Task<ActionResult> ApprovePost(int postId)
        {
            var post = await unitOfWork.PostRepository.GetPostByIdAsync(postId);
            post.IsApproved = true;
            if (await unitOfWork.Complete()) return NoContent();
            return BadRequest("Couldn't approve post");
        }

        [Authorize("RequireModeratorRole")]
        [HttpDelete("posts/{postId:int}")]
        public async Task<ActionResult> DisapprovePost(int postId)
        {
            var post = await unitOfWork.PostRepository.GetPostByIdAsync(postId);
            if (post == null) return NotFound();

            foreach (var photo in post.Photos)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            unitOfWork.PostRepository.DeletePost(post);

            if (await unitOfWork.Complete()) return NoContent();
            return BadRequest("Couldn't delete post");
        }




    }
}