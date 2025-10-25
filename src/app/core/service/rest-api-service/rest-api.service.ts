import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  private http = inject(HttpClient);

  public post(url: string, data?: any, headers?: HttpHeaders): Observable<any> {
    const baseUrl = environment.apiUrl;
    const options = headers ? { headers: headers } : {};

    return this.http.post(`${baseUrl}${url}`, data, options);
  }

  public get(url: string, headers: HttpHeaders): Observable<any> {
    const baseUrl = environment.apiUrl;
    const options = headers ? { headers: headers } : {};

    return this.http.get(`${baseUrl}${url}`, options);
  }
}
