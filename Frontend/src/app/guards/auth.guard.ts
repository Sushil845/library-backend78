import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = sessionStorage.getItem('user');

  // ✅ Check if user is logged in
  if (!user) {
    alert('Access denied! Please log in first.');
    router.navigate(['/login']);
    return false;
  }

  const userObj = JSON.parse(user);
  const requiredRole = route.data?.['role']; // Role specified in route config

  // ✅ Check if route has role restriction
  if (requiredRole && userObj.role !== requiredRole) {
    alert('Access denied! You are not authorized to view this page.');
    router.navigate(['/home']);
    return false;
  }

  return true; // ✅ Allow access if logged in and authorized
};
