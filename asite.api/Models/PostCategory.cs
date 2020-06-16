using System.Collections.Generic;

namespace jsite.api.Models
{
    public class PostCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection <Post> Posts {get;set;}
    }
}