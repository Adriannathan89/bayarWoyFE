import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LucideHouse, LucideReceipt, LucideUsers, LucideLogOut } from '@lucide/angular';
import { UserAuthService } from '../core/service/user/user-auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink, RouterLinkActive,
    LucideHouse, LucideReceipt, LucideUsers, LucideLogOut,
  ],
  styles: [`
    .bw-logo-mark {
      width: 28px; height: 28px; border-radius: 8px;
      background: var(--bw-ink); color: var(--bw-lime);
      display: inline-flex; align-items: center; justify-content: center;
      font-family: var(--bw-font-mono); font-weight: 700; font-size: 16px;
      position: relative; flex-shrink: 0;
    }
    .bw-logo-mark::after {
      content: ""; position: absolute; right: -3px; bottom: -3px;
      width: 10px; height: 10px; border-radius: 50%;
      background: var(--bw-lime); border: 2px solid var(--bw-bg);
    }
    .nav-item { transition: background 150ms ease, color 150ms ease; }
    .nav-item:hover:not(.active) { background: var(--bw-sunken); }
  `],
  template: `
    <aside class="w-[240px] h-full bg-bw-surface border-r border-bw-border flex flex-col shrink-0">

      <!-- Logo -->
      <div class="flex items-center gap-2.5 px-5 py-6 pb-7">
        <span class="bw-logo-mark">b</span>
        <span class="text-[18px] font-extrabold tracking-[-0.04em] text-bw-ink">
          bayar<span class="text-bw-ink-3">woy</span>
        </span>
      </div>

      <!-- Nav -->
      <nav class="flex flex-col gap-1 px-3 flex-1">
        <a [routerLink]="'/dashboard'" routerLinkActive #home="routerLinkActive"
          class="nav-item flex items-center gap-3 px-3 py-[11px] rounded-[12px] text-[14px] font-semibold cursor-pointer no-underline"
          [style.background]="home.isActive ? 'var(--bw-ink)' : ''"
          [style.color]="home.isActive ? 'var(--bw-on-ink)' : 'var(--bw-ink-2)'"
          [class.active]="home.isActive">
          <svg lucideHouse class="w-[18px] h-[18px] shrink-0"
               [style.strokeWidth]="home.isActive ? '2' : '1.8'"></svg>
          Home
        </a>

        <a [routerLink]="'/transaction'" routerLinkActive #tx="routerLinkActive"
          class="nav-item flex items-center gap-3 px-3 py-[11px] rounded-[12px] text-[14px] font-semibold cursor-pointer no-underline"
          [style.background]="tx.isActive ? 'var(--bw-ink)' : ''"
          [style.color]="tx.isActive ? 'var(--bw-on-ink)' : 'var(--bw-ink-2)'"
          [class.active]="tx.isActive">
          <svg lucideReceipt class="w-[18px] h-[18px] shrink-0"
               [style.strokeWidth]="tx.isActive ? '2' : '1.8'"></svg>
          Transaksi
        </a>

        <a [routerLink]="'/friends'" routerLinkActive #friends="routerLinkActive"
          class="nav-item flex items-center gap-3 px-3 py-[11px] rounded-[12px] text-[14px] font-semibold cursor-pointer no-underline"
          [style.background]="friends.isActive ? 'var(--bw-ink)' : ''"
          [style.color]="friends.isActive ? 'var(--bw-on-ink)' : 'var(--bw-ink-2)'"
          [class.active]="friends.isActive">
          <svg lucideUsers class="w-[18px] h-[18px] shrink-0"
               [style.strokeWidth]="friends.isActive ? '2' : '1.8'"></svg>
          Teman
        </a>
      </nav>

      <!-- Bottom -->
      <div class="p-3 border-t border-bw-border">
        <div class="flex items-center gap-2.5 p-2 rounded-[10px] bg-bw-elevated">
          <span class="w-9 h-9 rounded-full bg-bw-lime text-bw-ink flex items-center justify-center text-[13px] font-bold shrink-0 select-none">
            {{ userInitials() }}
          </span>
          <div class="flex-1 min-w-0">
            <div class="text-[13px] font-bold text-bw-ink truncate">{{ username() }}</div>
            <button
              (click)="logout()"
              class="flex items-center gap-1 text-[11px] text-bw-ink-3 hover:text-bw-red transition-colors cursor-pointer mt-0.5"
            >
              <svg lucideLogOut class="w-3 h-3 shrink-0"></svg>
              Keluar
            </button>
          </div>
        </div>
      </div>
    </aside>
  `,
})
export class SidebarComponent implements OnInit {
  private authService = inject(UserAuthService);
  private router = inject(Router);

  username = signal('');
  userInitials = signal('?');

  ngOnInit() {
    this.refreshUser();
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.refreshUser());
  }

  private refreshUser() {
    const u = localStorage.getItem('username') ?? '';
    this.username.set(u);
    this.userInitials.set(u ? u.slice(0, 2).toUpperCase() : '?');
  }

  async logout() {
    await this.authService.logout();
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}