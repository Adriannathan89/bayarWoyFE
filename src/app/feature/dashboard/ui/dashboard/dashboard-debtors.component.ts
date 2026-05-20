import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Record } from '../../../../core/model/record.model';

@Component({
  selector: 'app-dashboard-debtors',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./dashboard-ui.styles.css'],
  template: `
    @if (debtors.length > 0) {
      <div class="bw-card p-5 animate-fade-slide-up" style="animation-delay:130ms">
        <h3 class="text-[15px] font-bold text-bw-ink m-0 mb-1">Yang masih ngutang</h3>
        @for (d of debtors; track d.id; let i = $index) {
          <div class="flex items-center gap-3 py-2.5" [class.friend-debt-row]="i > 0">
            <span class="w-9 h-9 rounded-full bg-bw-sunken text-bw-ink flex items-center justify-center text-[13px] font-bold shrink-0">
              {{ d.title.slice(0,1).toUpperCase() }}
            </span>
            <div class="flex-1 min-w-0">
              <div class="text-[14px] font-semibold text-bw-ink truncate">{{ d.title }}</div>
              <div class="text-[12px] text-bw-ink-3">{{ formatDate(d.createdAt) }}</div>
            </div>
            <div class="text-right shrink-0">
              <div class="mono text-[13px] font-bold text-bw-ink">Rp {{ formatRupiah(d.amount) }}</div>
              <button class="text-[11px] font-semibold mt-1 px-2 py-0.5 rounded-[6px] cursor-pointer"
                      style="background:var(--bw-lime);color:var(--bw-ink)">
                Tagih woy
              </button>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class DashboardDebtorsComponent {
  @Input({ required: true }) debtors: Record[] = [];
  @Input({ required: true }) formatDate!: (dateStr: string) => string;
  @Input({ required: true }) formatRupiah!: (n: number) => string;
}
