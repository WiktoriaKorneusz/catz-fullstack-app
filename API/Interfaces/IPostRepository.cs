using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Models;

namespace API.Interfaces
{
    public interface IPostRepository
    {
        void Update(Post post);
        Task<bool> SaveAllAsync();
        //Post is readolny there
        Task<IEnumerable<PostDisplayDto>> GetPostsAsync();
        Task<PostDisplayDto> GetPostByIdAsync(int id);
    }
}