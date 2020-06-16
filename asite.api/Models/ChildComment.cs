using System;

namespace jsite.api.Models
{
    public class ChildComment 
    {
        public int Id { get; set; }
        public DateTime Created {get;set;}
        public string Text { get; set; }
        public bool Published {get;set;} 
        public int UserId{get;set;}
        public int CommentId {get;set;}
        public virtual User User{get;set;}
        public virtual Comment Comment {get;set;}

    }
}