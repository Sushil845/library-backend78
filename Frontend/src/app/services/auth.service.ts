import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  sendOtp(email: string) {
    return this.http.post(
      `${this.baseUrl}/forgot-password`,
      { email },
      { responseType: 'text' }
    );
  }

  resetPassword(email: string, otp: string, newPassword: string) {
    return this.http.post(
      `${this.baseUrl}/reset-password`,
      { email, otp, newPassword },
      { responseType: 'text' }
    );
  }
}
