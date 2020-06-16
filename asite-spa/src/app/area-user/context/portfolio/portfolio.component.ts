import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogArticleComponent } from '../../_dialog-article/dialog-article.component';
import { ContextService } from 'src/app/_services/context.service';
import { Router } from '@angular/router';
import { Article } from 'src/app/_models/article.model';
import {faPen} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit {
  faPen = faPen;
  portfolioArticles: Article[];

  constructor(
    public dialog: MatDialog,
    private contextService: ContextService,
    private router: Router
  ) {}

  ngOnInit() {
    this.contextService
      .getArticlesByCategory('Portfolio')
      .subscribe((articles) => {
        this.portfolioArticles = articles;
      });
  }

  cardShowMore(artile: Article) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = artile;
    this.dialog.open(DialogArticleComponent, dialogConfig);
  }

  editArticle(id: number) {
    this.router.navigate(['/admin/editor'], {queryParams: {id}});
  }

}
