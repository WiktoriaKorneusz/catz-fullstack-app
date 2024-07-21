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
        public void AddGroup(Group group)
        {
            context.Groups.Add(group);
        }

        public void AddMessage(Message message)
        {
            context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            context.Messages.Remove(message);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await context.Connections.FindAsync(connectionId);
        }

        public async Task<Group> GetGroup(string groupName)
        {
            return await context.Groups.Include(x => x.Connections).FirstOrDefaultAsync(x => x.Name == groupName);
        }

        public async Task<Group> GetGroupForConnection(string connectionId)
        {
            return await context.Groups
                .Include(x => x.Connections)
                .Where(x => x.Connections
                .Any(c => c.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
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
            if (messageParams.SearchTerm != null && !string.IsNullOrEmpty(messageParams.SearchTerm.Trim()))
            {
                var searchText = messageParams.SearchTerm.Trim().ToLower();
                query = query.Where(message =>
                    message.Content.ToLower().Contains(searchText) ||
                    message.Recipient.UserName.ToLower().Contains(searchText) ||
                    message.Sender.UserName.ToLower().Contains(searchText));
            }

            var messages = query.ProjectTo<MessageDto>(mapper.ConfigurationProvider);
            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);

        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(int currentId, int targetId)
        {
            var query = context.Messages
                // .Include(m => m.Sender)
                //     .ThenInclude(u => u.Posts)
                //         .ThenInclude(p => p.Photos)
                // .Include(m => m.Recipient)
                //     .ThenInclude(u => u.Posts)
                //         .ThenInclude(p => p.Photos)
                .Where(x => x.Recipient.Id == currentId && x.RecipientDeleted == false && x.Sender.Id == targetId || x.Recipient.Id == targetId && x.SenderDeleted == false && x.Sender.Id == currentId)
                .OrderByDescending(m => m.MessageSent)
                .AsQueryable();

            // var unreadMessages = messages.Where(x => x.DateRead == null && x.Recipient.Id == currentId).ToList();
            var unreadMessages = query.Where(x => x.DateRead == null && x.RecipientId == currentId).ToList();

            if (unreadMessages.Count != 0)
            {
                unreadMessages.ForEach(x => x.DateRead = DateTime.Now);
                // await context.SaveChangesAsync();
            }
            query = query.Take(4);
            return await query.ProjectTo<MessageDto>(mapper.ConfigurationProvider)
                .ToListAsync();
            // return mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public async Task<IEnumerable<MessageDto>> GetMessages(int currentId, int targetId, int messagesCount, int batchSize)
        {

            var query = context.Messages
                .Where(x => x.Recipient.Id == currentId && x.RecipientDeleted == false && x.Sender.Id == targetId
                || x.Recipient.Id == targetId && x.SenderDeleted == false && x.Sender.Id == currentId)
                .OrderByDescending(m => m.MessageSent)
                .AsQueryable();

            query = query
            .Skip(messagesCount)
            .Take(batchSize);

            return await query.ProjectTo<MessageDto>(mapper.ConfigurationProvider)
                .ToListAsync();

        }
        public async Task<int> GetMessageCountAsync(int currentId, int targetId)
        {
            var query = context.Messages
                .Where(x => (x.Recipient.Id == currentId && x.RecipientDeleted == false && x.Sender.Id == targetId)
                 || (x.Recipient.Id == targetId && x.SenderDeleted == false && x.Sender.Id == currentId))
                .AsQueryable();

            return await query.CountAsync();
        }


        public void RemoveConnection(Connection connection)
        {
            context.Connections.Remove(connection);
        }

        // public async Task<bool> SaveAllAsync()
        // {
        //     return await context.SaveChangesAsync() > 0;
        // }
    }
}