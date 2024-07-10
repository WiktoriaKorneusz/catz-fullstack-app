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
    public class FollowController(IFollowRepository followRepository) : BaseController
    {
        [HttpPost("{foloweeId:int}")]
        public async Task<ActionResult> ToggleFollow(int foloweeId)
        {
            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Claim Value: {claim.Value}");
            }


            var followerId = User.GetUserId();//heres error

            Console.WriteLine("\n\n\n" + followerId + " " + foloweeId + "\n\n\n"); //follower id isnt read


            if (followerId == foloweeId)
                return BadRequest("You can't follow yourself");

            var existingFollow = await followRepository.GetUserFollow(followerId, foloweeId);
            if (existingFollow == null)
            {
                var follow = new UserFollow
                {
                    FollowerId = followerId,
                    FolloweeId = foloweeId
                };
                followRepository.AddFollow(follow);
            }
            else
            {
                followRepository.DeleteFollow(existingFollow);
            }

            if (await followRepository.SaveChanges()) //heres error
                return Ok();

            return BadRequest("Failed to save follow");
        }


        [HttpGet("followeesids")]
        public async Task<ActionResult<IEnumerable<int>>> GetUserFolloweesIds()
        {
            return Ok(await followRepository.GetUserFolloweesIds(User.GetUserId()));
        }

        [HttpGet("followersids")]
        public async Task<ActionResult<IEnumerable<int>>> GetUserFollowersIds()
        {
            return Ok(await followRepository.GetUserFollowersIds(User.GetUserId()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserInfoDto>>> GetFollows([FromQuery] FollowsParams followParams)
        {
            followParams.UserId = User.GetUserId();
            var follows = await followRepository.GetFollows(followParams);
            Response.AddPaginationHeader(new PaginationHeader(follows.CurrentPage, follows.PageSize, follows.TotalCount, follows.TotalPages));
            return Ok(follows);
        }
    }
}