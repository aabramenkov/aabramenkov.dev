import { Component, OnInit, Input } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ContextService } from 'src/app/_services/context.service';
import { Router } from '@angular/router';
import { Category } from 'src/app/_models/category.model';

interface CategoryNode {
  id?: number;
  name: string;
  articles?: ArticleNode[];
}
interface ArticleNode {
  name: string;
  id?: number;
}

@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.css'],
})
export class TreeviewComponent implements OnInit {
  @Input() categories: Category[]|null = null;
  treeControl = new NestedTreeControl<CategoryNode>((node) => node.articles);
  dataSource = new ArrayDataSource<Category>([]);

  hasChild = (_: number, node: CategoryNode) =>
    !!node.articles && node.articles.length > 0

  constructor(private contextService: ContextService, private router: Router) {}

  ngOnInit(): void {
    this.contextService.getCategories().subscribe((resp: Category[]) => {
       this.dataSource = new ArrayDataSource(resp);
     });
  }

  NodeClick(node: any) {
    const id = node.id;
    this.router.navigate(['/admin/editor/'], {queryParams: {id}});
  }
}
