import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecoveryPasswordService {
  private apiUrl = 'https://pre.tramits.idi.es/public/index.php/send-mail';
  constructor(private http: HttpClient) {}

  sendRecoveryEmail(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
