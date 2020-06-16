using System;

namespace jsite.api.Dtos
{
    public class PostDto
    {
        public int Id { get; set; }
        public string  Title { get; set; }
        public string Description { get; set; }
        public string Text { get; set; }
        public string Url {get;set;}
        public DateTime Created { get; set; }
        public DateTime Updated{get;set;}
        public bool Published {get;set;}
        public bool Deleted {get;set;}
        public int UserId{get;set;}
    }
}