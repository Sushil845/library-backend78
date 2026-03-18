import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './support.html',
  styleUrls: ['./support.css']
})
export default class Support {

  name = '';
  email = '';
  message = '';
  loading = false;

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (!this.name || !this.email || !this.message) {
      alert('⚠️ Please fill all fields');
      return;
    }

    this.loading = true;

    this.http.post('http://localhost:8080/api/support', {
      name: this.name,
      email: this.email,
      message: this.message
    }).subscribe({
      next: () => {
        alert('✅ Your message has been sent successfully');
        this.name = '';
        this.email = '';
        this.message = '';
        this.loading = false;
      },
      error: () => {
        alert('❌ Failed to send message. Please try again later.');
        this.loading = false;
      }
    });
  }
}