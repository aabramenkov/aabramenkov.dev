using System;

namespace Renju.Models
{
    public class Message
    {
        public Gamer From { get; set; }
        public Gamer To { get; set; }
        public DateTime sent { get; set; }
        public string text { get; set; }
    }
}