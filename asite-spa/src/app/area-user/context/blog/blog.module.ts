import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialUserAreaModule } from '../../_materialModule/material-userarea.module';
import { SharedModule } from 'src/app/_sharedModule/shared.module';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { CommentComponent } from './comment/comment.component';
import { ChildCommentComponent } from './child-comment/child-comment.component';
import { PostComponent } from './post/post.component';
import { TimeAgoPipe } from 'src/app/_sharedModule/pipes/timeAgo.pipe';
import { GraphQLModule } from './graphql.module';
import { PostResolver } from './_resolvers/post.Resolver';
import { GraphqlService } from './_services/graphql.service';


@NgModule({
  declarations: [
    BlogComponent,
    PostComponent,
    CommentComponent,
    ChildCommentComponent,
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    SharedModule,
    MaterialUserAreaModule,
    GraphQLModule

  ],
  providers: [
    PostResolver,
    GraphqlService
  ]
})
export class BlogModule { }
