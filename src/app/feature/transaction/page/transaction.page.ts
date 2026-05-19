import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  LucideSearch, LucideArrowUp, LucideArrowDown,
  LucideUsers, LucideReceipt,
} from '@lucide/angular';
import { UserRecordsService } from '../../../core/service/user/user-records.service';
import { Record, UserRecord } from '../../../core/model/record.model';
import { DecimalPipe } from '@angular/common';

type FilterType = 'all' | 'expense' | 'income' | 'debt';

interface TxGroup {
  label: string;
  date: Date;
  total: number;
  items: Record[];
}

@Component({
  standalone: true,
  imports: [
    FormsModule,
    LucideSearch, LucideArrowUp, LucideArrowDown,
    LucideUsers, LucideReceipt, DecimalPipe,
  ],
  styles: [`
    :host { display: block; }
    .bw-card { background: var(--bw-surface); border: 1px solid var(--bw-border); border-radius: var(--bw-r-lg); }
    .filter-chip {
      padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;
      border: 1px solid var(--bw-border); cursor: pointer;
      background: var(--bw-surface); color: var(--bw-ink-2);
      transition: background 0.12s, color 0.12s, border-color 0.12s;
    }
    .filter-chip.active { background: var(--bw-ink); color: var(--bw-on-ink); border-color: var(--bw-ink); }
    .tx-row { border-top: 1px solid var(--bw-border); }
    .icon-box {
      width: 36px; height: 36px; border-radius: 10px;
      background: var(--bw-sunken);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .bar-fill { height: 6px; border-radius: 999px; }
    .bw-input {
      width: 100%; font-size: 14px; padding: 11px 14px 11px 40px;
      border-radius: var(--bw-r-md); background: var(--bw-elevated);
      color: var(--bw-ink); border: 1px solid var(--bw-border);
      outline: none; transition: border-color .12s;
      font-family: inherit;
    }
    .bw-input:focus { border-color: var(--bw-ink); background: var(--bw-surface); }
    .bw-input::placeholder { color: var(--bw-ink-3); }
  `],
  template: `
    <!-- ── Desktop layout ──────────────────────────────────── -->
    <div class="hidden md:grid p-8 gap-6" style="grid-template-columns: 1fr 320px;">

      <!-- Left: list -->
      <div class="flex flex-col gap-4 min-w-0">

        <!-- Search + filters -->
        <div class="flex gap-3 items-center flex-wrap">
          <div class="relative flex-1 min-w-[240px]">
            <svg lucideSearch class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bw-ink-3" style="pointer-events:none"></svg>
            <input class="bw-input" placeholder="Cari transaksi…" [(ngModel)]="searchQuery" />
          </div>
          <div class="flex gap-1.5">
            @for (f of filters; track f.id) {
              <button class="filter-chip" [class.active]="activeFilter() === f.id" (click)="setFilter(f.id)">
                {{ f.label }}
              </button>
            }
          </div>
        </div>

        <!-- Grouped list -->
        @if (loading()) {
          <div class="flex justify-center py-16 text-bw-ink-3 text-[14px]">Memuat…</div>
        } @else if (groups().length === 0) {
          <div class="bw-card flex flex-col items-center py-16 text-center">
            <svg lucideReceipt class="w-12 h-12 text-bw-ink-4 mb-3" style="stroke-width:1.5"></svg>
            <div class="text-[15px] font-semibold text-bw-ink-2">Tidak ada transaksi</div>
            <div class="text-[13px] text-bw-ink-3 mt-1">
              {{ searchQuery ? 'Coba kata kunci lain' : 'Belum ada transaksi di kategori ini' }}
            </div>
          </div>
        } @else {
          @for (g of groups(); track g.label) {
            <div class="bw-card overflow-hidden animate-fade-slide-up">
              <!-- Group header -->
              <div class="flex justify-between items-center px-4 py-3 bg-bw-elevated border-b border-bw-border">
                <span class="text-[13px] font-bold text-bw-ink">{{ g.label }}</span>
                <span class="mono text-[12px] font-semibold"
                      [style.color]="g.total < 0 ? 'var(--bw-red)' : 'var(--bw-green)'">
                  {{ g.total < 0 ? '−' : '+' }}Rp {{ formatRupiah(Math.abs(g.total)) }}
                </span>
              </div>
              <!-- Rows -->
              @for (tx of g.items; track tx.id; let i = $index) {
                <div class="flex items-center gap-3.5 px-4 py-3.5" [class.tx-row]="i > 0">
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
                    @if (tx.description) {
                      <div class="text-[12px] text-bw-ink-3 mt-0.5 truncate">{{ tx.description }}</div>
                    }
                  </div>
                  <span class="text-[12px] font-medium px-2.5 py-0.5 rounded-full shrink-0"
                        [style.background]="typeChipBg(tx.type)"
                        [style.color]="typeChipColor(tx.type)">
                    {{ typeLabel(tx.type) }}
                  </span>
                  <div class="text-[12px] text-bw-ink-3 w-[120px] text-right shrink-0">{{ formatTime(tx.createdAt) }}</div>
                  <div class="mono text-[15px] font-bold w-[140px] text-right shrink-0"
                       [style.color]="tx.type === 'expense' ? 'var(--bw-red)' : 'var(--bw-green)'">
                    {{ tx.type === 'expense' ? '−' : '+' }}Rp {{ formatRupiah(tx.amount) }}
                  </div>
                </div>
              }
            </div>
          }
        }
      </div>

      <!-- Right: insights -->
      <div class="flex flex-col gap-4">

        <!-- Monthly summary -->
        <div class="bw-card p-5 animate-fade-slide-up" style="animation-delay:60ms">
          <div class="text-[12px] font-semibold uppercase tracking-[0.04em] text-bw-ink-3 mb-2">Bulan ini</div>
          <div class="flex items-baseline gap-2 mb-4">
            <div class="mono text-[28px] font-extrabold tracking-[-0.03em] text-bw-ink">
              Rp {{ formatRupiahShort(totalExpenseMonth()) }}
            </div>
            <span class="text-[12px] font-semibold px-2 py-0.5 rounded-full"
                  style="background:var(--bw-red-soft);color:var(--bw-red)">
              pengeluaran
            </span>
          </div>
          <!-- Category breakdown -->
          @for (b of categoryBreakdown(); track b.label) {
            <div class="mb-3">
              <div class="flex justify-between text-[12px] font-semibold mb-1.5">
                <span class="text-bw-ink">{{ b.label }}</span>
                <span class="mono text-bw-ink-3">{{ b.pct | number:'1.0-0' }}%</span>
              </div>
              <div class="h-1.5 rounded-full bg-bw-sunken overflow-hidden">
                <div class="bar-fill h-full" [style.width.%]="b.pct" [style.background]="b.color"></div>
              </div>
            </div>
          }
        </div>

        <!-- Insight card -->
        <div class="bw-card p-4 animate-fade-slide-up" style="animation-delay:120ms;background:var(--bw-ink);border-color:var(--bw-ink)">
          <div class="text-[13px] font-bold text-bw-on-ink mb-1">📊 Insight</div>
          <div class="text-[12px] leading-relaxed" style="color:rgba(245,244,239,0.65)">
            Total {{ totalTxCount() }} transaksi di bulan ini. Pengeluaran terbesar di
            <strong style="color:var(--bw-lime)">{{ topCategory() }}</strong>.
          </div>
          <button (click)="goToAdd()"
            class="mt-3 px-3 py-1.5 rounded-[8px] text-[12px] font-semibold cursor-pointer"
            style="background:var(--bw-lime);color:var(--bw-ink)">
            Catat transaksi
          </button>
        </div>

      </div>
    </div>

    <!-- ── Mobile layout ──────────────────────────────────── -->
    <div class="flex flex-col md:hidden px-4 pb-6 pt-2 gap-3">

      <!-- Search -->
      <div class="relative">
        <svg lucideSearch class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bw-ink-3" style="pointer-events:none"></svg>
        <input class="bw-input" placeholder="Cari transaksi…" [(ngModel)]="searchQuery" />
      </div>

      <!-- Filter chips horizontal scroll -->
      <div class="flex gap-2 overflow-x-auto pb-1" style="scrollbar-width:none">
        @for (f of filters; track f.id) {
          <button class="filter-chip shrink-0" [class.active]="activeFilter() === f.id" (click)="setFilter(f.id)">
            {{ f.label }}
          </button>
        }
      </div>

      <!-- Stats strip -->
      <div class="grid grid-cols-2 gap-2">
        <div class="bw-card p-3">
          <div class="text-[11px] font-semibold uppercase tracking-wider text-bw-ink-3 mb-1">Pengeluaran</div>
          <div class="mono text-[17px] font-bold text-bw-red">{{ formatRupiahShort(totalExpenseMonth()) }}</div>
        </div>
        <div class="bw-card p-3">
          <div class="text-[11px] font-semibold uppercase tracking-wider text-bw-ink-3 mb-1">Pemasukan</div>
          <div class="mono text-[17px] font-bold text-bw-green">{{ formatRupiahShort(totalIncomeMonth()) }}</div>
        </div>
      </div>

      <!-- Grouped list (mobile) -->
      @if (loading()) {
        <div class="text-center py-10 text-bw-ink-3 text-[14px]">Memuat…</div>
      } @else {
        @for (g of groups(); track g.label) {
          <div class="bw-card overflow-hidden animate-fade-slide-up">
            <div class="flex justify-between items-center px-4 py-2.5 bg-bw-elevated border-b border-bw-border">
              <span class="text-[12px] font-bold text-bw-ink">{{ g.label }}</span>
              <span class="mono text-[11px] font-semibold"
                    [style.color]="g.total < 0 ? 'var(--bw-red)' : 'var(--bw-green)'">
                {{ g.total < 0 ? '−' : '+' }}Rp {{ formatRupiah(Math.abs(g.total)) }}
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
                  <div class="text-[11px] text-bw-ink-3 mt-0.5">{{ formatTime(tx.createdAt) }}</div>
                </div>
                <div class="mono text-[13px] font-bold shrink-0"
                     [style.color]="tx.type === 'expense' ? 'var(--bw-red)' : 'var(--bw-green)'">
                  {{ tx.type === 'expense' ? '−' : '+' }}{{ formatRupiahShort(tx.amount) }}
                </div>
              </div>
            }
          </div>
        }
        @if (groups().length === 0) {
          <div class="text-center py-12 text-bw-ink-3 text-[13px]">Tidak ada transaksi</div>
        }
      }
    </div>
  `,
})
export class TransactionPage implements OnInit {
  private recordsService = inject(UserRecordsService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly Math = Math;

  loading = signal(true);
  private allRecords = signal<UserRecord | null>(null);

  activeFilter = signal<FilterType>('all');
  searchQuery = '';

  readonly filters: { id: FilterType; label: string }[] = [
    { id: 'all',     label: 'Semua' },
    { id: 'expense', label: 'Pengeluaran' },
    { id: 'income',  label: 'Pemasukan' },
    { id: 'debt',    label: 'Hutang' },
  ];

  async ngOnInit() {
    try {
      this.allRecords.set(await this.recordsService.getRecords());
    } catch {
      this.snackBar.open('Gagal memuat data.', 'Tutup', { duration: 3000 });
    } finally {
      this.loading.set(false);
    }
  }

  private flatTx = computed<Record[]>(() => {
    const r = this.allRecords();
    if (!r) return [];
    return [
      ...r.expenses.map(t => ({ ...t, type: 'expense' })),
      ...r.incomes.map(t => ({ ...t, type: 'income' })),
      ...r.debts.map(t => ({ ...t, type: 'debt' })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  groups = computed<TxGroup[]>(() => {
    const filter = this.activeFilter();
    const q = this.searchQuery.toLowerCase().trim();
    let txs = this.flatTx();
    if (filter !== 'all') txs = txs.filter(t => t.type === filter);
    if (q) txs = txs.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));

    const map = new Map<string, TxGroup>();
    for (const tx of txs) {
      const d = new Date(tx.createdAt);
      const key = d.toDateString();
      if (!map.has(key)) {
        map.set(key, { label: this.dayLabel(d), date: d, total: 0, items: [] });
      }
      const g = map.get(key)!;
      g.items.push(tx);
      g.total += tx.type === 'expense' ? -tx.amount : tx.amount;
    }
    return Array.from(map.values());
  });

  totalExpenseMonth = computed(() => {
    const now = new Date();
    return (this.allRecords()?.expenses ?? [])
      .filter(t => {
        const d = new Date(t.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, t) => s + t.amount, 0);
  });

  totalIncomeMonth = computed(() => {
    const now = new Date();
    return (this.allRecords()?.incomes ?? [])
      .filter(t => {
        const d = new Date(t.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, t) => s + t.amount, 0);
  });

  totalTxCount = computed(() => this.flatTx().length);

  categoryBreakdown = computed(() => {
    const expenses = this.allRecords()?.expenses ?? [];
    const total = expenses.reduce((s, t) => s + t.amount, 0);
    if (total === 0) return [];
    const cats: { [key: string]: number } = {};
    for (const t of expenses) {
      const k = t.description || 'Lainnya';
      cats[k] = (cats[k] ?? 0) + t.amount;
    }
    const sorted = Object.entries(cats)
      .map(([label, amt]) => ({ label, pct: (amt / total) * 100 }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 5);
    const colors = ['var(--bw-ink)', 'var(--bw-amber)', 'var(--bw-red)', 'var(--bw-lime)', 'var(--bw-ink-3)'];
    return sorted.map((s, i) => ({ ...s, color: colors[i] }));
  });

  topCategory = computed(() => this.categoryBreakdown()[0]?.label ?? 'Lainnya');

  setFilter(f: FilterType) { this.activeFilter.set(f); }
  goToAdd() { this.router.navigate(['/transaction/add']); }

  typeLabel(type: string) {
    return type === 'expense' ? 'Pengeluaran' : type === 'income' ? 'Pemasukan' : 'Hutang';
  }
  typeChipBg(type: string) {
    return type === 'expense' ? 'var(--bw-red-soft)' : type === 'income' ? 'var(--bw-green-soft)' : 'var(--bw-amber-soft)';
  }
  typeChipColor(type: string) {
    return type === 'expense' ? 'var(--bw-red)' : type === 'income' ? 'var(--bw-green)' : 'var(--bw-amber)';
  }

  formatRupiah(n: number): string {
    return new Intl.NumberFormat('id-ID').format(n);
  }
  formatRupiahShort(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'jt';
    if (n >= 1_000) return (n / 1_000).toFixed(0) + 'rb';
    return String(n);
  }
  formatTime(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }
  private dayLabel(d: Date): string {
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diff === 0) return 'Hari ini · ' + new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
    if (diff === 1) return 'Kemarin · ' + new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
    return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  }
}
