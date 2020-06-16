import { Component, OnInit, Injector } from '@angular/core';
import { ContextService } from '../../../_services/context.service';
import { Router } from '@angular/router';
import { getLocaleDateTimeFormat } from '@angular/common';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  constructor(private contextService: ContextService, private router: Router) { }
  ngOnInit() {
  }


}
