using API.DTOs;
using API.Models;
using API.Helpers;

namespace API.Interfaces
{
    public interface IPostRepository
    {
        Task<IEnumerable<PostDisplayDto>> GetPostsDisplayAsync();
        Task<PagedList<UserPostDto>> GetUserPosts(int userId, PaginationParams paginationParams);
        Task<PostDisplayDto> GetPostDisplayByIdAsync(int id);
        Task<IEnumerable<Post>> GetPostsAsync();
        Task<Post> GetPostByIdAsync(int id);

        Task<PagedList<UserPostDto>> GetUnapprovedPosts(PaginationParams paginationParams);
        Task<PostDisplayDto> GetUnapprovedPost(int id);
        void DeletePost(Post post);

    }
}