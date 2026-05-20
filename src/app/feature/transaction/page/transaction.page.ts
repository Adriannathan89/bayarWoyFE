import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRecordsService } from '../../../core/service/user/user-records.service';
import { Record, UserRecord } from '../../../core/model/record.model';
import { TransactionSearchComponent } from '../ui/transaction/transaction-search.component';
import { TransactionFilterChipsComponent } from '../ui/transaction/transaction-filter-chips.component';
import { TransactionEmptyStateComponent } from '../ui/transaction/transaction-empty-state.component';
import { TransactionGroupListDesktopComponent } from '../ui/transaction/transaction-group-list-desktop.component';
import { TransactionGroupListMobileComponent } from '../ui/transaction/transaction-group-list-mobile.component';
import { TransactionMonthlySummaryComponent } from '../ui/transaction/transaction-monthly-summary.component';
import { TransactionMobileStatsComponent } from '../ui/transaction/transaction-mobile-stats.component';

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
    TransactionSearchComponent,
    TransactionFilterChipsComponent,
    TransactionEmptyStateComponent,
    TransactionGroupListDesktopComponent,
    TransactionGroupListMobileComponent,
    TransactionMonthlySummaryComponent,
    TransactionMobileStatsComponent,
  ],
  template: `
    <!-- ── Desktop layout ──────────────────────────────────── -->
    <div class="hidden md:grid p-8 gap-6" style="grid-template-columns: 1fr 320px;">

      <!-- Left: list -->
      <div class="flex flex-col gap-4 min-w-0">

        <!-- Search + filters -->
        <div class="flex gap-3 items-center flex-wrap">
          <div class="flex-1 min-w-[240px]">
            <app-transaction-search [(query)]="searchQuery"></app-transaction-search>
          </div>
          <app-transaction-filter-chips
            [filters]="filters"
            [activeFilter]="activeFilter()"
            (select)="setFilter($event)"
          />
        </div>

        <!-- Grouped list -->
        @if (loading()) {
          <div class="flex justify-center py-16 text-bw-ink-3 text-[14px]">Memuat…</div>
        } @else if (groups().length === 0) {
          <app-transaction-empty-state
            variant="card"
            [subtitle]="emptySubtitle()"
          />
        } @else {
          <app-transaction-group-list-desktop
            [groups]="groups()"
            [formatRupiah]="formatRupiah"
            [formatTime]="formatTime"
            [typeLabel]="typeLabel"
            [typeChipBg]="typeChipBg"
            [typeChipColor]="typeChipColor"
          />
        }
      </div>

      <!-- Right: insights -->
      <div class="flex flex-col gap-4">

        <!-- Monthly summary -->
        <app-transaction-monthly-summary
          [totalExpenseMonth]="totalExpenseMonth()"
          [categoryBreakdown]="categoryBreakdown()"
          [formatRupiahShort]="formatRupiahShort"
        />
      </div>
    </div>

    <!-- ── Mobile layout ──────────────────────────────────── -->
    <div class="flex flex-col md:hidden px-4 pb-6 pt-2 gap-3">

      <!-- Search -->
      <app-transaction-search [(query)]="searchQuery"></app-transaction-search>

      <!-- Filter chips horizontal scroll -->
      <app-transaction-filter-chips
        variant="mobile"
        [filters]="filters"
        [activeFilter]="activeFilter()"
        (select)="setFilter($event)"
      />

      <!-- Stats strip -->
      <app-transaction-mobile-stats
        [totalExpenseMonth]="totalExpenseMonth()"
        [totalIncomeMonth]="totalIncomeMonth()"
        [formatRupiahShort]="formatRupiahShort"
      />

      <!-- Grouped list (mobile) -->
      @if (loading()) {
        <div class="text-center py-10 text-bw-ink-3 text-[14px]">Memuat…</div>
      } @else {
        <app-transaction-group-list-mobile
          [groups]="groups()"
          [formatRupiah]="formatRupiah"
          [formatRupiahShort]="formatRupiahShort"
          [formatTime]="formatTime"
        />
        @if (groups().length === 0) {
          <app-transaction-empty-state variant="text"></app-transaction-empty-state>
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

  emptySubtitle(): string {
    return this.searchQuery ? 'Coba kata kunci lain' : 'Belum ada transaksi di kategori ini';
  }

  typeLabel = (type: string) =>
    type === 'expense' ? 'Pengeluaran' : type === 'income' ? 'Pemasukan' : 'Hutang';

  typeChipBg = (type: string) =>
    type === 'expense' ? 'var(--bw-red-soft)' : type === 'income' ? 'var(--bw-green-soft)' : 'var(--bw-amber-soft)';

  typeChipColor = (type: string) =>
    type === 'expense' ? 'var(--bw-red)' : type === 'income' ? 'var(--bw-green)' : 'var(--bw-amber)';

  formatRupiah = (n: number): string => new Intl.NumberFormat('id-ID').format(n);

  formatRupiahShort = (n: number): string => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'jt';
    if (n >= 1_000) return (n / 1_000).toFixed(0) + 'rb';
    return String(n);
  };

  formatTime = (dateStr: string): string => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };
  private dayLabel(d: Date): string {
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diff === 0) return 'Hari ini · ' + new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
    if (diff === 1) return 'Kemarin · ' + new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
    return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  }
}
