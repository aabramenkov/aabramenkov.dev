using System;
using System.Collections.Generic;

namespace jsite.api.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public DateTime Created {get;set;}
        public string Text { get; set; }
        public bool Published {get;set;} 
        public int PostId{get;set;}
        public int UserId{get;set;}
        public virtual Post Post{get;set;}
        public virtual User User{get;set;}
        public virtual IEnumerable<ChildComment> ChildComments{get;set;}
}
}