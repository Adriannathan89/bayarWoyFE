import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideArrowUp,
  LucideArrowDown,
  LucideArrowRight,
  LucideWallet,
  LucideUsers,
  LucideReceipt,
  LucideZap,
  LucideChevronDown,
} from '@lucide/angular';
import { SparkLineComponent } from '../../../shared/ui/spark-line.component';
import { Record, UserRecord } from '../../../core/model/record.model';

@Component({
  selector: 'app-dashboard-desktop',
  standalone: true,
  imports: [
    CommonModule,
    SparkLineComponent,
    LucideArrowUp,
    LucideArrowDown,
    LucideArrowRight,
    LucideWallet,
    LucideUsers,
    LucideReceipt,
    LucideZap,
    LucideChevronDown,
  ],
  styleUrls: ['../dashboard.styles.css'],
  template: `
    <div class="hidden md:grid p-8 gap-6" style="grid-template-columns: 1fr 380px; grid-template-rows: auto;">

      <!-- ─ Left column ─ -->
      <div class="flex flex-col gap-5 min-w-0">

        <!-- Net Balance Hero -->
        <div class="hero-card animate-fade-slide-up">
          <div class="flex justify-between items-start">
            <div>
              <div class="text-[12px] font-semibold tracking-[0.1em] uppercase" style="color:var(--hero-dim)">Saldo Bersih</div>
              <div class="mono animate-count" style="font-size:clamp(40px,5vw,64px); font-weight:700; line-height:1.05; margin-top:8px; letter-spacing:-0.04em;">
                Rp <span style="color:var(--bw-lime)">{{ formatRupiah(records?.balance ?? 0) }}</span>
              </div>
              <div class="flex gap-2 mt-3 flex-wrap">
                <span class="chip chip-lime-dark">
                  <svg lucideArrowUp class="w-3 h-3"></svg>
                  {{ monthlyTrendLabel }}
                </span>
                <span class="chip chip-ghost-dark">
                  Tunai Rp {{ formatRupiah(records?.cash ?? 0) }}
                </span>
              </div>
            </div>
            <button class="flex items-center gap-1 text-[13px] font-medium px-3 py-2 rounded-[10px] cursor-pointer"
                    style="background:var(--hero-ghost);color:var(--hero-fg)">
              {{ currentMonth }} <svg lucideChevronDown class="w-3.5 h-3.5"></svg>
            </button>
          </div>
          <div style="margin: 20px -12px -28px;">
            <app-spark-line [data]="sparkData" [height]="90" [width]="760"></app-spark-line>
          </div>
        </div>

        <!-- Stat row -->
        <div class="grid gap-3" style="grid-template-columns: repeat(3,1fr)">
          <!-- Tunai -->
          <div class="stat-card animate-fade-slide-up" style="animation-delay:50ms">
            <div class="flex justify-between items-start mb-2">
              <div class="text-[12px] font-semibold tracking-[0.08em] uppercase text-bw-ink-3">Tunai</div>
              <span class="icon-box" style="background:var(--bw-green-soft)">
                <svg lucideWallet class="w-[15px] h-[15px]" style="color:var(--bw-green);stroke-width:2"></svg>
              </span>
            </div>
            <div class="mono text-[24px] font-bold text-bw-ink">{{ formatRupiah(records?.cash ?? 0) }}</div>
            <div class="text-[11px] text-bw-ink-3 mt-1">dari {{ totalIncomeCount }} pemasukan</div>
          </div>

          <!-- Piutang -->
          <div class="stat-card animate-fade-slide-up" style="animation-delay:100ms">
            <div class="flex justify-between items-start mb-2">
              <div class="text-[12px] font-semibold tracking-[0.08em] uppercase text-bw-ink-3">Piutang</div>
              <span class="icon-box" style="background:var(--bw-lime-soft)">
                <svg lucideArrowDown class="w-[15px] h-[15px]" style="color:var(--bw-lime-ink);stroke-width:2"></svg>
              </span>
            </div>
            <div class="mono text-[24px] font-bold text-bw-ink">{{ formatRupiah(records?.receivable ?? 0) }}</div>
            <div class="text-[11px] text-bw-ink-3 mt-1">dari teman-teman</div>
          </div>

          <!-- Hutang -->
          <div class="stat-card animate-fade-slide-up" style="animation-delay:150ms">
            <div class="flex justify-between items-start mb-2">
              <div class="text-[12px] font-semibold tracking-[0.08em] uppercase text-bw-ink-3">Hutang</div>
              <span class="icon-box" style="background:var(--bw-amber-soft)">
                <svg lucideArrowUp class="w-[15px] h-[15px]" style="color:var(--bw-amber);stroke-width:2"></svg>
              </span>
            </div>
            <div class="mono text-[24px] font-bold text-bw-ink">{{ formatRupiah(records?.debt ?? 0) }}</div>
            <div class="text-[11px] text-bw-ink-3 mt-1">perlu dilunasi</div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="bw-card p-5 animate-fade-slide-up" style="animation-delay:200ms">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-[15px] font-bold text-bw-ink m-0">Transaksi terakhir</h3>
            <button (click)="goToTransactions()"
              class="text-[13px] font-semibold text-bw-ink-2 hover:text-bw-ink transition-colors cursor-pointer flex items-center gap-1">
              Lihat semua <svg lucideArrowRight class="w-3.5 h-3.5"></svg>
            </button>
          </div>

          @if (recentTx.length === 0) {
            <div class="flex flex-col items-center py-10 text-center">
              <svg lucideReceipt class="w-10 h-10 text-bw-ink-4 mb-3" style="stroke-width:1.5"></svg>
              <div class="text-[14px] font-semibold text-bw-ink-2">Belum ada transaksi</div>
              <div class="text-[13px] text-bw-ink-3 mt-1 mb-4">Yuk catat yang pertama →</div>
              <button (click)="goToAdd()"
                class="px-4 py-2 rounded-[10px] bg-bw-ink text-bw-on-ink text-[13px] font-semibold cursor-pointer">
                Catat sekarang
              </button>
            </div>
          } @else {
            @for (tx of recentTx; track tx.id; let i = $index) {
              <div class="flex items-center gap-3.5 py-2.5" [class.tx-row]="i > 0">
                <div class="icon-box">
                  @if (tx.type === 'expense') {
                    <svg lucideArrowUp class="w-[18px] h-[18px]" style="color:var(--bw-red);stroke-width:1.8"></svg>
                  } @else if (tx.type === 'income') {
                    <svg lucideArrowDown class="w-[18px] h-[18px]" style="color:var(--bw-green);stroke-width:1.8"></svg>
                  } @else {
                    <svg lucideUsers class="w-[18px] h-[18px]" style="color:var(--bw-amber);stroke-width:1.8"></svg>
                  }
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-[14px] font-semibold text-bw-ink truncate">{{ tx.title }}</div>
                  <div class="text-[12px] text-bw-ink-3 mt-0.5">{{ formatDate(tx.createdAt) }}</div>
                </div>
                <div class="mono text-[14px] font-semibold shrink-0"
                     [style.color]="tx.type === 'expense' ? 'var(--bw-red)' : 'var(--bw-green)'">
                  {{ tx.type === 'expense' ? '−' : '+' }}Rp {{ formatRupiah(tx.amount) }}
                </div>
              </div>
            }
          }
        </div>

      </div>

      <!-- ─ Right sidebar ─ -->
      <div class="flex flex-col gap-5">

        <!-- Quick actions -->
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

        <!-- Yang masih ngutang -->
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

        <!-- Tips card -->
        <div class="bw-card p-4 animate-fade-slide-up" style="animation-delay:180ms; background:var(--bw-lime-soft); border-color:transparent">
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0"
                 style="background:var(--bw-ink)">
              <svg lucideZap class="w-4 h-4" style="color:var(--bw-lime);stroke-width:2.2"></svg>
            </div>
            <div>
              <div class="text-[13px] font-bold" style="color:var(--bw-lime-ink)">Tips dari BayarWoy</div>
              <div class="text-[12px] mt-1 leading-relaxed" style="color:var(--bw-lime-ink)">
                Coba rutin catat setiap hari biar kamu tau kemana perginya duit kamu tiap bulan.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
})
export class DashboardDesktopComponent {
  @Input({ required: true }) records: UserRecord | null = null;
  @Input({ required: true }) currentMonth!: string;
  @Input({ required: true }) sparkData!: number[];
  @Input({ required: true }) monthlyTrendLabel!: string;
  @Input({ required: true }) recentTx: Record[] = [];
  @Input({ required: true }) debtors: Record[] = [];
  @Input({ required: true }) totalIncomeCount!: number;
  @Input({ required: true }) formatRupiah!: (n: number) => string;
  @Input({ required: true }) formatDate!: (dateStr: string) => string;
  @Input({ required: true }) goToTransactions!: () => void;
  @Input({ required: true }) goToAdd!: () => void;
  @Input({ required: true }) goToAddType!: (type: string) => void;
  @Input({ required: true }) goToFriends!: () => void;
}
