using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub(PressenceTracker pressenceTracker) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            if (Context.User == null) throw new HubException("cannot get user claim");

            var isOnline = await pressenceTracker.UserConnected(Context.User.GetUserId(), Context.ConnectionId);
            if (isOnline) await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUserId());

            var currentlyConnectedUsers = await pressenceTracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", currentlyConnectedUsers);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (Context.User == null) throw new HubException("cannot get user claim");

            var isOffline = await pressenceTracker.UserDisconnected(Context.User.GetUserId(), Context.ConnectionId);
            if (isOffline) await Clients.Others.SendAsync("UserIsOffline", Context.User?.GetUserId());


            await base.OnDisconnectedAsync(exception);
        }
    }
}