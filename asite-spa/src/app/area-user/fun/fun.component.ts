import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fun',
  templateUrl: './fun.component.html',
  styleUrls: ['./fun.component.scss']
})
export class FunComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  selectGame(game: string){
    if (game === 'snake'){
      this.router.navigate(['/fun/snake']);
    }
    if (game === 'renju'){
      this.router.navigate(['/fun/renju']);
    }

  }

}
