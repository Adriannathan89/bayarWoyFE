import { Component, Input, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LucidePlus, LucideBell, LucideSun, LucideMoon } from '@lucide/angular';
import { SwithTheme } from '../core/service/styles/switch-theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [LucidePlus, LucideBell, LucideSun, LucideMoon],
  styles: [`
    :host { display: block; width: 100%; flex-shrink: 0; }

    .theme-btn {
      position: relative; overflow: hidden;
      width: 36px; height: 36px; border-radius: 10px;
      border: 1px solid var(--bw-border); background: var(--bw-surface);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--bw-ink-2); flex-shrink: 0;
      transition: background 0.15s, border-color 0.15s;
    }
    .theme-btn:hover { background: var(--bw-sunken); }

    .ripple {
      position: absolute; inset: 0; border-radius: inherit;
      background: var(--bw-lime); opacity: 0; pointer-events: none;
    }
    .theme-btn.toggling .ripple {
      animation: btn-ripple 0.48s ease-out forwards;
    }

    .theme-icon { display: flex; align-items: center; justify-content: center; }
    .theme-icon.spinning {
      animation: icon-morph 0.48s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes icon-morph {
      0%   { transform: scale(1) rotate(0deg);    opacity: 1; }
      38%  { transform: scale(0) rotate(-210deg); opacity: 0; }
      62%  { transform: scale(0) rotate(210deg);  opacity: 0; }
      100% { transform: scale(1) rotate(0deg);    opacity: 1; }
    }

    @keyframes btn-ripple {
      0%   { opacity: 0.22; transform: scale(0.5); }
      55%  { opacity: 0.10; transform: scale(1.3); }
      100% { opacity: 0;    transform: scale(1); }
    }
  `],
  template: `
    <header class="hidden md:flex items-center justify-between px-8 py-5 border-b border-bw-border bg-bw-surface shrink-0">
      <div>
        <div class="text-[11px] font-semibold tracking-[0.08em] uppercase text-bw-ink-3">BayarWoy</div>
        <h1 class="text-[22px] font-bold tracking-[-0.03em] text-bw-ink mt-0.5 leading-none">{{ title }}</h1>
      </div>

      <div class="flex items-center gap-3">
        <!-- Theme toggle -->
        <button class="theme-btn" [class.toggling]="animating()" (click)="toggleTheme()"
                [attr.title]="isDark ? 'Mode terang' : 'Mode gelap'">
          <span class="ripple"></span>
          <span class="theme-icon" [class.spinning]="animating()">
            @if (isDark) {
              <svg lucideSun class="w-4 h-4"></svg>
            } @else {
              <svg lucideMoon class="w-4 h-4"></svg>
            }
          </span>
        </button>

        <button class="flex items-center justify-center w-9 h-9 rounded-[10px] border border-bw-border text-bw-ink-2 hover:bg-bw-sunken transition-colors cursor-pointer">
          <svg lucideBell class="w-4 h-4"></svg>
        </button>

        <button (click)="goToAdd()"
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-bw-ink text-bw-on-ink text-[13px] font-semibold hover:opacity-90 transition-opacity cursor-pointer">
          <svg lucidePlus class="w-4 h-4 shrink-0"></svg>
          Catat transaksi
        </button>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  @Input() title = 'Home';
  private themeService = inject(SwithTheme);
  private router = inject(Router);

  animating = signal(false);

  get isDark() { return this.themeService.isDark; }

  toggleTheme() {
    if (this.animating()) return;
    this.animating.set(true);
    setTimeout(() => this.themeService.toggleTheme(), 182); // swap icon at 38% mark (invisible)
    setTimeout(() => this.animating.set(false), 500);
  }

  goToAdd() { this.router.navigate(['/transaction/add']); }
}
