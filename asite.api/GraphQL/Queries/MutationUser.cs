using System;
using System.Linq;
using GraphQL;
using GraphQL.Types;
using jsite.api.Data;
using jsite.api.GraphQL.GraphInputTypes;
using jsite.api.GraphQL.GraphTypes;
using jsite.api.Models;
using Microsoft.EntityFrameworkCore;

namespace jsite.api.GraphQL.Queries
{
    public class MutationUser : ObjectGraphType
    {
        private readonly DataContext _context;
        public MutationUser(DataContext context)
        {
            _context = context;
            Field<PostType>(
                "createPost",
                arguments: new QueryArguments(
                new QueryArgument<NonNullGraphType<PostInputType>> { Name = "post" }
                ),
                resolve: context =>
                {
                    var post = context.GetArgument<Post>("post");
                    _context.Posts.Add(post);
                    if (_context.SaveChanges() > 0)
                        return post;
                    throw new ExecutionError("Post not added!");
                }
            );

            Field<PostCategoryType>(
                "createPostCategory",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<PostCategoryInputType>> { Name = "category" }
                ),
                resolve: context =>
                {
                    var category = context.GetArgument<PostCategory>("category");
                    _context.PostCategories.Add(category);
                    if (_context.SaveChanges() > 0)
                        return category;
                    throw new ExecutionError("Category not added!");
                }
            );

            Field<CommentType>(
            "createComment",
            arguments: new QueryArguments(
                new QueryArgument<NonNullGraphType<CommentInputType>> { Name = "comment" }
            ),
            resolve: context =>
            {
                var comment = context.GetArgument<Comment>("comment");
                comment.Created = DateTime.Now;
                _context.Comments.Add(comment);
                if (_context.SaveChanges() > 0)
                    _context.Entry(comment).Reference(c => c.User).Load();
                    return comment;
                throw new ExecutionError("comment not added!");
            }
            );

            Field<ChildCommentType>(
                "createChildComment",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<ChildCommentInputType>>{Name = "childComment"}
                ),
                resolve: context =>{
                    var childComment = context.GetArgument<ChildComment>("childComment");
                    childComment.Created = DateTime.Now;
                    _context.ChildComments.Add(childComment);
                    if (_context.SaveChanges() > 0)
                    _context.Entry(childComment).Reference(c => c.User).Load();
                    return childComment;
                    throw new ExecutionError("comment not added!");
                }
            );

            Field<StringGraphType>(
                "deleteChildComment",
                arguments: new QueryArguments(
                      new QueryArgument<IdGraphType> {Name="id"}
                ),
                resolve: context =>{
                    var id = context.GetArgument<int>("id");
                    var childComment = _context.ChildComments.FirstOrDefault(c => c.Id == id);
                    if (childComment==null)
                    return "Comment not exists";
                    _context.ChildComments.Remove(childComment);
                    if (_context.SaveChanges() > 0)
                    return "Child comment was deleted successfully.";
                    throw new ExecutionError("Comment was not deleted!");
                }
            );

                Field<StringGraphType>(
                "deleteComment",
                arguments: new QueryArguments(
                      new QueryArgument<IdGraphType> {Name="id"}
                ),
                resolve: context =>{
                    var id = context.GetArgument<int>("id");
                    var comment = _context.Comments.FirstOrDefault(c => c.Id == id);
                    if (comment==null)
                    return "Comment not exists";
                    _context.Comments.Remove(comment);
                    if (_context.SaveChanges() > 0)
                    return "Comment was deleted successfully.";
                    throw new ExecutionError("Comment was not deleted!");
                }
            );

        }
    }
}