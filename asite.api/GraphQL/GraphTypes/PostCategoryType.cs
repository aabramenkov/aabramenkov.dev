using GraphQL.Types;
using jsite.api.Models;

namespace jsite.api.GraphQL.GraphTypes
{
    public class PostCategoryType : ObjectGraphType<PostCategory>
    {
        public PostCategoryType()
        {
            Name = "PostCategory";

            Field(x => x.Id,type: typeof(IdGraphType));
            Field(x => x.Name);
            Field(x => x.Posts, type: typeof(ListGraphType<PostType>)).Description("Posts with this category");
        }
    }
}