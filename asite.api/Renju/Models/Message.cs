using System;

namespace Renju.Models
{
    public class Message
    {
        public string From { get; set; }
        public string To { get; set; }
        public DateTime sent { get; set; }
        public string text { get; set; }
    }
}