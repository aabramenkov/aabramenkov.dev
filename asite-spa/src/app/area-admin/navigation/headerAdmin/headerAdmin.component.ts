import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContextService } from 'src/app/_services/context.service';
import { BlogService } from '../../_services/blog.service';

@Component({
  selector: 'app-header-admin',
  templateUrl: './headerAdmin.component.html',
  styleUrls: ['./headerAdmin.component.css'],
})
export class HeaderAdminComponent implements OnInit {
  private activePath: any;
  constructor(
    private rout: ActivatedRoute,
    private router: Router,
    private contextService: ContextService,
    private blogService: BlogService
  ) {}

  ngOnInit() {
  }
  navigateToSite() {
  const url = this.rout.snapshot.firstChild.url[0].path;

  switch (url) {
      case 'users': {
        this.router.navigate(['/about']);
        break;
      }
      case 'editor': {
          const articleId: number = this.rout.snapshot.queryParams.id;
          if (typeof articleId === 'undefined') {
            this.router.navigate(['/about']);
            break;
          }
          this.contextService.getArticle(articleId).subscribe(article => {
            this.router.navigate(['/' + article.category.toLowerCase()]);
          });
          break;
      }
      case 'posts' : {
        this.router.navigate(['/blog/posts']);
        break;
      }
      case 'post': {
        const postId: number = this.rout.snapshot.queryParams.id;
        if (typeof postId === 'undefined'){
          this.router.navigate(['/blog/posts']);
          break;
        }
        this.blogService.getPost(postId).subscribe(post =>
          this.router.navigate(['/blog/post/' + post.url]));
        break;
      }
  }
}
}
