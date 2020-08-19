import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';

import { User } from 'src/app/_models/user.model';
import { Comment } from 'src/app/_models/comment.model';
import { ChildComment } from 'src/app/_models/childComment.model';
import { Router } from '@angular/router';
import { GraphqlService } from '../_services/graphql.service';
import { Email } from 'src/app/_models/email.model';
import { EmailService } from 'src/app/_services/email.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  @Output() commentDeleted = new EventEmitter<Comment>();

  user: User;
  public isAddCommentActive = false;

  constructor(
    private graphqlService: GraphqlService,
    private authService: AuthService,
    private router: Router,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
  }

  addChildComment() {
    if (!this.authService.loggedIn) {
      localStorage.setItem('actualPageUrl', this.router.url);
      this.authService.login(
        'Only regisered users can leave comments. Please sign-in..'
      );
      return;
    }
    this.isAddCommentActive = true;
  }

  cancelAddComment() {
    this.isAddCommentActive = false;
  }
  publishChildComment(commentText: string) {
    if (!commentText) {
      this.isAddCommentActive = false;
      return;
    }
    this.graphqlService
      .addChildComment(commentText, this.user.id, this.comment.id)
      .subscribe((data) => {
        const childComment: ChildComment = data;
        if (this.comment.childComments) {
          this.comment.childComments.push(childComment);
        } else {
          this.comment.childComments = [childComment];
        }
      });
    const email: Email = {
      email: '',
      message:
        'A new comment was added. <br>' +
        'Link: aabramenkov.dev' +
        this.router.url + '<br>' +
        'Text: ' + commentText,
    };
    this.emailService.sendEmail(email).subscribe();

    this.isAddCommentActive = false;
  }

  onChildCommentCreated(childComment: ChildComment) {
    this.comment.childComments.push(childComment);
    const email: Email = {
      email: '',
      message:
        'A new comment was added. <br>' +
        'Link: aabramenkov.dev' +
        this.router.url + '<br>' +
        'Text: ' + childComment.text,
    };
    this.emailService.sendEmail(email).subscribe();
  }
  onChildCommentDeleted(childComment: ChildComment) {
    const index = this.comment.childComments.indexOf(childComment, 0);
    if (index > -1) {
      this.comment.childComments.splice(index, 1);
    }
  }
  deleteComment() {
    this.graphqlService.deleteComment(this.comment.id).subscribe((data) => {
      console.log(data);
      this.commentDeleted.emit(this.comment);
    });
  }
}
