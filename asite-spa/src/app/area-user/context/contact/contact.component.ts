import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EmailService } from '../../../_services/email.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import {faFacebookF} from '@fortawesome/free-brands-svg-icons';
import {faInstagram} from '@fortawesome/free-brands-svg-icons';
import {faLinkedinIn} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  faFacebookF = faFacebookF;
  faInstagram = faInstagram;
  faLinkedinIn = faLinkedinIn;

  isSendingMessageInProgress = false;

  constructor(
    private formBuilder: FormBuilder,
    private emailService: EmailService,
    private snackBar: MatSnackBar,

  ) {}

  contactForm = this.formBuilder.group({
    email: ['', Validators.email],
    message: ['', Validators.required],
  });

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

  onSendMessage() {
    this.isSendingMessageInProgress = true;
    this.emailService.sendEmail(this.contactForm.value).subscribe(
      () => {
        this.snackBar.open('Your message sucesfully sent', 'Julia Site', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary'],
        });
        this.contactForm.reset();
      },
      (error) => {
        this.snackBar.open('Error on sending message.', 'Julia Site', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn'],
        });
      },
      () => {
        this.isSendingMessageInProgress = false;
      }
    );
  }
}
