using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Extensions;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class MessageHub(IMessageRepository messageRepository, IUserRepository userRepository, IHubContext<PresenceHub> presenceHub) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var userId = httpContext?.Request.Query["target"];
            if (!int.TryParse(userId, out int targetId))
            {
                throw new ArgumentException("otherId is not a valid integer", nameof(userId));
            }
            if (Context.User == null || string.IsNullOrEmpty(userId))
                throw new Exception("Cannot join group");

            var groupName = GetGroupName(Context.User.GetUserId(), targetId);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var group = await AddToGroup(groupName);
            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

            var messages = await messageRepository.GetMessageThread(Context.User.GetUserId(), targetId);
            await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var group = await RemoveFromGroup();
            await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(MessageCreateDto messageCreateDto)
        {
            var id = Context.User?.GetUserId() ?? throw new Exception("couldn't get user");
            if (id == messageCreateDto.RecipientId)
                throw new HubException("You can't send messages to yourself");
            var sender = await userRepository.GetUserByIdAsync(id);
            var recipient = await userRepository.GetUserByIdAsync(messageCreateDto.RecipientId);
            if (recipient == null || sender == null) throw new HubException("Can't send message");
            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                // SenderUsername = sender.UserName,
                // RecipientUsername = recipient.UserName,
                Content = messageCreateDto.Content
            };
            var groupName = GetGroupName(sender.Id, recipient.Id);
            var group = await messageRepository.GetGroup(groupName);

            if (group != null && group.Connections.Any(x => x.UserId == recipient.Id))
            {
                message.DateRead = DateTime.UtcNow;
            }
            else
            {
                var connections = await PressenceTracker.GetConnectionsForUser(recipient.Id);
                if (connections != null && connections?.Count != null)
                {
                    await presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived", new { username = sender.UserName, userId = sender.Id });
                }
            }


            messageRepository.AddMessage(message);
            if (await messageRepository.SaveAllAsync())
            {
                var createdMessage = await messageRepository.GetMessageAsync(message.Id);
                // var group = GetGroupName(sender.Id, recipient.Id);
                await Clients.Group(groupName).SendAsync("ReceiveMessage", createdMessage);
            }
            else
            {
                throw new HubException("Failed to send message");

            }
        }
        private async Task<Group> AddToGroup(string groupName)
        {
            var userId = Context.User.GetUserId();
            var group = await messageRepository.GetGroup(groupName);
            var connection = new Connection { ConnectionId = Context.ConnectionId, UserId = userId };
            if (group == null)
            {
                group = new Group
                {
                    Name = groupName
                };
                messageRepository.AddGroup(group);
            }
            group.Connections.Add(connection);
            if (await messageRepository.SaveAllAsync()) return group;
            throw new HubException("Failed to join message group");

        }

        private async Task<Group> RemoveFromGroup()
        {
            var group = await messageRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group?.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (connection != null && group != null)
            {
                messageRepository.RemoveConnection(connection);
                if (await messageRepository.SaveAllAsync()) return group;
            }
            throw new HubException("Failed to remove from group");


        }
        private string GetGroupName(int callerId, int otherId)
        {


            var lesserId = Math.Min(callerId, otherId);
            var greaterId = Math.Max(callerId, otherId);

            return $"{lesserId}-{greaterId}";
        }
    }
}