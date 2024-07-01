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
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MemberDto> GetMemberByUsernameAsync(string username)
        {
            return await _context.Users
            .Where(u => u.UserName == username)
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<MemberDto>> GetMembersAsync()
        {
            return await _context.Users
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
        }

        public async Task<UserInfoDto> GetUserInfo(int id)
        {
            return await _context.Users
            .Where(u => u.Id == id)

            .ProjectTo<UserInfoDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
        }

        //get users page
        public async Task<PagedList<UserInfoDto>> GetUsersInfo(UserParams userParams)
        {
            var query = _context.Users.AsQueryable();

            query = query.Where(u => u.UserName != userParams.CurrentUsername);
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var minDateOfBirth = today.AddYears(-userParams.MaximalAge - 1);
            var maxDateOfBirth = today.AddYears(-userParams.MinimalAge);

            query = query.Where(u => u.DateOfBirth >= minDateOfBirth && u.DateOfBirth <= maxDateOfBirth);
            query = userParams.OrderBy switch
            {
                1 => query.OrderByDescending(u => u.Created),
                2 => query.OrderBy(u => u.UserName),
                3 => query.OrderByDescending(u => u.UserName),
                4 => query.OrderByDescending(u => u.DateOfBirth),
                5 => query.OrderBy(u => u.DateOfBirth),
                _ => query.OrderByDescending(u => u.LastActive),
            };

            return await PagedList<UserInfoDto>.CreateAsync(query.AsNoTracking().ProjectTo<UserInfoDto>(_mapper.ConfigurationProvider), userParams.PageNumber, userParams.PageSize);
        }



        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
            .Include(p => p.Posts)
            .SingleOrDefaultAsync(u => u.UserName == username);
        }



        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await _context.Users
            .Include(p => p.Posts)
            .ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

        public async Task<IEnumerable<PhotoDto>> GetUserPhotosAsync(int userId)
        {
            var userPosts = await _context.Posts
            .Where(p => p.UserId == userId)
            .Include(p => p.Photos)
            .ToListAsync();

            var userPhotos = userPosts.SelectMany(post => post.Photos)
            .Select(photo => new PhotoDto
            {
                Id = photo.Id,
                Url = photo.Url,
                IsMain = photo.IsMain
            });

            return userPhotos;

        }

        public async Task<Photo> GetUserPhotoAsync(int photoId)
        {
            return await _context.Photos
            .FirstOrDefaultAsync(p => p.Id == photoId);

        }


    }
}