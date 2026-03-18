import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Toast {
  type: 'success' | 'error' | 'info';
  message: string;
}

// ── Activity popup interface (added) ──
interface ActivityPopup {
  id:         number;
  name:       string;
  init:       string;
  avClass:    string;
  colorClass: string;
  emoji:      string;
  action:     string;
  book:       string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit, OnDestroy {

  // ── Original properties (unchanged) ──
  email:        string  = '';
  password:     string  = '';
  isLoading:    boolean = false;
  showPassword: boolean = false;
  toast:        Toast | null = null;
  private toastTimeout: any;

  // ── Activity popup properties (added) ──
  activityPopups: ActivityPopup[] = [];

  private readonly ACTIVITIES = [
    { name:'Riya',    init:'R', avClass:'av-rose',  colorClass:'ac-borrow',  emoji:'📖', action:'just borrowed',    book:'Atomic Habits'           },
    { name:'Arjun',   init:'A', avClass:'av-azure', colorClass:'ac-reserve', emoji:'🔖', action:'returned',         book:'The Alchemist'            },
    { name:'Sneha',   init:'S', avClass:'av-purp',  colorClass:'ac-finish',  emoji:'⭐', action:'returned', book:'Sapiens'                  },
    { name:'Karthik', init:'K', avClass:'av-gold',  colorClass:'ac-borrow',  emoji:'📚', action:'just borrowed',    book:'Wings of Fire'            },
    { name:'Meera',   init:'M', avClass:'av-teal',  colorClass:'ac-return',  emoji:'✅', action:'returned',         book:'Rich Dad Poor Dad'        },
    { name:'Dev',     init:'D', avClass:'av-azure', colorClass:'ac-borrow',  emoji:'📖', action:'just borrowed',    book:'Think & Grow Rich'        },
    { name:'Priya',   init:'P', avClass:'av-rose',  colorClass:'ac-reserve', emoji:'🔖', action:'returned',         book:'Ikigai'                   },
    { name:'Rahul',   init:'R', avClass:'av-gold',  colorClass:'ac-borrow',  emoji:'📚', action:'just borrowed',    book:'The Psychology of Money'  },
  ];

  private actIdx:       number = 0;
  private popupIdSeed:  number = 0;
  private intervalRef:  any;
  private timeoutRef:   any;

  constructor(private http: HttpClient, private router: Router) {}

  // ── Lifecycle hooks (added OnInit / OnDestroy) ──
  ngOnInit(): void {
    this.startActivityPopups();
  }

  ngOnDestroy(): void {
    this.stopActivityPopups();
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }

  // ── Original methods (unchanged) ──
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  private showToast(type: Toast['type'], message: string, duration: number = 3000) {
    this.toast = { type, message };
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => { this.toast = null; }, duration);
  }

  loginUser() {
    if (!this.email.trim() || !this.password.trim()) {
      this.showToast('info', 'Please enter both email and password');
      return;
    }

    this.isLoading = true;

    this.http.post<any>('http://localhost:8080/api/users/login', {
      email:    this.email.trim(),
      password: this.password.trim()
    }).subscribe({
      next: (user) => {
        this.isLoading = false;

        if (!user || !user.role) {
          this.showToast('error', 'Invalid response from server.');
          return;
        }

        console.log('Login response:', user);
        this.showToast('success', `Welcome ${user.name}! You are logged in as ${user.role}.`);

        sessionStorage.setItem('user',      JSON.stringify(user));
        sessionStorage.setItem('userEmail', user.email);
        sessionStorage.setItem('userRole',  user.role);
        sessionStorage.setItem('userName',  user.name);

        const role = user.role ? user.role.toUpperCase() : '';

        switch (role) {
          case 'ADMIN':     this.router.navigate(['/admin-summary']);       break;
          case 'LIBRARIAN': this.router.navigate(['/librarian-dashboard']); break;
          default:          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.showToast('error', 'Invalid credentials');
        } else {
          this.showToast('error', 'Server error. Please try again.');
        }
      }
    });
  }

  // ── Activity popup methods (added) ──
  startActivityPopups(): void {
    this.timeoutRef = setTimeout(() => {
      this.showActivityPopup();
      this.intervalRef = setInterval(() => this.showActivityPopup(), 3500);
    }, 1800);
  }

  stopActivityPopups(): void {
    clearTimeout(this.timeoutRef);
    clearInterval(this.intervalRef);
  }

  showActivityPopup(): void {
    if (this.activityPopups.length >= 3) {
      this.activityPopups.shift();
    }
    const a = this.ACTIVITIES[this.actIdx % this.ACTIVITIES.length];
    this.actIdx++;
    const popup: ActivityPopup = { ...a, id: ++this.popupIdSeed };
    this.activityPopups.push(popup);
    setTimeout(() => this.dismissPopup(popup), 4500);
  }

  dismissPopup(popup: ActivityPopup): void {
    const i = this.activityPopups.findIndex(p => p.id === popup.id);
    if (i !== -1) this.activityPopups.splice(i, 1);
  }
}