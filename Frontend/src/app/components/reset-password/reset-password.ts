import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
  imports: [CommonModule, FormsModule]
})
export default class ResetPassword {

  // values coming from forgot-password page
  email: string = '';
  otp: string = '';

  // form fields
  newPassword: string = '';
  confirmPassword: string = '';

  // show/hide flags for eye icon
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // captcha
  captcha: string = '';
  captchaInput: string = '';

  // messages
  error: string = '';
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    // read email & otp from URL
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.otp = this.route.snapshot.queryParamMap.get('otp') || '';
    this.generateCaptcha();
  }

  // eye icon toggles
  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // generate simple captcha
  generateCaptcha() {
    this.captcha = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.captchaInput = '';
  }

  changePassword() {
    this.error = '';
    this.message = '';

    if (!this.newPassword || !this.confirmPassword) {
      this.error = 'Please enter and confirm your new password';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (!this.captchaInput) {
      this.error = 'Please enter captcha';
      return;
    }

    if (this.captcha !== this.captchaInput.toUpperCase()) {
      this.error = 'Invalid captcha';
      this.generateCaptcha();
      return;
    }

    if (!this.email || !this.otp) {
      this.error = 'Invalid reset request. Please restart the process.';
      return;
    }

    // call backend reset-password API
    this.http.post(
      'http://localhost:8080/api/auth/reset-password',
      {
        email: this.email,
        otp: this.otp,
        newPassword: this.newPassword
      },
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        this.message = 'Password reset successful. Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: () => {
        this.error = 'Invalid or expired OTP. Please try again.';
        this.generateCaptcha();
      }
    });
  }
}
