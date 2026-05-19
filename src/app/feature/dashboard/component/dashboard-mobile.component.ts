import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideArrowUp,
  LucideArrowDown,
  LucideArrowRight,
  LucideUsers,
  LucideReceipt,
} from '@lucide/angular';
import { SparkLineComponent } from '../../../shared/ui/spark-line.component';
import { Record, UserRecord } from '../../../core/model/record.model';

@Component({
  selector: 'app-dashboard-mobile',
  standalone: true,
  imports: [
    CommonModule,
    SparkLineComponent,
    LucideArrowUp,
    LucideArrowDown,
    LucideArrowRight,
    LucideUsers,
    LucideReceipt,
  ],
  styleUrls: ['../dashboard.styles.css'],
  template: `
    <div class="flex flex-col gap-4 md:hidden px-5 pb-6 pt-2">

      <!-- Net Balance Hero (mobile) -->
      <div class="hero-card animate-fade-slide-up">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-[12px] font-semibold tracking-[0.1em] uppercase" style="color:var(--hero-dim)">Saldo Bersih</div>
            <div class="mono animate-count" style="font-size:42px;font-weight:700;line-height:1.05;margin-top:6px;letter-spacing:-0.04em">
              Rp <span style="color:var(--bw-lime)">{{ formatRupiah(records?.balance ?? 0) }}</span>
            </div>
            <div class="flex gap-2 mt-2">
              <span class="chip chip-lime-dark">
                <svg lucideArrowUp class="w-3 h-3"></svg>
                {{ monthlyTrendLabel }}
              </span>
            </div>
          </div>
        </div>
        <div style="margin:16px -12px -28px">
          <app-spark-line [data]="sparkData" [height]="60" [width]="360"></app-spark-line>
        </div>
      </div>

      <!-- Stat strip (mobile) -->
      <div class="grid grid-cols-3 gap-2">
        <div class="stat-card">
          <div class="text-[11px] font-semibold tracking-wider uppercase text-bw-ink-3 mb-1">Tunai</div>
          <div class="mono text-[16px] font-bold text-bw-ink leading-tight">{{ formatRupiahShort(records?.cash ?? 0) }}</div>
        </div>
        <div class="stat-card">
          <div class="text-[11px] font-semibold tracking-wider uppercase text-bw-ink-3 mb-1">Piutang</div>
          <div class="mono text-[16px] font-bold text-bw-ink leading-tight">{{ formatRupiahShort(records?.receivable ?? 0) }}</div>
        </div>
        <div class="stat-card">
          <div class="text-[11px] font-semibold tracking-wider uppercase text-bw-ink-3 mb-1">Hutang</div>
          <div class="mono text-[16px] font-bold text-bw-ink leading-tight">{{ formatRupiahShort(records?.debt ?? 0) }}</div>
        </div>
      </div>

      <!-- Quick actions (mobile, 4-col) -->
      <div class="grid grid-cols-4 gap-2">
        <button (click)="goToAddType('income')" class="quick-tile items-center text-center">
          <div class="icon-box mx-auto" style="background:var(--bw-green-soft)">
            <svg lucideArrowDown class="w-4 h-4" style="color:var(--bw-green);stroke-width:2.2"></svg>
          </div>
          <span class="text-[11px] font-semibold text-bw-ink-2">Masuk</span>
        </button>
        <button (click)="goToAddType('expense')" class="quick-tile items-center text-center">
          <div class="icon-box mx-auto" style="background:var(--bw-red-soft)">
            <svg lucideArrowUp class="w-4 h-4" style="color:var(--bw-red);stroke-width:2.2"></svg>
          </div>
          <span class="text-[11px] font-semibold text-bw-ink-2">Keluar</span>
        </button>
        <button (click)="goToFriends()" class="quick-tile items-center text-center">
          <div class="icon-box mx-auto" style="background:var(--bw-lime-soft)">
            <svg lucideUsers class="w-4 h-4" style="color:var(--bw-lime-ink);stroke-width:2.2"></svg>
          </div>
          <span class="text-[11px] font-semibold text-bw-ink-2">Tagih</span>
        </button>
        <button (click)="goToAddType('debt')" class="quick-tile items-center text-center">
          <div class="icon-box mx-auto">
            <svg lucideReceipt class="w-4 h-4" style="color:var(--bw-ink-2);stroke-width:2.2"></svg>
          </div>
          <span class="text-[11px] font-semibold text-bw-ink-2">Split</span>
        </button>
      </div>

      <!-- Recent transactions (mobile) -->
      <div class="bw-card p-4">
        <div class="flex justify-between items-center mb-2.5">
          <h3 class="text-[15px] font-bold text-bw-ink m-0">Transaksi terakhir</h3>
          <button (click)="goToTransactions()" class="text-[12px] font-semibold text-bw-ink-2 cursor-pointer flex items-center gap-1">
            Semua <svg lucideArrowRight class="w-3 h-3"></svg>
          </button>
        </div>
        @for (tx of recentTx; track tx.id; let i = $index) {
          <div class="flex items-center gap-3 py-2" [class.tx-row]="i > 0">
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
              <div class="text-[11px] text-bw-ink-3">{{ formatDate(tx.createdAt) }}</div>
            </div>
            <div class="mono text-[13px] font-semibold shrink-0"
                 [style.color]="tx.type === 'expense' ? 'var(--bw-red)' : 'var(--bw-green)'">
              {{ tx.type === 'expense' ? '−' : '+' }}{{ formatRupiahShort(tx.amount) }}
            </div>
          </div>
        }
        @if (recentTx.length === 0) {
          <div class="text-center py-6 text-bw-ink-3 text-[13px]">Belum ada transaksi</div>
        }
      </div>

    </div>
  `,
})
export class DashboardMobileComponent {
  @Input({ required: true }) records: UserRecord | null = null;
  @Input({ required: true }) sparkData!: number[];
  @Input({ required: true }) monthlyTrendLabel!: string;
  @Input({ required: true }) recentTx: Record[] = [];
  @Input({ required: true }) formatRupiah!: (n: number) => string;
  @Input({ required: true }) formatRupiahShort!: (n: number) => string;
  @Input({ required: true }) formatDate!: (dateStr: string) => string;
  @Input({ required: true }) goToTransactions!: () => void;
  @Input({ required: true }) goToAddType!: (type: string) => void;
  @Input({ required: true }) goToFriends!: () => void;
}
