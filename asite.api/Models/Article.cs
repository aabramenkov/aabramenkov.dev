namespace jsite.api.Models
{
    public class Article
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Title{get;set;}
        public string Subtitle{get;set;}
        public string ShortDescription{get;set;}
        public string Text { get; set; }
        public int CategoryId {get;set;}
        public virtual Category Category { get; set; }
    }
}