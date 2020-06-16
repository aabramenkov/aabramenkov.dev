using GraphQL.Types;

namespace jsite.api.GraphQL.GraphTypes
{
    public class PostInputType : InputObjectGraphType
    {
        public PostInputType()
        {
            Name = "postInput";
            Field<NonNullGraphType<StringGraphType>>("title");
            Field<StringGraphType>("text");
        }
    }
}