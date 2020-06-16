using GraphQL.Types;
using jsite.api.Models;

namespace jsite.api.GraphQL.GraphInputTypes
{
    public class ChildCommentInputType : InputObjectGraphType<ChildComment>
    {
        public ChildCommentInputType()
        {
            Name = "childCommentInput";

            Field<NonNullGraphType<StringGraphType>>("text");
            Field<NonNullGraphType<IntGraphType>>("commentId");
            Field<NonNullGraphType<IntGraphType>>("userId");

        }
    }
}