import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class RestApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  public post(url: string, data?: any, headers?: HttpHeaders): Observable<any> {
    const options = headers ? { headers } : {};
    return this.http.post(`${this.baseUrl}${url}`, data, options);
  }

  public get(url: string, headers?: HttpHeaders): Observable<any> {
    const options = headers ? { headers } : {};
    return this.http.get(`${this.baseUrl}${url}`, options);
  }
}
