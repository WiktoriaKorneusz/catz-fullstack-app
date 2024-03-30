using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Interfaces;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class PostRepository : IPostRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public PostRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Post> GetPostByIdAsync(int id)
        {
            return await _context.Posts
                .Include(p => p.User) // Eager load the User navigation property
                .SingleOrDefaultAsync(p => p.Id == id);
        }


        public async Task<PostDisplayDto> GetPostDisplayByIdAsync(int id)
        {
            return await _context.Posts
                .Include(post => post.User)
                .Where(post => post.Id == id)
                .ProjectTo<PostDisplayDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<Post>> GetPostsAsync()
        {
            return await _context.Posts.ToListAsync();
        }

        public async Task<IEnumerable<PostDisplayDto>> GetPostsDisplayAsync()
        {
            return await _context.Posts
                .Include(p => p.User)
                .ProjectTo<PostDisplayDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(Post post)
        {
            _context.Entry(post).State = EntityState.Modified;
        }
    }
}