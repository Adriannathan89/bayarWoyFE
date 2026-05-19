import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  LucideArrowUp, LucideArrowDown, LucideArrowRight,
  LucideWallet, LucideUsers, LucideReceipt,
  LucideZap, LucideChevronDown,
} from '@lucide/angular';
import { UserRecordsService } from '../../core/service/user/user-records.service';
import { UserRecord, Record } from '../../core/model/record.model';
import { SparkLineComponent } from '../../shared/ui/spark-line.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, SparkLineComponent,
    LucideArrowUp, LucideArrowDown, LucideArrowRight,
    LucideWallet, LucideUsers, LucideReceipt,
    LucideZap, LucideChevronDown,
  ],
  styles: [`
    :host { display: block; }

    .hero-card {
      background: var(--bw-ink);
      color: var(--bw-on-ink);
      border-radius: var(--bw-r-lg);
      padding: 28px;
      position: relative;
      overflow: hidden;
    }
    .stat-card {
      background: var(--bw-surface);
      border: 1px solid var(--bw-border);
      border-radius: var(--bw-r-md);
      padding: 16px;
    }
    .bw-card {
      background: var(--bw-surface);
      border: 1px solid var(--bw-border);
      border-radius: var(--bw-r-lg);
    }
    .chip {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 10px; border-radius: 999px;
      font-size: 12px; font-weight: 600; line-height: 1;
    }
    .chip-lime-dark { background: rgba(181,230,14,0.18); color: var(--bw-lime); }
    .chip-ghost-dark { background: rgba(245,244,239,0.08); color: rgba(245,244,239,0.6); }
    .icon-box {
      width: 36px; height: 36px; border-radius: 10px;
      background: var(--bw-sunken);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .quick-tile {
      padding: 14px; border-radius: 12px;
      border: 1px solid var(--bw-border);
      background: var(--bw-surface);
      display: flex; flex-direction: column; gap: 8px;
      cursor: pointer; transition: transform 0.1s ease, background 0.15s;
    }
    .quick-tile:hover { transform: scale(0.98); }
    .quick-tile:active { transform: scale(0.96); }
    .friend-debt-row { border-top: 1px solid var(--bw-border); }
    .tx-row { border-top: 1px solid var(--bw-border); }

    @keyframes countUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-count { animation: countUp 0.6s ease both; }
  `],
  template: `
    <!-- ── Desktop layout ──────────────────────────────────── -->
    <div class="hidden md:grid p-8 gap-6" style="grid-template-columns: 1fr 380px; grid-template-rows: auto;">

      <!-- ─ Left column ─ -->
      <div class="flex flex-col gap-5 min-w-0">

        <!-- Net Balance Hero -->
        <div class="hero-card animate-fade-slide-up">
          <div class="flex justify-between items-start">
            <div>
              <div class="text-[12px] font-semibold tracking-[0.1em] uppercase" style="color:rgba(245,244,239,0.5)">Saldo Bersih</div>
              <div class="mono animate-count" style="font-size:clamp(40px,5vw,64px); font-weight:700; line-height:1.05; margin-top:8px; letter-spacing:-0.04em;">
                Rp <span style="color:var(--bw-lime)">{{ formatRupiah(records()?.balance ?? 0) }}</span>
              </div>
              <div class="flex gap-2 mt-3 flex-wrap">
                <span class="chip chip-lime-dark">
                  <svg lucideArrowUp class="w-3 h-3"></svg>
                  {{ monthlyTrendLabel() }}
                </span>
                <span class="chip chip-ghost-dark">
                  Tunai Rp {{ formatRupiah(records()?.cash ?? 0) }}
                </span>
              </div>
            </div>
            <button class="flex items-center gap-1 text-[13px] font-medium px-3 py-2 rounded-[10px] cursor-pointer"
                    style="background:rgba(245,244,239,0.08);color:var(--bw-on-ink)">
              {{ currentMonth }} <svg lucideChevronDown class="w-3.5 h-3.5"></svg>
            </button>
          </div>
          <div style="margin: 20px -12px -28px;">
            <app-spark-line [data]="sparkData()" [height]="90" [width]="760" color="#b5e60e"></app-spark-line>
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
            <div class="mono text-[24px] font-bold text-bw-ink">{{ formatRupiah(records()?.cash ?? 0) }}</div>
            <div class="text-[11px] text-bw-ink-3 mt-1">dari {{ totalIncomeCount() }} pemasukan</div>
          </div>

          <!-- Piutang -->
          <div class="stat-card animate-fade-slide-up" style="animation-delay:100ms">
            <div class="flex justify-between items-start mb-2">
              <div class="text-[12px] font-semibold tracking-[0.08em] uppercase text-bw-ink-3">Piutang</div>
              <span class="icon-box" style="background:var(--bw-lime-soft)">
                <svg lucideArrowDown class="w-[15px] h-[15px]" style="color:var(--bw-lime-ink);stroke-width:2"></svg>
              </span>
            </div>
            <div class="mono text-[24px] font-bold text-bw-ink">{{ formatRupiah(records()?.receivable ?? 0) }}</div>
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
            <div class="mono text-[24px] font-bold text-bw-ink">{{ formatRupiah(records()?.debt ?? 0) }}</div>
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

          @if (recentTx().length === 0) {
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
            @for (tx of recentTx(); track tx.id; let i = $index) {
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
        @if (debtors().length > 0) {
          <div class="bw-card p-5 animate-fade-slide-up" style="animation-delay:130ms">
            <h3 class="text-[15px] font-bold text-bw-ink m-0 mb-1">Yang masih ngutang</h3>
            @for (d of debtors(); track d.id; let i = $index) {
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

    <!-- ── Mobile layout ──────────────────────────────────── -->
    <div class="flex flex-col gap-4 md:hidden px-5 pb-6 pt-2">

      <!-- Net Balance Hero (mobile) -->
      <div class="hero-card animate-fade-slide-up">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-[12px] font-semibold tracking-[0.1em] uppercase" style="color:rgba(245,244,239,0.5)">Saldo Bersih</div>
            <div class="mono animate-count" style="font-size:42px;font-weight:700;line-height:1.05;margin-top:6px;letter-spacing:-0.04em">
              Rp <span style="color:var(--bw-lime)">{{ formatRupiah(records()?.balance ?? 0) }}</span>
            </div>
            <div class="flex gap-2 mt-2">
              <span class="chip chip-lime-dark">
                <svg lucideArrowUp class="w-3 h-3"></svg>
                {{ monthlyTrendLabel() }}
              </span>
            </div>
          </div>
        </div>
        <div style="margin:16px -12px -28px">
          <app-spark-line [data]="sparkData()" [height]="60" [width]="360" color="#b5e60e"></app-spark-line>
        </div>
      </div>

      <!-- Stat strip (mobile) -->
      <div class="grid grid-cols-3 gap-2">
        <div class="stat-card">
          <div class="text-[11px] font-semibold tracking-wider uppercase text-bw-ink-3 mb-1">Tunai</div>
          <div class="mono text-[16px] font-bold text-bw-ink leading-tight">{{ formatRupiahShort(records()?.cash ?? 0) }}</div>
        </div>
        <div class="stat-card">
          <div class="text-[11px] font-semibold tracking-wider uppercase text-bw-ink-3 mb-1">Piutang</div>
          <div class="mono text-[16px] font-bold text-bw-ink leading-tight">{{ formatRupiahShort(records()?.receivable ?? 0) }}</div>
        </div>
        <div class="stat-card">
          <div class="text-[11px] font-semibold tracking-wider uppercase text-bw-ink-3 mb-1">Hutang</div>
          <div class="mono text-[16px] font-bold text-bw-ink leading-tight">{{ formatRupiahShort(records()?.debt ?? 0) }}</div>
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
        @for (tx of recentTx(); track tx.id; let i = $index) {
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
        @if (recentTx().length === 0) {
          <div class="text-center py-6 text-bw-ink-3 text-[13px]">Belum ada transaksi</div>
        }
      </div>

    </div>
  `,
})
export class DashboardPage implements OnInit {
  private recordsService = inject(UserRecordsService);
  private router = inject(Router);

