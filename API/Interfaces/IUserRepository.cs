using API.DTOs;
using API.Helpers;
using API.Models;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByUsernameAsync(string username);
        Task<IEnumerable<MemberDto>> GetMembersAsync();
        Task<MemberDto> GetMemberByUsernameAsync(string username);
        Task<UserInfoDto> GetUserInfo(int id);
        Task<UserDataDto> GetUserDataAsync(string username);
        Task<PagedList<UserInfoDto>> GetUsersInfo(UserParams userParams);
        Task<PagedList<UserRolesDto>> GetUsersWithRoles(PaginationParams paginationParams);
        Task<IEnumerable<PhotoDto>> GetUserPhotosAsync(int userId);
        Task<Photo> GetUserPhotoAsync(int photoId);



    }
}