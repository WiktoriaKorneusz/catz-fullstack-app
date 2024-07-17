using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Helpers;
using API.Models;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController(UserManager<User> userManager, IUnitOfWork unitOfWork) : BaseController
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
        public async Task<ActionResult> GetPosts()
        {
            return Ok("mod test");
        }


    }
}