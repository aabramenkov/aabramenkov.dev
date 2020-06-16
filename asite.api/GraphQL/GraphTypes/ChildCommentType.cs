using GraphQL.Types;
using jsite.api.Models;

namespace jsite.api.GraphQL.GraphTypes
{
    public class ChildCommentType: ObjectGraphType<ChildComment>
    {
        public ChildCommentType(){
            Name = "ChildComment";

            Field(x => x.Id,type: typeof(IdGraphType));
            Field(x => x.Text);
            Field(x => x.Created);
            Field (x => x.CommentId);
            Field<UserType>(nameof(Comment.User));
        }
    }
}