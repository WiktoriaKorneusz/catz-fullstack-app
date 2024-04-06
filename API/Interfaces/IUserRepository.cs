using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Models;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(User user);
        Task<bool> SaveAllAsync();
        //user is readolny there
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByUsernameAsync(string username);
        Task<IEnumerable<MemberDto>> GetMembersAsync();
        Task<MemberDto> GetMemberByUsernameAsync(string username);
        Task<UserInfoDto> GetUserInfo(int id);
        Task<IEnumerable<UserInfoDto>> GetUsersInfo();

        Task<IEnumerable<PhotoDto>> GetUserPhotosAsync(int userId);
        Task<Photo> GetUserPhotoAsync(int photoId);



    }
}