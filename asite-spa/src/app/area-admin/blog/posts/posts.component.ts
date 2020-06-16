import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../_services/blog.service';
import { Post } from 'src/app/_models/post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  posts: Post[];
  displayedColumns: string[] = [
    'published',
    'title',
    'created',
    'description',
    'action'
  ];


  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.blogService.getPosts().subscribe((data) => {
      this.posts = data;
    });
  }
  editPost(id: number){
    this.router.navigate(['/admin/post'], {queryParams: {id}});
  }
  createNewPost(){
    this.router.navigate(['/admin/post']);
    }
  }

