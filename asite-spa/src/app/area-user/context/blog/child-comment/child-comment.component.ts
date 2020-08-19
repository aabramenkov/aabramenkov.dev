import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ChildComment } from 'src/app/_models/childComment.model';
import { AuthService } from 'src/app/_services/auth.service';
import { User } from 'src/app/_models/user.model';
import { Router } from '@angular/router';
import { GraphqlService } from '../_services/graphql.service';

@Component({
  selector: 'app-child-comment',
  templateUrl: './child-comment.component.html',
  styleUrls: ['./child-comment.component.scss'],
})
export class ChildCommentComponent implements OnInit {
  @Input() childComment: ChildComment;
  @Output() childCommentCreated = new EventEmitter<ChildComment>();
  @Output() childCommentDeleted = new EventEmitter<ChildComment>();
  public isAddCommentActive = false;
  public user: User;

  constructor(
    private graphqlService: GraphqlService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
  }
  addChildComment() {
    this.isAddCommentActive = true;
    if (!this.authService.loggedIn) {
      localStorage.setItem('actualPageUrl', this.router.url);
      this.authService.login(
        'Only regisered users can leave comments. Please sign-in..'
      );
      return;
    }
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
      .addChildComment(commentText, this.user.id, this.childComment.commentId)
      .subscribe((data) => {
        const createdChildComment: ChildComment = data;
        this.childCommentCreated.emit(createdChildComment);
      });
    this.isAddCommentActive = false;
  }

  deleteComment() {
    this.graphqlService
      .deleteChildComment(this.childComment.id)
      .subscribe((data) => {
        this.childCommentDeleted.emit(this.childComment);
      });
  }
}
