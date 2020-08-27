import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/_services/auth.service';

import { User } from 'src/app/_models/user.model';
import { Post } from 'src/app/_models/post.model';
import { Comment } from 'src/app/_models/comment.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GraphqlService } from '../_services/graphql.service';
import { EmailService } from 'src/app/_services/email.service';
import { Email } from 'src/app/_models/email.model';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  faPen = faPen;
  post!: Post;
  loading = true;
  user: User | undefined;

  isAddCommentFieldActive = false;

  constructor(
    private graphqlService: GraphqlService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    this.route.data.subscribe((data) => {
      this.post = data.post;
    });
  }

  addCommentToPost(id: number) {
    if (!this.authService.loggedIn) {
      localStorage.setItem('actualPageUrl', this.router.url);
      this.authService.login(
        'Only regisered users can leave comments. Please sign-in..'
      );
      return;
    }
    this.isAddCommentFieldActive = true;
  }

  addCommentCancel() {
    this.isAddCommentFieldActive = false;
  }

  addCommmentPublish(commentText: string) {
    if (!this.user || !this.post) {
      return;
    }
    this.graphqlService
      .addComment(commentText, this.user.id, this.post.id)
      .subscribe((data) => {
        const comment: Comment = data;
        if (this.post) {
          this.post.comments.push(comment);
        }

        const email: Email = {
          email: '',
          message:
            'A new comment was added. <br>' +
            'Link: aabramenkov.dev' +
            this.router.url +
            '<br>' +
            'Text: ' +
            commentText,
        };
        this.emailService.sendEmail(email).subscribe();
      });
    this.isAddCommentFieldActive = false;
  }

  editPost(id: number) {
    this.router.navigate(['/admin/post'], { queryParams: { id } });
  }

  onCommentDeleted(comment: Comment) {
    if (!this.post) {
      return;
    }
    const index = this.post.comments.indexOf(comment, 0);
    if (index > -1) {
      this.post.comments.splice(index, 1);
    }
  }
}
