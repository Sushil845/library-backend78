import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Toast {
  type: 'success' | 'error' | 'info';
  message: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export default class Register {
  name: string = '';
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  // for password strength bar
  passwordStrength: '' | 'weak' | 'medium' | 'strong' = '';

  // toast just for this component
  toast: Toast | null = null;
  private toastTimeout: any;

  constructor(private http: HttpClient, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  private showToast(type: Toast['type'], message: string, duration: number = 3000) {
    this.toast = { type, message };
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.toast = null;
    }, duration);
  }

  updatePasswordStrength(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    let score = 0;

    if (value.length >= 8) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^a-zA-Z0-9]/.test(value)) score++;

    if (!value) {
      this.passwordStrength = '';
    } else if (score <= 2) {
      this.passwordStrength = 'weak';
    } else if (score === 3) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  registerUser() {
    if (!this.name.trim() || !this.email.trim() || !this.password.trim()) {
      this.showToast('info', 'Please fill in all fields');
      return;
    }

    const payload = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password.trim(),
      role: 'STUDENT'
    };

    this.http.post('http://localhost:8080/api/users/register', payload, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          if (response.includes('successful')) {
            this.showToast('success', 'Registration successful! 🎉 Check your email for confirmation.');
            this.router.navigate(['/login']);
          } else {
            this.showToast('error', response);
          }
        },
        error: (err) => {
          if (err.status === 400) {
            this.showToast('error', 'Email already exists');
          } else {
            this.showToast('error', 'Server error. Please try again.');
          }
        }
      });
  }
}
