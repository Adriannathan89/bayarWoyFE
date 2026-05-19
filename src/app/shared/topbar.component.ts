import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LucidePlus, LucideBell } from '@lucide/angular';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [LucidePlus, LucideBell],
  styles: [`:host { display: block; width: 100%; flex-shrink: 0; }`],
  template: `
    <header class="flex items-center justify-between px-8 py-5 border-b border-bw-border bg-bw-surface shrink-0">
      <div>
        <div class="text-[11px] font-semibold tracking-[0.08em] uppercase text-bw-ink-3">
          BayarWoy
        </div>
        <h1 class="text-[22px] font-bold tracking-[-0.03em] text-bw-ink mt-0.5 leading-none">
          {{ title }}
        </h1>
      </div>

      <div class="flex items-center gap-3">
        <button
          class="flex items-center justify-center w-9 h-9 rounded-[10px] border border-bw-border text-bw-ink-2 hover:bg-bw-sunken transition-colors cursor-pointer"
        >
          <svg lucideBell class="w-4 h-4"></svg>
        </button>
        <button
          (click)="goToAdd()"
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-bw-ink text-bw-on-ink text-[13px] font-semibold hover:opacity-90 transition-opacity cursor-pointer"
        >
          <svg lucidePlus class="w-4 h-4 shrink-0"></svg>
          Catat transaksi
        </button>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  @Input() title = 'Home';

  constructor(private router: Router) {}

  goToAdd() {
    this.router.navigate(['/transaction/add']);
  }
}
