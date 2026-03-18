import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { ToastComponent } from './toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  template: `
    <app-toast></app-toast>

    <!-- ── Logout Confirmation Dialog ── -->
    <div class="confirm-overlay" *ngIf="showConfirm" (click)="cancelLogout()">
      <div class="confirm-box" (click)="$event.stopPropagation()">
        <div class="confirm-icon">
          <i class="fas fa-right-from-bracket"></i>
        </div>
        <h3 class="confirm-title">Leaving so soon?</h3>
        <p class="confirm-msg">Are you sure you want to log out of the Library Portal?</p>
        <div class="confirm-actions">
          <button class="btn-cancel"  (click)="cancelLogout()">Stay</button>
          <button class="btn-confirm" (click)="confirmLogout()">Yes, Logout</button>
        </div>
      </div>
    </div>

    <nav *ngIf="showNav" class="nav-bar">

      <!-- Brand -->
      <div class="nav-brand">
        <div class="brand-icon">📚</div>
        <div class="brand-text">
          <span class="brand-name">Library<em></em></span>
          <span class="brand-sub">Management System</span>
        </div>
      </div>

      <!-- Links -->
      <div class="nav-links">

        <!-- Student -->
        <ng-container *ngIf="userRole === 'STUDENT'">
          <a routerLink="/home"    routerLinkActive="active">
            <span class="link-icon">🏠</span> Home
          </a>
          <a routerLink="/student" routerLinkActive="active">
            <span class="link-icon">📖</span> Browse Books
          </a>
          <a routerLink="/borrow"  routerLinkActive="active">
            <span class="link-icon">🔖</span> My Borrowed
          </a>
        </ng-container>

        <!-- Librarian -->
        <ng-container *ngIf="userRole === 'LIBRARIAN'">
          <a routerLink="/librarian-dashboard" routerLinkActive="active">
            <span class="link-icon">📊</span> Dashboard
          </a>
          <a routerLink="/pending-requests" routerLinkActive="active">
            <span class="link-icon">⏳</span> Pending
          </a>
          <a routerLink="/approved-borrows" routerLinkActive="active">
            <span class="link-icon">✅</span> Approved
          </a>
        </ng-container>

        <!-- Admin -->
        <ng-container *ngIf="userRole === 'ADMIN'">
          <a routerLink="/admin-summary" routerLinkActive="active">
            <span class="link-icon">🛡️</span> Admin Summary
          </a>
        </ng-container>

      </div>

      <!-- Right side: role badge + logout -->
      <div class="nav-right">
        <div class="role-badge" [ngClass]="roleBadgeClass">
          <span class="role-dot"></span>
          {{ userRole }}
        </div>
        <button class="logout-btn" (click)="logout()">
          <span>⎋</span> Logout
        </button>
      </div>

    </nav>

    <router-outlet></router-outlet>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');

    :host {
      --ink:        #0d0f1a;
      --cream:      #f8f4ed;
      --gold:       #c9922a;
      --gold-lt:    #f0c060;
      --azure:      #2667c8;
      --teal:       #0e8c75;
      --rose:       #c0385a;
      --glass:      rgba(13, 15, 26, 0.72);
      --glass-b:    rgba(255, 255, 255, 0.10);
      --glass-hi:   rgba(255, 255, 255, 0.06);
    }

    /* ── Confirm Overlay ── */
    .confirm-overlay {
      position: fixed;
      inset: 0;
      z-index: 99998;
      background: rgba(5, 4, 10, 0.75);
      backdrop-filter: blur(7px);
      -webkit-backdrop-filter: blur(7px);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.22s ease both;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .confirm-box {
      background: #1a1525;
      border: 1px solid rgba(201, 146, 42, 0.16);
      border-radius: 22px;
      padding: 38px 32px 30px;
      width: 100%;
      max-width: 370px;
      text-align: center;
      box-shadow:
        0 40px 90px rgba(0,0,0,0.65),
        0 0 60px rgba(201,146,42,0.05);
      animation: popUp 0.36s cubic-bezier(.16,1,.3,1) both;
    }

    @keyframes popUp {
      from { opacity: 0; transform: scale(0.86) translateY(24px); }
      to   { opacity: 1; transform: scale(1)    translateY(0);    }
    }

    .confirm-icon {
      width: 58px; height: 58px;
      background: rgba(192, 56, 90, 0.12);
      border: 1px solid rgba(192, 56, 90, 0.24);
      border-radius: 17px;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
      font-size: 23px;
      color: #f08098;
    }

    .confirm-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.32rem;
      font-weight: 700;
      color: #f0e8d5;
      margin-bottom: 10px;
    }

    .confirm-msg {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      color: rgba(240, 232, 213, 0.50);
      line-height: 1.65;
      margin-bottom: 30px;
    }

    .confirm-actions {
      display: flex;
      gap: 10px;
    }

    .btn-cancel {
      flex: 1; height: 46px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem; font-weight: 600;
      color: rgba(240,232,213,0.55);
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-cancel:hover {
      background: rgba(255,255,255,0.09);
      color: #f0e8d5;
    }

    .btn-confirm {
      flex: 1; height: 46px;
      background: rgba(192, 56, 90, 0.14);
      border: 1px solid rgba(192, 56, 90, 0.34);
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem; font-weight: 700;
      color: #f08098;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-confirm:hover {
      background: rgba(192, 56, 90, 0.26);
      border-color: rgba(192, 56, 90, 0.55);
      box-shadow: 0 4px 20px rgba(192, 56, 90, 0.22);
      transform: translateY(-1px);
    }
    .btn-confirm:active { transform: scale(0.97); }

    /* ── Navbar shell ── */
    .nav-bar {
      position: sticky;
      top: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 0 32px;
      height: 64px;
      background: var(--glass);
      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);
      border-bottom: 1px solid var(--glass-b);
      box-shadow: 0 4px 32px rgba(0, 0, 0, 0.35);
      font-family: 'DM Sans', sans-serif;
      animation: navSlide 0.6s cubic-bezier(.22,1,.36,1) both;
    }

    @keyframes navSlide {
      from { opacity: 0; transform: translateY(-20px); }
      to   { opacity: 1; transform: none; }
    }

    .nav-brand {
      display: flex; align-items: center; gap: 10px;
      text-decoration: none; flex-shrink: 0;
    }

    .brand-icon {
      width: 36px; height: 36px;
      background: linear-gradient(135deg, var(--gold), var(--gold-lt));
      border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem;
      box-shadow: 0 0 16px rgba(201, 146, 42, 0.45);
      animation: iconPulse 3s ease-in-out infinite;
      flex-shrink: 0;
    }

    @keyframes iconPulse {
      0%, 100% { box-shadow: 0 0 16px rgba(201,146,42,0.45); }
      50%       { box-shadow: 0 0 28px rgba(201,146,42,0.75); }
    }

    .brand-text { display: flex; flex-direction: column; line-height: 1; gap: 3px; }

    .brand-name {
      font-family: 'Playfair Display', serif;
      font-size: 1.22rem; font-weight: 700;
      color: var(--cream); letter-spacing: 0.02em; line-height: 1;
    }
    .brand-name em { font-style: italic; color: var(--gold-lt); }

    .brand-sub {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.62rem; font-weight: 500;
      color: rgba(248, 244, 237, 0.38);
      letter-spacing: 0.1em; text-transform: uppercase; line-height: 1;
    }

    .nav-links {
      display: flex; align-items: center; gap: 4px;
      flex: 1; justify-content: center;
    }

    .nav-links a {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 14px; border-radius: 8px;
      font-size: 0.85rem; font-weight: 500;
      color: rgba(248, 244, 237, 0.58);
      text-decoration: none; letter-spacing: 0.02em;
      border: 1px solid transparent;
      transition: color 0.2s, background 0.2s, border-color 0.2s, transform 0.18s;
      position: relative; overflow: hidden;
    }

    .nav-links a::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(201,146,42,0.12), rgba(14,140,117,0.08));
      opacity: 0; transition: opacity 0.2s;
    }

    .nav-links a:hover {
      color: var(--cream); background: var(--glass-hi);
      border-color: var(--glass-b); transform: translateY(-1px);
    }
    .nav-links a:hover::before { opacity: 1; }

    .nav-links a.active {
      color: var(--gold-lt);
      background: rgba(201, 146, 42, 0.12);
      border-color: rgba(240, 192, 96, 0.25);
    }
    .nav-links a.active::before { opacity: 1; }

    .link-icon { font-size: 0.85rem; line-height: 1; }

    .nav-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

    .role-badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 12px; border-radius: 50px;
      font-size: 0.72rem; font-weight: 600;
      letter-spacing: 0.08em; text-transform: uppercase;
    }
    .role-badge.student  { background: rgba(38,103,200,0.15); border: 1px solid rgba(38,103,200,0.32);  color: #7bb8ff; }
    .role-badge.librarian{ background: rgba(14,140,117,0.15); border: 1px solid rgba(14,140,117,0.32);  color: #4de8c8; }
    .role-badge.admin    { background: rgba(201,146,42,0.15);  border: 1px solid rgba(201,146,42,0.32); color: var(--gold-lt); }

    .role-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: currentColor; animation: dotBlink 2s ease infinite;
    }
    @keyframes dotBlink {
      0%, 100% { opacity: 1; } 50% { opacity: 0.25; }
    }

    .logout-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 16px; border-radius: 8px;
      background: rgba(192, 56, 90, 0.12);
      border: 1px solid rgba(192, 56, 90, 0.28);
      color: #f08098;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.83rem; font-weight: 600;
      cursor: pointer; letter-spacing: 0.03em;
      transition: background 0.2s, border-color 0.2s, transform 0.18s, box-shadow 0.2s;
    }
    .logout-btn:hover {
      background: rgba(192, 56, 90, 0.22);
      border-color: rgba(192, 56, 90, 0.5);
      transform: translateY(-1px);
      box-shadow: 0 4px 18px rgba(192, 56, 90, 0.25);
    }
    .logout-btn:active { transform: scale(0.97); }

    @media (max-width: 768px) {
      .nav-bar {
        padding: 0 16px; height: auto; flex-wrap: wrap;
        padding-top: 12px; padding-bottom: 12px; gap: 10px;
      }
      .nav-links {
        order: 3; width: 100%; justify-content: flex-start;
        flex-wrap: wrap; gap: 4px; padding-bottom: 4px;
      }
      .nav-links a { font-size: 0.78rem; padding: 6px 10px; }
      .brand-name  { font-size: 1rem; }
      .brand-sub   { display: none; }
      .role-badge  { display: none; }
    }
  `]
})
export class App {
  showNav     = false;
  showConfirm = false;        // ← controls the dialog
  userRole: string | null = null;

  constructor(private router: Router, private toast: ToastService) {
    this.router.events.subscribe(() => {
      const hiddenRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/about', '/support', '/donation'];
      this.showNav = !hiddenRoutes.includes(this.router.url);

      const storedRole = sessionStorage.getItem('userRole');
      this.userRole = storedRole ? storedRole.toUpperCase() : null;
    });
  }

  get roleBadgeClass(): string {
    switch (this.userRole) {
      case 'STUDENT':   return 'student';
      case 'LIBRARIAN': return 'librarian';
      case 'ADMIN':     return 'admin';
      default:          return '';
    }
  }

  // Logout button clicked → show confirm dialog
  logout() {
    this.showConfirm = true;
  }

  // "Stay" clicked or backdrop clicked
  cancelLogout() {
    this.showConfirm = false;
  }

  // "Yes, Logout" clicked
  confirmLogout() {
    this.showConfirm = false;
    sessionStorage.clear();
    this.userRole = null;
    this.showNav  = false;
    this.router.navigate(['/login']);
    this.toast.show('You have been logged out.', 'success');
  }
}