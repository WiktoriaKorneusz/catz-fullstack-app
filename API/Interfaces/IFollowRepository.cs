using API.DTOs;
using API.Helpers;
using API.Models;

namespace API.Interfaces
{
    public interface IFollowRepository
    {
        Task<UserFollow?> GetUserFollow(int followerId, int followeeId);
        Task<PagedList<UserInfoDto>> GetFollows(FollowsParams followsParams);
        Task<IEnumerable<int>> GetUserFolloweesIds(int userId);
        Task<IEnumerable<int>> GetUserFollowersIds(int userId); //
        void AddFollow(UserFollow follow);
        void DeleteFollow(UserFollow follow);
    }
}