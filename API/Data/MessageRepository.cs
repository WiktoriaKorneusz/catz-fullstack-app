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
    public class MessageRepository(DataContext context, IMapper mapper) : IMessageRepository
    {
        public void AddMessage(Message message)
        {
            context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            context.Messages.Remove(message);
        }

        public async Task<Message?> GetMessage(int id)
        {
            return await context.Messages.FindAsync(id);
        }
        public async Task<MessageDto> GetMessageAsync(int id)
        {
            return await context.Messages
                .Where(m => m.Id == id)
                .ProjectTo<MessageDto>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = context.Messages
                .OrderByDescending(m => m.MessageSent)
                // .ProjectTo<MessageDto>(mapper.ConfigurationProvider)
                .AsQueryable();

            query = messageParams.Type switch
            {
                "received" => query.Where(u => u.Recipient.Id == messageParams.Id && u.RecipientDeleted == false),
                "sent" => query.Where(u => u.Sender.Id == messageParams.Id && u.SenderDeleted == false),
                _ => query.Where(u => u.Recipient.Id == messageParams.Id && u.DateRead == null && u.RecipientDeleted == false) //unread
            };

            var messages = query.ProjectTo<MessageDto>(mapper.ConfigurationProvider);
            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);

        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(int currentId, int targetId)
        {
            var messages = await context.Messages
                .Include(m => m.Sender)
                    .ThenInclude(u => u.Posts)
                        .ThenInclude(p => p.Photos)
                .Include(m => m.Recipient)
                    .ThenInclude(u => u.Posts)
                        .ThenInclude(p => p.Photos)
                .Where(x => x.Recipient.Id == currentId && x.RecipientDeleted == false && x.Sender.Id == targetId || x.Recipient.Id == targetId && x.SenderDeleted == false && x.Sender.Id == currentId)
                .OrderBy(m => m.MessageSent)
                .ToListAsync();

            var unreadMessages = messages.Where(x => x.DateRead == null && x.Recipient.Id == currentId).ToList();

            if (unreadMessages.Count != 0)
            {
                unreadMessages.ForEach(x => x.DateRead = DateTime.Now);
                await context.SaveChangesAsync();
            }

            return mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}