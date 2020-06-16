import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from './blog.component';
import { PostComponent } from './post/post.component';
import { PostResolver } from './_resolvers/post.Resolver';

const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: BlogComponent },
  {
    path: 'post/:url',
    component: PostComponent,
    resolve: { post: PostResolver},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {}
