using GraphQL.Types;
using jsite.api.Models;

namespace jsite.api.GraphQL.GraphTypes
{
    public class CommentType : ObjectGraphType<Comment>
    {
        public CommentType()
        {
            Name = "Comment";

            Field(x => x.Id,type: typeof(IdGraphType));
            Field(x => x.Text);
            Field(x => x.Created);
            Field<PostType>(nameof(Comment.Post));
            Field<UserType>(nameof(Comment.User));
            Field(x => x.ChildComments,type: typeof(ListGraphType<ChildCommentType>)).Description("comments for this comment");
        }
    }
}