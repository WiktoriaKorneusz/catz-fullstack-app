using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Models;
using API.Helpers;

namespace API.Interfaces
{
    public interface IPostRepository
    {
        void Update(Post post);
        // Task<bool> SaveAllAsync();
        //Post is readolny there
        Task<IEnumerable<PostDisplayDto>> GetPostsDisplayAsync();
        Task<PagedList<UserPostDto>> GetUserPosts(int userId, PaginationParams paginationParams);
        Task<PostDisplayDto> GetPostDisplayByIdAsync(int id);
        Task<IEnumerable<Post>> GetPostsAsync();
        Task<Post> GetPostByIdAsync(int id);
    }
}