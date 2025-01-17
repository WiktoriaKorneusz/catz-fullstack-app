using API.DTOs;
using API.Helpers;
using API.Models;

namespace API.Interfaces
{
    public interface IMessageRepository
    {
        void AddMessage(Message message);
        void DeleteMessage(Message message);
        Task<Message?> GetMessage(int id);
        Task<MessageDto> GetMessageAsync(int id);
        Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams);
        Task<IEnumerable<MessageDto>> GetMessageThread(int currentId, int targetId);
        Task<IEnumerable<MessageDto>> GetMessages(int currentId, int targetId, int messagesCount, int batchSize);
        Task<int> GetMessageCountAsync(int currentId, int targetId);
        void AddGroup(Group group);
        void RemoveConnection(Connection connection);
        Task<Connection?> GetConnection(string connectionId);
        Task<Group?> GetGroup(string groupName);
        Task<Group?> GetGroupForConnection(string connectionId);

    }
}