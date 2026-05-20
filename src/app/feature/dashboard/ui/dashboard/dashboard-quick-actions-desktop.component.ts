import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideArrowDown, LucideArrowUp, LucideUsers, LucideReceipt } from '@lucide/angular';

@Component({
  selector: 'app-dashboard-quick-actions-desktop',
  standalone: true,
  imports: [CommonModule, LucideArrowDown, LucideArrowUp, LucideUsers, LucideReceipt],
  styleUrls: ['./dashboard-ui.styles.css'],
  template: `
    <div class="bw-card p-5 animate-fade-slide-up" style="animation-delay:80ms">
      <h3 class="text-[15px] font-bold text-bw-ink m-0 mb-3.5">Aksi cepat</h3>
      <div class="grid grid-cols-2 gap-2">
        <button (click)="goToAddType('income')" class="quick-tile">
          <div class="icon-box" style="background:var(--bw-green-soft)">
            <svg lucideArrowDown class="w-[18px] h-[18px]" style="color:var(--bw-green);stroke-width:2.2"></svg>
          </div>
          <span class="text-[13px] font-semibold text-bw-ink leading-snug">Pemasukan</span>
        </button>
        <button (click)="goToAddType('expense')" class="quick-tile">
          <div class="icon-box" style="background:var(--bw-red-soft)">
            <svg lucideArrowUp class="w-[18px] h-[18px]" style="color:var(--bw-red);stroke-width:2.2"></svg>
          </div>
          <span class="text-[13px] font-semibold text-bw-ink leading-snug">Pengeluaran</span>
        </button>
        <button (click)="goToFriends()" class="quick-tile">
          <div class="icon-box" style="background:var(--bw-lime-soft)">
            <svg lucideUsers class="w-[18px] h-[18px]" style="color:var(--bw-lime-ink);stroke-width:2.2"></svg>
          </div>
          <span class="text-[13px] font-semibold text-bw-ink leading-snug">Tagih teman</span>
        </button>
        <button (click)="goToAddType('debt')" class="quick-tile">
          <div class="icon-box" style="background:var(--bw-sunken)">
            <svg lucideReceipt class="w-[18px] h-[18px]" style="color:var(--bw-ink-2);stroke-width:2.2"></svg>
          </div>
          <span class="text-[13px] font-semibold text-bw-ink leading-snug">Split bill</span>
        </button>
      </div>
    </div>
  `,
})
export class DashboardQuickActionsDesktopComponent {
  @Input({ required: true }) goToAddType!: (type: string) => void;
  @Input({ required: true }) goToFriends!: () => void;
}
