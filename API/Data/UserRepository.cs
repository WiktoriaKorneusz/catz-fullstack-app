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
        public async Task<IEnumerable<UserInfoDto>> GetUsersInfo()
        {
            return await _context.Users
            .ProjectTo<UserInfoDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
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
    }
}