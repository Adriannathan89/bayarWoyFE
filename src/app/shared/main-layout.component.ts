import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';
import { SidebarComponent } from './sidebar.component';
import { TopbarComponent } from './topbar.component';
import { BottomNavComponent } from './bottom-nav.component';
import { LucideBell } from '@lucide/angular';
import { SwithTheme } from '../core/service/styles/switch-theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, BottomNavComponent, LucideBell],
  template: `
    <div class="flex h-screen overflow-hidden bg-bw-bg">

      <!-- Desktop sidebar -->
      <app-sidebar class="hidden md:flex"></app-sidebar>

      <!-- Main area -->
      <div class="flex flex-col flex-1 min-w-0 overflow-hidden">

        <!-- Desktop topbar -->
        <app-topbar class="hidden md:block" [title]="pageTitle()"></app-topbar>

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
          <button class="w-10 h-10 rounded-[12px] flex items-center justify-center border border-bw-border bg-bw-surface text-bw-ink-2 cursor-pointer">
            <svg lucideBell class="w-5 h-5"></svg>
          </button>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-y-auto overflow-x-hidden pb-[76px] md:pb-0">
          <router-outlet></router-outlet>
        </main>

        <!-- Mobile bottom nav -->
        <app-bottom-nav class="flex md:hidden fixed bottom-0 left-0 right-0 z-50"></app-bottom-nav>

      </div>
    </div>
  `,
})
export class MainLayoutComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  pageTitle = signal('Home');

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
