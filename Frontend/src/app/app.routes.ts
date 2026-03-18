import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import Home from './components/home/home';
import Register from './components/register/register';
import Dashboard from './components/dashboard/dashboard';
import Borrow from './components/borrow/borrow';
import Return from './components/return/return';
import AdminSummary from './components/admin-summary/admin-summary';
import LibrarianDashboard from './components/librarian-dashboard/librarian-dashboard';
import Student from './student/student';

import ForgotPassword from './components/forgot-password/forgot-password';
import ResetPassword from './components/reset-password/reset-password';

// ✅ NEW librarian pages
import PendingRequests from './components/pending-requests/pending-requests';
import ApprovedBorrows from './components/approved-borrows/approved-borrows';
import { Fines } from './components/fines/fines';
import  Support  from './components/support/support';
import About from './components/about/about';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // =========================
  // ✅ Public routes
  // =========================
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },

  // 📄 Public info pages (no auth)
  { path: 'support', component: Support },
  { path: 'about', component: About },

  // =========================
  // ✅ Protected routes
  // =========================
  { path: 'home', component: Home, canActivate: [authGuard] },

  // 👨‍🎓 Student routes
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard], data: { role: 'STUDENT' } },
  { path: 'borrow', component: Borrow, canActivate: [authGuard], data: { role: 'STUDENT' } },
  { path: 'return', component: Return, canActivate: [authGuard], data: { role: 'STUDENT' } },
  { path: 'student', component: Student, canActivate: [authGuard], data: { role: 'STUDENT' } },

  // 📚 Librarian routes
  { path: 'librarian-dashboard', component: LibrarianDashboard, canActivate: [authGuard], data: { role: 'LIBRARIAN' } },
  { path: 'pending-requests', component: PendingRequests, canActivate: [authGuard], data: { role: 'LIBRARIAN' } },
  { path: 'approved-borrows', component: ApprovedBorrows, canActivate: [authGuard], data: { role: 'LIBRARIAN' } },
  { path: 'fines', component: Fines, canActivate: [authGuard], data: { role: 'LIBRARIAN' } },

  // 🛡 Admin routes
  { path: 'admin-summary', component: AdminSummary, canActivate: [authGuard], data: { role: 'ADMIN' } },

  // =========================
  // ✅ Fallback
  // =========================
  { path: '**', redirectTo: 'login' },
];
