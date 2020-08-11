import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fun',
  templateUrl: './fun.component.html',
  styleUrls: ['./fun.component.scss']
})
export class FunComponent implements OnInit {
  gameSnakeSelect: boolean = true;
  gameRenjuSelect: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  selectGame(game: string){
    if (game === 'snake'){
      this.gameSnakeSelect = true;
      this.gameRenjuSelect = false;
    }
    if (game === 'renju'){
      this.gameSnakeSelect = false;
      this.gameRenjuSelect = true;
    }

  }

}
