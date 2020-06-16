using System.Collections.Generic;

namespace jsite.api.Dtos
{
    public class CategoryForTreeViewDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<ArticleForTreeViewDto> Articles { get; set; }

    }
}