using System.Collections.Generic;

namespace Renju.HubConfig
{
    public interface IHubNotificationHelper
    {
         void SendNotificationToAll(string message);
        IEnumerable<string> GetOnlineUsers();
        
    }
}