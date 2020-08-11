using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace jsite.api.Models
{
    public class User : IdentityUser<int>
    {
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string RegisteredVia { get; set; }
        public string PhotoUrl { get; set; }
        public int SnakeScore {get;set;}
        public virtual ICollection<Post> Posts{get;set;}
        public virtual ICollection<Comment> Comments {get;set;}
    }
}