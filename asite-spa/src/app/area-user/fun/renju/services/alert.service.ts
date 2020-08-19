import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // tslint:disable-next-line: variable-name
  constructor(private _snackBar: MatSnackBar) { }

  showMessage(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['simple-snack-bar']
    });
  }
}
