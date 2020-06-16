import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Article } from 'src/app/_models/article.model';

@Component({
  selector: 'app-dialog-article',
  templateUrl: 'dialog-article.component.html',
  styleUrls: ['dialog-article.component.scss']
})
export class DialogArticleComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Article, private router: Router, private dialogRef: MatDialogRef<DialogArticleComponent>
  ) {

  }

  navigateToContact() {
    this.router.navigate(['/contacts']);
    this.dialogRef.close();
  }
}

