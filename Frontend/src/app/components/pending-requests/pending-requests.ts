import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './pending-requests.html'
})
export default class PendingRequests implements OnInit, OnDestroy {

  pendingRequests: any[] = [];
  librarianId = 0;
  intervalId: any;

  private borrowApi = 'http://localhost:8080/api/borrow';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('user')!);
    this.librarianId = user.id;

    this.loadPendingRequests();

    // 🔁 auto refresh every 5 sec
    this.intervalId = setInterval(() => {
      this.loadPendingRequests();
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  loadPendingRequests() {
    this.http.get<any[]>(`${this.borrowApi}/pending`).subscribe({
      next: (data) => this.pendingRequests = data
    });
  }

  approveRequest(recordId: number) {
    this.http.post(
      `${this.borrowApi}/approve/${recordId}/${this.librarianId}`,
      {},
      { responseType: 'text' }
    ).subscribe(() => {
      this.loadPendingRequests(); // instant update
    });
  }

  reject(recordId: number) {
    this.http.post(
      `${this.borrowApi}/reject/${recordId}/${this.librarianId}`,
      {},
      { responseType: 'text' }
    ).subscribe(() => {
      this.loadPendingRequests();
    });
  }
}
