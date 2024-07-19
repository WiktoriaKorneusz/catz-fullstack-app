using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Interfaces;
using API.Models;
using API.Helpers;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class PostRepository(DataContext context, IMapper mapper) : IPostRepository
    {

        public async Task<Post> GetPostByIdAsync(int id)
        {
            return await context.Posts
                .Include(p => p.User)
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(p => p.Id == id);
        }


        public async Task<PostDisplayDto> GetPostDisplayByIdAsync(int id)
        {
            return await context.Posts
                .Include(post => post.User)
                .Where(post => post.Id == id && post.IsApproved == true)
                .ProjectTo<PostDisplayDto>(mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }
        public async Task<PagedList<UserPostDto>> GetUserPosts(int userId, PaginationParams paginationParams)
        {
            var query = context.Posts
                .Where(p => p.UserId == userId & p.IsApproved == true)
                .OrderByDescending(p => p.Created)
                .AsQueryable();
            if (paginationParams.SearchTerm != null && !string.IsNullOrEmpty(paginationParams.SearchTerm.Trim()))
            {
                var searchText = paginationParams.SearchTerm.Trim().ToLower();
                query = query.Where(post =>
                post.Content.ToLower().Contains(searchText)
                    );
            }
            return await PagedList<UserPostDto>.CreateAsync(query.AsNoTracking().ProjectTo<UserPostDto>(mapper.ConfigurationProvider), paginationParams.PageNumber, paginationParams.PageSize);

        }

        public async Task<IEnumerable<Post>> GetPostsAsync()
        {
            return await context.Posts.Include(p => p.Photos).ToListAsync();
        }

        public async Task<IEnumerable<PostDisplayDto>> GetPostsDisplayAsync()
        {
            return await context.Posts
                .Include(p => p.User)
                .Where(p => p.IsApproved == true)
                .ProjectTo<PostDisplayDto>(mapper.ConfigurationProvider)
                .ToListAsync();
        }

        // public async Task<bool> SaveAllAsync()
        // {
        //     return await context.SaveChangesAsync() > 0;
        // }

        // public void Update(Post post)
        // {
        //     context.Entry(post).State = EntityState.Modified;
        // }

        public async Task<PagedList<UserPostDto>> GetUnapprovedPosts(PaginationParams paginationParams)
        {


            var query = context.Posts
            .Where(p => p.IsApproved == false)
            .OrderBy(p => p.Created)
            .AsQueryable();

            if (paginationParams.SearchTerm != null && !string.IsNullOrEmpty(paginationParams.SearchTerm.Trim()))
            {
                var searchText = paginationParams.SearchTerm.Trim().ToLower();
                query = query.Where(post =>
                post.Content.ToLower().Contains(searchText) ||
                post.User.UserName.ToLower().Contains(searchText) ||
                post.User.KnownAs.ToLower().Contains(searchText));
            }

            return await PagedList<UserPostDto>.CreateAsync(query.AsNoTracking().ProjectTo<UserPostDto>(mapper.ConfigurationProvider), paginationParams.PageNumber, paginationParams.PageSize);

        }

        public async Task<PostDisplayDto> GetUnapprovedPost(int id)
        {
            return await context.Posts
                .Include(post => post.User)
                .Where(post => post.Id == id)
                .ProjectTo<PostDisplayDto>(mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public void DeletePost(Post post)
        {
            context.Posts.Remove(post);
        }



    }
}