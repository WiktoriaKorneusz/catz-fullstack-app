using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Helpers;
using API.Interfaces;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    [Authorize]
    public class FollowRepository(DataContext context, IMapper mapper) : IFollowRepository
    {

        public void AddFollow(UserFollow follow)
        {
            context.Follows.Add(follow);
            // SaveChanges();
        }

        public void DeleteFollow(UserFollow follow)
        {
            context.Follows.Remove(follow);
        }

        public async Task<UserFollow> GetUserFollow(int followerId, int followeeId)
        {
            return await context.Follows.FindAsync(followerId, followeeId);
        }

        public async Task<IEnumerable<int>> GetUserFolloweesIds(int userId)
        {
            return await context.Follows.Where(f => f.FollowerId == userId).Select(f => f.FolloweeId).ToListAsync();
        }

        public async Task<IEnumerable<int>> GetUserFollowersIds(int userId)
        {
            return await context.Follows.Where(f => f.FolloweeId == userId).Select(f => f.FollowerId).ToListAsync();
        }

        public async Task<PagedList<UserInfoDto>> GetFollows(FollowsParams followsParams)
        {
            var follows = context.Follows.AsQueryable();
            IQueryable<UserInfoDto> query = null;

            switch (followsParams.Choice)
            {
                case "followees":
                    query = follows
                        .Where(f => f.FollowerId == followsParams.UserId)
                        .Select(f => f.Followee)
                        .ProjectTo<UserInfoDto>(mapper.ConfigurationProvider);
                    break;
                case "followers":
                    query = follows
                        .Where(f => f.FolloweeId == followsParams.UserId)
                        .Select(f => f.Follower)
                        .ProjectTo<UserInfoDto>(mapper.ConfigurationProvider);
                    break;
                default: //mutual follows
                    var followersids = await GetUserFollowersIds(followsParams.UserId);
                    query = follows
                        .Where(f => f.FolloweeId == followsParams.UserId && followersids
                        .Contains(f.FollowerId))
                        .Select(f => f.Follower)
                        .ProjectTo<UserInfoDto>(mapper.ConfigurationProvider);
                    break;

            }

            return await PagedList<UserInfoDto>.CreateAsync(query, followsParams.PageNumber, followsParams.PageSize);

        }

        public async Task<bool> SaveChanges()
        {
            return await context.SaveChangesAsync() > 0; //error there

        }
    }
}