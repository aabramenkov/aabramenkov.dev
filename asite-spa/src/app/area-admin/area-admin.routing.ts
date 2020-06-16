import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AreaAdminComponent } from './area-admin.component';
import { UsersComponent } from './users/users.component';
import { ArticleResolver } from './_resolvers/article.Resolver';
import { ContextEditorComponent } from './context-editor/context-editor.component';
import { PostsComponent } from './blog/posts/posts.component';
import { PostComponent } from './blog/post/post.component';
import { PostResolver } from './_resolvers/post.Resolver';

const adminarearoutes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UsersComponent },
  { path: 'posts', component: PostsComponent },
  {
    path: 'post',
    component: PostComponent,
    resolve: { post: PostResolver },
  },
  {
    path: 'editor',
    component: ContextEditorComponent,
    resolve: { article: ArticleResolver },
    runGuardsAndResolvers: 'always',
  },
];

const routes: Routes = [
  { path: '', component: AreaAdminComponent, children: adminarearoutes },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreaAdminRoutes {}
