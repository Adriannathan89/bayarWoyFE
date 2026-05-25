import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideArrowUp, LucideArrowDown, LucideUsers } from '@lucide/angular';
import { Record } from '../../../../core/model/record.model';

interface TxGroup {
  label: string;
  total: number;
  items: Record[];
}

@Component({
  selector: 'app-transaction-group-list-mobile',
  standalone: true,
  imports: [CommonModule, LucideArrowUp, LucideArrowDown, LucideUsers],
  styleUrls: ['./transaction-ui.styles.css'],
  template: `
    @for (g of groups; track g.label) {
      <div class="bw-card overflow-hidden animate-fade-slide-up">
        <div class="flex justify-between items-center px-4 py-2.5 bg-bw-elevated border-b border-bw-border">
          <span class="text-[12px] font-bold text-bw-ink">{{ g.label }}</span>
          <span class="mono text-[11px] font-semibold"
                [style.color]="g.total < 0 ? 'var(--bw-red)' : 'var(--bw-green)'">
            {{ g.total < 0 ? '−' : '+' }}Rp {{ formatRupiah(abs(g.total)) }}
          </span>
        </div>
        @for (tx of g.items; track tx.id; let i = $index) {
          <div class="flex items-center gap-3 px-4 py-3" [class.tx-row]="i > 0">
            <div class="icon-box w-8 h-8 rounded-[8px]">
              @if (tx.type === 'expense') {
                <svg lucideArrowUp class="w-4 h-4" style="color:var(--bw-red);stroke-width:1.8"></svg>
              } @else if (tx.type === 'income') {
                <svg lucideArrowDown class="w-4 h-4" style="color:var(--bw-green);stroke-width:1.8"></svg>
              } @else {
                <svg lucideUsers class="w-4 h-4" style="color:var(--bw-amber);stroke-width:1.8"></svg>
              }
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-[13px] font-semibold text-bw-ink truncate">{{ tx.title }}</div>
              <div class="flex items-center gap-1.5 mt-0.5">
                @if (tx.category) {
                  <span class="text-[9px] font-semibold px-1.5 py-[2px] rounded-full"
                        [style.background]="categoryBg(tx.category)"
                        [style.color]="categoryColor(tx.category)">
                    {{ tx.category }}
                  </span>
                }
                <span class="text-[11px] text-bw-ink-3">{{ formatTime(tx.createdAt) }}</span>
              </div>
            </div>
            <div class="mono text-[13px] font-bold shrink-0"
                 [style.color]="tx.type === 'expense' ? 'var(--bw-red)' : 'var(--bw-green)'">
              {{ tx.type === 'expense' ? '−' : '+' }}{{ formatRupiahShort(tx.amount) }}
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class TransactionGroupListMobileComponent {
  @Input() groups: TxGroup[] = [];
  @Input() formatRupiah!: (n: number) => string;
  @Input() formatRupiahShort!: (n: number) => string;
  @Input() formatTime!: (dateStr: string) => string;

  abs = (value: number) => Math.abs(value);

  private readonly _catColor: { [k: string]: [string, string] } = {
    makanan:   ['var(--bw-amber-soft)',   'var(--bw-amber)'],
    minuman:   ['var(--bw-emerald-soft)', 'var(--bw-emerald)'],
    transport: ['rgba(132,204,22,0.12)',  'var(--bw-lime)'],
    belanja:   ['var(--bw-red-soft)',     'var(--bw-red)'],
    hiburan:   ['rgba(168,85,247,0.12)',  '#a855f7'],
    tagihan:   ['var(--bw-sunken)',       'var(--bw-ink-3)'],
    kesehatan: ['var(--bw-green-soft)',   'var(--bw-green)'],
  };

  categoryBg    = (cat: string) => (this._catColor[cat] ?? ['var(--bw-sunken)', 'var(--bw-ink-3)'])[0];
  categoryColor = (cat: string) => (this._catColor[cat] ?? ['var(--bw-sunken)', 'var(--bw-ink-3)'])[1];
}
