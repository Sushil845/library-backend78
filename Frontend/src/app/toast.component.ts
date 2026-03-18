import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-host">
      <div
        *ngFor="let toast of toasts; trackBy: trackById"
        class="toast toast--{{ toast.type }}"
        (click)="service.remove(toast.id)"
      >
        <span class="toast__icon">
          <i class="fas" [ngClass]="{
            'fa-check-circle':         toast.type === 'success',
            'fa-exclamation-circle':   toast.type === 'error',
            'fa-info-circle':          toast.type === 'info',
            'fa-exclamation-triangle': toast.type === 'warning'
          }"></i>
        </span>
        <span class="toast__msg">{{ toast.message }}</span>
        <button class="toast__close" (click)="service.remove(toast.id)">
          <i class="fas fa-times"></i>
        </button>
        <span
          class="toast__bar"
          [style.animation-duration]="toast.duration + 'ms'"
        ></span>
      </div>
    </div>
  `,
  styles: [`
    .toast-host {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }

    .toast {
      pointer-events: all;
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      max-width: 400px;
      padding: 14px 16px;
      border-radius: 14px;
      border: 1px solid transparent;
      overflow: hidden;
      cursor: pointer;
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      animation: toastIn 0.4s cubic-bezier(.16,1,.3,1) both;
      font-family: 'DM Sans', 'Sora', sans-serif;
    }

    @keyframes toastIn {
      from { opacity: 0; transform: translateX(60px) scale(0.94); }
      to   { opacity: 1; transform: translateX(0)   scale(1);     }
    }

    /* ── Types ── */
    .toast--success {
      background: rgba(15, 26, 20, 0.92);
      border-color: rgba(86, 196, 139, 0.28);
    }
    .toast--error {
      background: rgba(26, 14, 18, 0.92);
      border-color: rgba(224, 92, 110, 0.28);
    }
    .toast--info {
      background: rgba(14, 18, 36, 0.92);
      border-color: rgba(96, 165, 250, 0.28);
    }
    .toast--warning {
      background: rgba(26, 20, 8, 0.92);
      border-color: rgba(201, 168, 76, 0.32);
    }

    /* ── Icon ── */
    .toast__icon { font-size: 17px; flex-shrink: 0; }
    .toast--success .toast__icon { color: #56c48b; }
    .toast--error   .toast__icon { color: #f08090; }
    .toast--info    .toast__icon { color: #93c5fd; }
    .toast--warning .toast__icon { color: #c9a84c; }

    /* ── Message ── */
    .toast__msg {
      flex: 1;
      font-size: 13.5px;
      font-weight: 500;
      line-height: 1.45;
      color: #f0e8d5;
    }

    /* ── Close ── */
    .toast__close {
      background: none;
      border: none;
      color: rgba(240, 232, 213, 0.30);
      cursor: pointer;
      font-size: 11px;
      padding: 4px;
      border-radius: 6px;
      flex-shrink: 0;
      transition: color 0.2s;
    }
    .toast__close:hover { color: #f0e8d5; }

    /* ── Progress bar ── */
    .toast__bar {
      position: absolute;
      bottom: 0; left: 0;
      height: 2px;
      width: 100%;
      transform-origin: left;
      animation: shrink linear both;
    }
    .toast--success .toast__bar { background: #56c48b; }
    .toast--error   .toast__bar { background: #f08090; }
    .toast--info    .toast__bar { background: #93c5fd; }
    .toast--warning .toast__bar { background: #c9a84c; }

    @keyframes shrink {
      from { transform: scaleX(1); }
      to   { transform: scaleX(0); }
    }
  `]
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(public service: ToastService) {}

  ngOnInit() {
    this.service.toasts.subscribe(t => this.toasts = t);
  }

  trackById(_: number, t: Toast) { return t.id; }
}