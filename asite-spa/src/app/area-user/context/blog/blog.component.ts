import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/_models/post.model';
import { GraphqlService } from './_services/graphql.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  loading = true;
  posts: Post[];

  constructor(
    private router: Router,
    private blogService: GraphqlService
  ) {}

  ngOnInit() {
    this.blogService.getPosts().subscribe((data) => {
      this.posts = data;
    });
  }

  openPost(url: string) {
    this.router.navigate(['blog/post/' + url]);
  }
}
