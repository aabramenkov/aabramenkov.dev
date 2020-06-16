import { Component, OnInit } from '@angular/core';
import { ContextService } from 'src/app/_services/context.service';
import { Router } from '@angular/router';
import { Article } from 'src/app/_models/article.model';
import {faPen} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  faPen = faPen;

  article: Article = {
    name: '',
    category: '',
    text: 'fdsgf',
  };

  constructor(private contextService: ContextService, private router: Router) { }
  ngOnInit() {
    this.getArticle();
  }

  getArticle() {
    this.contextService.getArticle(4).subscribe(
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
