import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/_models/article.model';
import { ContextService } from 'src/app/_services/context.service';
import { Router } from '@angular/router';
import {faPen} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-special-offer',
  templateUrl: './special-offer.component.html',
  styleUrls: ['./special-offer.component.scss']
})
export class SpecialOfferComponent implements OnInit {
  faPen = faPen;
  article: Article = {
    id: 0,
    name: '',
    category: '',
    text: 'page loading',
  };

  constructor(private contextService: ContextService, private router: Router) { }
  ngOnInit() {
    this.getArticle();
  }

  getArticle() {
    this.contextService.getArticle(19).subscribe(
      (a) => {
        this.article = a;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  editArticle(id: number) {
    this.router.navigate(['/admin/editor'], {queryParams: {id}});
  }
}
