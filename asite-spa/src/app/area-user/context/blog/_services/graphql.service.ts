import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { map, catchError } from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import { Post } from 'src/app/_models/post.model';
import { Apollo } from 'apollo-angular';

@Injectable()
export class GraphqlService {
  posts: Post[] = [];
  constructor(private apollo: Apollo) {}

getPosts(): Observable<any> {
    return this.apollo
      .watchQuery<any>({
        query: gql`
          {
            posts {
              text
              title
              description
              created
              url
              user {
                userName
                photoUrl
              }
            }
          }
        `,
      }).valueChanges
       .pipe(map(({ data}) => data.posts));
  }

  getPost(postUrl: string): Observable<any>{
    const getPost = gql`
    query getpost($url: ID!) {
      post(url: $url) {
        id
        text
        title
        description
        created
        url
        user {
          userName
          photoUrl
        }
        comments {
          id
          text
          created
          user {
            userName
            photoUrl
          }
          childComments {
            id
            text
            created
            commentId
            user {
              userName
              photoUrl
            }
          }
        }
      }
    }
    `;

    return this.apollo
          .query<any>({
            query: getPost,
            variables: {
              url: postUrl,
            },
          }).pipe(
              map(({ data }) => data.post),
            catchError((error) => {
                return of(null);
            })
            );
  }

  addChildComment(commentText: string, userId: number, commentId: number): Observable<any>{
     const addChildCommentMutation = gql`
    mutation ($childComment:childCommentInput!){
      createChildComment(childComment:$childComment){
        id
        created
        text
        commentId
        user{
          id
          userName
          photoUrl
        }
      }
    }
    `;
     return this.apollo.mutate<any>({
      mutation: addChildCommentMutation,
      variables: {
        childComment: {
          text: commentText,
          userId,
          commentId
        }
      }
    }).pipe(map(({ data}) => data.createChildComment));

  }

  addComment(text: string, userId: number, postId: number): Observable<any>{
    const addCommentMutation = gql`
      mutation($comment: commentInput!) {
        createComment(comment: $comment) {
          id
          created
          text
          user {
            id
            userName
            photoUrl
          }
        }
      }
    `;
    return this.apollo
      .mutate<any>({
        mutation: addCommentMutation,
        variables: {
          comment: {
            text,
            userId,
            postId,
          },
        },
      }).pipe(map(({ data }) => data.createComment));
  }

  deleteChildComment(commentId: number){
    const deleteChildComment = gql`
      mutation($id:ID!) {
        deleteChildComment(id:$id)
      }
    `;
    return this.apollo
      .mutate<any>({
        mutation: deleteChildComment,
        variables: {
          id: commentId
        }
      }).pipe(map(({ data }) => data.deleteChildComment));
  }

  deleteComment(commentId: number){
    const deleteComment = gql`
      mutation($id:ID!) {
        deleteComment(id:$id)
      }
    `;
    return this.apollo
      .mutate<any>({
        mutation: deleteComment,
        variables: {
          id: commentId
        }
      }).pipe(map(({ data }) => data.deleteComment));
  }
}
