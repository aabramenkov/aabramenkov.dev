import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PhotoService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  uploadPhoto(fileToUpload: File): Observable<any> {
    const endpoint = this.baseUrl + 'photo/upload';
    const formData: FormData = new FormData();
    formData.append('File', fileToUpload);
    formData.append('Name', fileToUpload.name);

    const response = this.http
      .post<any>(endpoint, formData);
    return response;
  }

}
