using System.Collections.Generic;
using System.Diagnostics;

namespace Renju.HubConfig
{
    public class ConnectionManager : IConnectionManager
    {
        private static Dictionary<string, HashSet<string>> userMap = new Dictionary<string, HashSet<string>>();
        public IEnumerable<string> OnlineUsers { get { return userMap.Keys; } }

        public void AddConnection(string userName, string connectionId)
        {
            lock (userMap)
            {
                if (!userMap.ContainsKey(userName))
                {
                    userMap[userName] = new HashSet<string>();
                }
                userMap[userName].Add(connectionId);
            }
        }

        public HashSet<string> GetConnections(string userName)
        {

            var conn = new HashSet<string>();

            try
            {
                lock (userMap)
                {
                    conn = userMap[userName];
                }
            }
            catch
            {
                conn = null;
            }
            return conn;
        }

        public void RemoveConnection(string connectionId)
        {
            lock (userMap)
            {
                foreach (var userName in userMap.Keys)
                {
                    if (userMap[userName].Contains(connectionId))
                    {
                        userMap[userName].Remove(connectionId);
                        if (userMap[userName].Count == 0){
                            userMap.Remove(userName);
                        }
                        break;
                    }
                }

            }
        }
    }
}