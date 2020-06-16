using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace jsite.api.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string  Title { get; set; }
        public string Description { get; set; }
        public string Text { get; set; }
        [Required]
        public string Url {get;set;}
        public DateTime Created { get; set; }
        public DateTime Updated{get;set;}
        public bool Published {get;set;}
        public bool Deleted {get;set;}
        public int UserId {get;set;}
        public virtual User User{get;set;}
        public virtual PostCategory PostCategory{get;set;}
        public virtual ICollection<Comment> Comments {get;set;}
    }
}