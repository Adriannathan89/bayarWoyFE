import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './sidebar.component';
import { TopbarComponent } from './topbar.component';
import { BottomNavComponent } from './bottom-nav.component';
import { LucideBell, LucideSun, LucideMoon } from '@lucide/angular';
import { SwithTheme } from '../core/service/styles/switch-theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, BottomNavComponent, LucideBell, LucideSun, LucideMoon],
  styles: [`
    .theme-btn-m {
      position: relative; overflow: hidden;
      width: 40px; height: 40px; border-radius: 12px;
      border: 1px solid var(--bw-border); background: var(--bw-surface);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--bw-ink-2); flex-shrink: 0;
    }
    .theme-btn-m:hover { background: var(--bw-sunken); }
    .ripple-m {
      position: absolute; inset: 0; border-radius: inherit;
      background: var(--bw-lime); opacity: 0; pointer-events: none;
    }
    .theme-btn-m.toggling .ripple-m { animation: btn-ripple-m 0.48s ease-out forwards; }
    .icon-m { display: flex; align-items: center; justify-content: center; }
    .icon-m.spinning { animation: icon-morph-m 0.48s cubic-bezier(0.4, 0, 0.2, 1) forwards; }

    @keyframes icon-morph-m {
      0%   { transform: scale(1) rotate(0deg);    opacity: 1; }
      38%  { transform: scale(0) rotate(-210deg); opacity: 0; }
      62%  { transform: scale(0) rotate(210deg);  opacity: 0; }
      100% { transform: scale(1) rotate(0deg);    opacity: 1; }
    }
    @keyframes btn-ripple-m {
      0%   { opacity: 0.22; transform: scale(0.5); }
      55%  { opacity: 0.10; transform: scale(1.3); }
      100% { opacity: 0;    transform: scale(1); }
    }
  `],
  template: `
    <div class="flex h-screen overflow-hidden bg-bw-bg">

      <!-- Desktop sidebar -->
      <app-sidebar class="hidden md:flex"></app-sidebar>

      <!-- Main area -->
      <div class="flex flex-col flex-1 min-w-0 overflow-hidden">

        <!-- Desktop topbar -->
        <app-topbar [title]="pageTitle()"></app-topbar>

        <!-- Mobile header -->
        <header class="flex md:hidden items-center justify-between px-5 pt-4 pb-3 bg-bw-bg shrink-0">
          <div>
            <div class="text-[12px] font-semibold text-bw-ink-3 tracking-[0.04em]">
              {{ todayLabel }}
            </div>
            <h1 class="text-[22px] font-extrabold tracking-[-0.03em] text-bw-ink mt-0.5 leading-none">
              {{ pageTitle() }}
            </h1>
          </div>
          <div class="flex items-center gap-2">
            <button class="theme-btn-m" [class.toggling]="mAnimating()" (click)="toggleThemeMobile()"
                    [attr.title]="isDark ? 'Mode terang' : 'Mode gelap'">
              <span class="ripple-m"></span>
              <span class="icon-m" [class.spinning]="mAnimating()">
                @if (isDark) {
                  <svg lucideSun class="w-5 h-5"></svg>
                } @else {
                  <svg lucideMoon class="w-5 h-5"></svg>
                }
              </span>
            </button>
            <button class="w-10 h-10 rounded-[12px] flex items-center justify-center border border-bw-border bg-bw-surface text-bw-ink-2 cursor-pointer">
              <svg lucideBell class="w-5 h-5"></svg>
            </button>
          </div>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-y-auto overflow-x-hidden pb-[76px] md:pb-0">
          <router-outlet></router-outlet>
        </main>

        <!-- Mobile bottom nav -->
        <app-bottom-nav></app-bottom-nav>

      </div>
    </div>
  `,
})
export class MainLayoutComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private themeService = inject(SwithTheme);

  pageTitle = signal('Home');
  mAnimating = signal(false);

  get isDark() { return this.themeService.isDark; }

  toggleThemeMobile() {
    if (this.mAnimating()) return;
    this.mAnimating.set(true);
    setTimeout(() => this.themeService.toggleTheme(), 182);
    setTimeout(() => this.mAnimating.set(false), 500);
  }

  readonly todayLabel = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date());

  ngOnInit() {
    this.updateTitle();
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.updateTitle());
  }

  private updateTitle() {
    const url = this.router.url;
    if (url.includes('dashboard')) this.pageTitle.set('Home');
    else if (url.includes('transaction/add')) this.pageTitle.set('Catat Transaksi');
    else if (url.includes('transaction')) this.pageTitle.set('Transaksi');
    else if (url.includes('friends')) this.pageTitle.set('Teman');
    else this.pageTitle.set('BayarWoy');
  }
}
