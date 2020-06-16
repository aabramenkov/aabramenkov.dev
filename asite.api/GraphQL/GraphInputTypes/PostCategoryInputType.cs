using GraphQL.Types;

namespace jsite.api.GraphQL.GraphTypes
{
    public class PostCategoryInputType : InputObjectGraphType
    {
        public PostCategoryInputType()
        {
            Field<NonNullGraphType<StringGraphType>>("name");
        }

    }
}