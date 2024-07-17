using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    // [Authorize]
    public class FollowController(IUnitOfWork unitOfWork) : BaseController
    {
        [HttpPost("{foloweeId:int}")]
        public async Task<ActionResult> ToggleFollow(int foloweeId)
        {



            var followerId = User.GetUserId();//heres error


            if (followerId == foloweeId)
                return BadRequest("You can't follow yourself");

            var existingFollow = await unitOfWork.FollowRepository.GetUserFollow(followerId, foloweeId);
            if (existingFollow == null)
            {
                var follow = new UserFollow
                {
                    FollowerId = followerId,
                    FolloweeId = foloweeId
                };
                unitOfWork.FollowRepository.AddFollow(follow);
            }
            else
            {
                unitOfWork.FollowRepository.DeleteFollow(existingFollow);
            }

            if (await unitOfWork.Complete()) //heres error
                return Ok();

            return BadRequest("Failed to save follow");
        }


        [HttpGet("followeesids")]
        public async Task<ActionResult<IEnumerable<int>>> GetUserFolloweesIds()
        {
            return Ok(await unitOfWork.FollowRepository.GetUserFolloweesIds(User.GetUserId()));
        }

        [HttpGet("followersids")]
        public async Task<ActionResult<IEnumerable<int>>> GetUserFollowersIds()
        {
            return Ok(await unitOfWork.FollowRepository.GetUserFollowersIds(User.GetUserId()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserInfoDto>>> GetFollows([FromQuery] FollowsParams followParams)
        {
            followParams.UserId = User.GetUserId();
            var follows = await unitOfWork.FollowRepository.GetFollows(followParams);
            Response.AddPaginationHeader(new PaginationHeader(follows.CurrentPage, follows.PageSize, follows.TotalCount, follows.TotalPages));
            return Ok(follows);
        }
    }
}