import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

interface Toast {
  type: 'success' | 'error' | 'info';
  message: string;
}

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export default class ForgotPassword {

  email = '';
  otp = '';
  otpSent = false;

  timer = 60;
  interval: any = null;

  error = '';
  message = '';

  toast: Toast | null = null;
  private toastTimeout: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private showToast(type: Toast['type'], message: string, duration: number = 3000) {
    this.toast = { type, message };

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastTimeout = setTimeout(() => {
      this.toast = null;
    }, duration);
  }

  // ===============================
  // SEND OTP
  // ===============================
  sendOtp() {

    this.error = '';
    this.message = '';

    if (!this.email) {
      this.error = 'Please enter your email';
      this.showToast('info', 'Please enter your email');
      return;
    }

    this.http.post(
      'http://localhost:8080/api/auth/forgot-password',
      { email: this.email },
      { responseType: 'text' }
    ).subscribe({
      next: () => this.onOtpSent(),
      error: () => this.onOtpSent() // backend may still send OTP
    });
  }

  onOtpSent() {
    this.otpSent = true;
    this.otp = '';

    this.message = 'OTP sent successfully';
    this.showToast('success', 'OTP sent to your email');

    this.startTimer();
  }

  // ===============================
  // TIMER
  // ===============================
  startTimer() {

    if (this.interval) {
      clearInterval(this.interval);
    }

    this.timer = 60;

    this.interval = setInterval(() => {

      this.timer--;

      if (this.timer === 0) {
        clearInterval(this.interval);
        this.interval = null;
      }

    }, 1000);
  }

  resendOtp() {
    if (this.timer > 0) return;
    this.sendOtp();
  }

  // ===============================
  // VERIFY OTP (FIXED)
  // ===============================
  verifyOtp() {

    this.error = '';

    if (!this.otp) {
      this.error = 'Please enter OTP';
      this.showToast('info', 'Please enter the OTP');
      return;
    }

    this.http.post<boolean>(
      'http://localhost:8080/api/auth/verify-otp',
      {
        email: this.email,
        otp: this.otp
      }
    ).subscribe({

      next: (valid) => {

        if (valid) {

          this.showToast('success', 'OTP verified');

          this.router.navigate(['/reset-password'], {
            queryParams: {
              email: this.email,
              otp: this.otp
            }
          });

        } else {

          this.error = 'Invalid or expired OTP';
          this.showToast('error', 'Invalid or expired OTP');

        }
      },

      error: () => {

        this.error = 'OTP verification failed';
        this.showToast('error', 'OTP verification failed');

      }

    });

  }

}