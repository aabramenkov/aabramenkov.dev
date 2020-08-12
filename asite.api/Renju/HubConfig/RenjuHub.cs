using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Renju.Models;

namespace Renju.HubConfig
{
    public class RenjuHub : Hub
    {
        private readonly IConnectionManager _connectionManager;

        public RenjuHub(IConnectionManager connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public override Task OnConnectedAsync()
        {
            var httpContext = this.Context.GetHttpContext();
            var userName = httpContext.Request.Query["username"];
            _connectionManager.AddConnection(userName, Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            _connectionManager.RemoveConnection(Context.ConnectionId);

            return base.OnDisconnectedAsync(exception);
        }

        public async Task<Task> BroadcastRenjuMove(Move move)
        {
            HashSet<string> connections = _connectionManager.GetConnections(move.To);
            if (connections != null & connections.Count > 0)
            {
                await Send(connections, "broadcastRenjuMove", move);
            }

            connections = _connectionManager.GetConnections(move.From);
            if (connections != null & connections.Count > 0)
            {
                await Send(connections, "broadcastRenjuMove", move);
            }
            return Task.CompletedTask;
        }

        public async Task InviteGamer(string userName, object invitation)
        {

            HashSet<string> connections = _connectionManager.GetConnections(userName);

            if (connections != null & connections.Count > 0)
            {
                foreach (var conn in connections)
                {
                    try
                    {
                        await Clients.Client(conn).SendAsync("gameInvitation", invitation);
                    }
                    catch
                    {
                        throw new Exception("Error: no connection fount");
                    }
                }
            }

        }

        public async Task<Task> SendMessage(Message message)
        {
            HashSet<string> connections = _connectionManager.GetConnections(message.To);
            if (connections != null & connections.Count > 0)
            {
                await Send(connections, "sendMessage", message);
            }
            connections = _connectionManager.GetConnections(message.From);
            if (connections != null & connections.Count > 0)
            {
                await Send(connections, "sendMessage", message);
            }

            return Task.CompletedTask;
        }
        private async Task Send(HashSet<string> connections, string methodName, object sendObject)
        {
            foreach (var conn in connections)
            {
                try
                {
                    await Clients.Client(conn).SendAsync(methodName, sendObject);
                }
                catch
                {
                    throw new Exception("Error: no connection fount");
                }
            }
        }
    }
}