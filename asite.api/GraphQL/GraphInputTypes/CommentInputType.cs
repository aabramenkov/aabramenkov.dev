using GraphQL.Types;
using jsite.api.Models;

namespace jsite.api.GraphQL.GraphInputTypes
{
    public class CommentInputType : InputObjectGraphType<Comment>
    {
        public CommentInputType()
        {
            Name = "commentInput";

            Field<NonNullGraphType<StringGraphType>>("text");
            Field<NonNullGraphType<IntGraphType>>("postId");
            Field<NonNullGraphType<IntGraphType>>("userId");
        }
    }
}