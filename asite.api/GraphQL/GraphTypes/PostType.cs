using GraphQL.Types;
using jsite.api.Models;

namespace jsite.api.GraphQL.GraphTypes
{
    public class PostType : ObjectGraphType<Post>
    {
        public PostType()
        {
            Name = "Post";

            Field(x => x.Id,type: typeof(IdGraphType));
            Field(x => x.Title);
            Field(x => x.Description);
            Field(x => x.Text);
            Field(x => x.Url);
            Field(x => x.Created);
            Field(x => x.Updated);
            Field(x => x.Published);
            Field(x => x.Deleted);
            Field(x => x.Comments,type: typeof(ListGraphType<CommentType>)).Description("comments");
            Field<UserType>(nameof(Post.User));
            Field<PostCategoryType>(nameof(Post.PostCategory));
        }
    }
}