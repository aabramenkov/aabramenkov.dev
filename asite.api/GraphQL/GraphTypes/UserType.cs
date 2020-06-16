using GraphQL.Types;
using jsite.api.Models;

namespace jsite.api.GraphQL.GraphTypes
{
    public class UserType : ObjectGraphType<User>
    {
        public UserType()
        {
            Name = "User";
            
            Field(x => x.Id,type: typeof(IdGraphType));
            Field(x => x.UserName);
            Field(x => x.Email);
            Field(x => x.PhotoUrl);
            Field(x => x.Posts,type: typeof(ListGraphType<PostType>)).Description("posts");
            Field(x => x.Comments,type: typeof(ListGraphType<CommentType>)).Description("comments");
        }
    }
}