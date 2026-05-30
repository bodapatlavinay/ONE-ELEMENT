import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast--' + toast.type">
          <span class="toast-icon">{{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ' }}</span>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.remove(toast.id)">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 320px;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border-radius: 4px;
      background: #1a1a1a;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      animation: toastIn 0.3s cubic-bezier(0.4,0,0.2,1);
      font-family: 'Space Mono', monospace;
      font-size: 12px;
      letter-spacing: 0.03em;
    }
    .toast--success { border-color: rgba(226,88,34,0.3); }
    .toast--error { border-color: rgba(255,59,59,0.3); }
    .toast-icon {
      width: 20px; height: 20px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: rgba(226,88,34,0.15); color: #E25822;
      font-size: 11px; font-weight: 700; flex-shrink: 0;
    }
    .toast--error .toast-icon { background: rgba(255,59,59,0.15); color: #ff3b3b; }
    .toast-message { flex: 1; color: rgba(255,255,255,0.9); }
    .toast-close {
      background: transparent; border: none; color: rgba(255,255,255,0.3);
      cursor: pointer; font-size: 12px; padding: 2px;
      transition: color 0.2s;
      &:hover { color: #fff; }
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
