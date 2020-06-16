import { Component, OnInit } from '@angular/core';
import {faFacebookF} from '@fortawesome/free-brands-svg-icons';
import {faInstagram} from '@fortawesome/free-brands-svg-icons';
import {faLinkedinIn} from '@fortawesome/free-brands-svg-icons';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  faFacebookF = faFacebookF;
  faInstagram = faInstagram;
  faLinkedinIn = faLinkedinIn;

  constructor() { }

  ngOnInit() {
  }
  openFacebookPage() {
    window.open(
      'https://www.facebook.com/alex.abramenkov.5',
      '_blank'
    );
  }
  openLinkedinPage() {
    window.open(
      'https://www.linkedin.com/in/aleksey-abramenkov/',
      '_blank'
    );
  }

}
