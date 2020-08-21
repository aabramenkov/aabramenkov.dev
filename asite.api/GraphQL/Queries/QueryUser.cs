using System.Collections.Generic;
using System.Linq;
using GraphQL;
using GraphQL.Types;
using jsite.api.Data;
using jsite.api.GraphQL.GraphTypes;
using jsite.api.Models;
using Microsoft.EntityFrameworkCore;

namespace jsite.api.GraphQL.Queries
{
    public class QueryUser : ObjectGraphType
    {
        private readonly DataContext _context;
        public QueryUser(DataContext context)
        {
            _context = context;
            {

                Field<PostType>(
                "post",
                arguments: new QueryArguments(
                    new QueryArgument<IdGraphType> { Name = "url", Description = "The url of the Post." }),
                resolve: context =>
                {
                    var url = context.GetArgument<string>("url");
                    var post = _context.Posts.Include(post => post.User)
                    .Include(p => p.Comments)
                    .ThenInclude(c => c.ChildComments)
                    .ThenInclude(ch => ch.User)
                    .FirstOrDefault(i => i.Url == url);
                    return post;
                }
              );

                Field<ListGraphType<PostType>>(
                    "posts",
                    resolve: context =>
                    {
                        var posts = _context.Posts.Include(p => p.User).Where(p => p.Published == true);
                        return posts;
                    }
                );

                Field<CommentType>(
                    "comment",
                    arguments: new QueryArguments(
                        new QueryArgument<IdGraphType> { Name = "id" }),
                        resolve: context =>
                        {
                            var id = context.GetArgument<int>("id");
                            var comment = _context.Comments.Include(c => c.User).FirstOrDefault(i => i.Id == id);
                            return comment;
                        }
                    );

                Field<UserType>(
                    "user",
                    arguments: new QueryArguments(
                        new QueryArgument<IdGraphType> { Name = "id" }),
                        resolve: context =>
                        {
                            var id = context.GetArgument<int>("id");
                            var user = _context.Users.FirstOrDefault(i => i.Id == id);
                            return user;
                        }
                    );


            }

        }

    }
}