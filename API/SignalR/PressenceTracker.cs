namespace API.SignalR
{
    public class PressenceTracker
    {
        private static readonly Dictionary<int, List<string>> OnlineUsers = [];
        public Task<bool> UserConnected(int userId, string connectionId)
        {
            var isOnline = false;
            lock (OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(userId))
                {
                    OnlineUsers[userId].Add(connectionId);
                }
                else
                {
                    OnlineUsers.Add(userId, [connectionId]);
                    isOnline = true;
                }
            }
            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnected(int userId, string connectionId)
        {
            var isOffline = false;
            lock (OnlineUsers)
            {
                if (!OnlineUsers.ContainsKey(userId)) return Task.FromResult(isOffline);


                OnlineUsers[userId].Remove(connectionId);
                if (OnlineUsers[userId].Count == 0)
                {
                    OnlineUsers.Remove(userId);
                    isOffline = true;
                }
            }
            return Task.FromResult(isOffline);
        }

        public Task<int[]> GetOnlineUsers()
        {
            int[] onlineUsers;
            lock (OnlineUsers)
            {
                onlineUsers = OnlineUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
            }
            return Task.FromResult(onlineUsers);
        }

        public static Task<List<string>> GetConnectionsForUser(int userId)
        {
            List<string> connectionIds;
            if (OnlineUsers.TryGetValue(userId, out var connections))
            {
                lock (connections)
                {
                    connectionIds = connections.ToList();
                }
            }
            else
            {
                connectionIds = [];
            }
            return Task.FromResult(connectionIds);
        }
    }
}