  records = signal<UserRecord | null>(null);
  loading = signal(true);

  readonly currentMonth = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date());

  async ngOnInit() {
    try {
      const data = await this.recordsService.getRecords();
      this.records.set(data);
    } catch {
      // keep null state
    } finally {
      this.loading.set(false);
    }
  }

  recentTx() {
    const r = this.records();
    if (!r) return [];
    const all: Record[] = [...r.expenses, ...r.incomes, ...r.debts];
    return all
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  debtors() {
    return (this.records()?.debts ?? []).slice(0, 3);
  }

  sparkData(): number[] {
    const r = this.records();
    if (!r) return [0, 0, 0, 0, 0, 0, 0];
    // Build 7-point monthly trend from all records (last 7 months)
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
      const ym = d.getFullYear() * 100 + d.getMonth();
      const inc = r.incomes.filter(x => {
        const rd = new Date(x.createdAt);
        return rd.getFullYear() * 100 + rd.getMonth() === ym;
      }).reduce((s, x) => s + x.amount, 0);
      const exp = r.expenses.filter(x => {
        const rd = new Date(x.createdAt);
        return rd.getFullYear() * 100 + rd.getMonth() === ym;
      }).reduce((s, x) => s + x.amount, 0);
      return Math.max(0, inc - exp) / 1_000_000;
    });
  }

  monthlyTrendLabel(): string {
    const data = this.sparkData();
    if (data.length < 2) return '+0%';
    const prev = data[data.length - 2];
    const curr = data[data.length - 1];
    if (prev === 0) return curr > 0 ? '+100%' : '0%';
    const pct = ((curr - prev) / prev * 100).toFixed(1);
    return `${Number(pct) >= 0 ? '+' : ''}${pct}% bulan ini`;
  }

  totalIncomeCount(): number {
    return this.records()?.incomes.length ?? 0;
  }

  formatRupiah(n: number): string {
    return new Intl.NumberFormat('id-ID').format(n);
  }

  formatRupiahShort(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'jt';
    if (n >= 1_000) return (n / 1_000).toFixed(0) + 'rb';
    return String(n);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diff === 0) return 'Hari ini · ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    if (diff === 1) return 'Kemarin · ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(d);
  }

  goToTransactions() { this.router.navigate(['/transaction']); }
  goToAdd() { this.router.navigate(['/transaction/add']); }
  goToAddType(type: string) { this.router.navigate(['/transaction/add'], { queryParams: { type } }); }
  goToFriends() { this.router.navigate(['/friends']); }
}
