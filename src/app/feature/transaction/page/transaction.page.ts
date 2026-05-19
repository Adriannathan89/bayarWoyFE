import { Component, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { UserRecordsService } from "@/core/service/user/user-records.service";
import { UserRecord } from "@/core/model/record.model";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full flex flex-col items-center py-12 px-4">
      <p class="text-2xl font-bold mb-8">Dashboard Keuangan</p>
      <div class="w-full max-w-6xl">

        @if (record) {
          <div class="bg-card-color rounded-2xl p-6 mb-8 shadow-lg animate-fade-slide-up">
            <p class="text-xs uppercase tracking-widest text-text-card-color opacity-70 mb-1">Net Balance</p>
            <p class="text-4xl font-bold text-text-card-color mb-4">
              {{ animatedBalance | currency:'IDR':'symbol-narrow':'1.0-0' }}
            </p>
            <div class="flex gap-6 border-t border-white/20 pt-4">
              <div>
                <p class="text-xs text-text-card-color opacity-60">Cash</p>
                <p class="text-sm font-semibold text-green-400">{{ record.cash | currency:'IDR':'symbol-narrow':'1.0-0' }}</p>
              </div>
              <div>
                <p class="text-xs text-text-card-color opacity-60">Receivable</p>
                <p class="text-sm font-semibold text-blue-300">{{ record.receivable | currency:'IDR':'symbol-narrow':'1.0-0' }}</p>
              </div>
              <div>
                <p class="text-xs text-text-card-color opacity-60">Debt</p>
                <p class="text-sm font-semibold text-red-400">{{ record.debt | currency:'IDR':'symbol-narrow':'1.0-0' }}</p>
              </div>
            </div>
          </div>
        }

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          <div class="flex flex-col items-center bg-primary-color rounded-lg shadow-lg p-8">
            <h2 class="text-lg font-semibold mb-6">Perbandingan Total</h2>
            @if (record && recordByType.length > 0) {
              <div
                class="w-56 h-56 rounded-full shadow-md border-4 border-gray-100 animate-spin-in"
                [ngStyle]="{'background-image': pieChartStyle}">
              </div>
              <div class="mt-8 w-full space-y-2">
                @for (item of recordByType; track item.type) {
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2 flex-1">
                      <div class="w-3 h-3 rounded-full" [ngStyle]="{'background-color': item.color}"></div>
                      <p class="font-semibold capitalize text-sm">{{ item.type }}</p>
                    </div>
                    <p class="text-xs text-gray-600">{{ item.percentage | number:'1.0-1' }}%</p>
                  </div>
                }
              </div>
            } @else {
              <p class="text-text-color">Belum ada data</p>
            }
          </div>

          <div class="flex flex-col space-y-4 justify-center">
            @if (record) {
              <div class="bg-primary-color rounded-lg shadow p-6 border-l-4 border-red-500 animate-fade-slide-up hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200" style="animation-delay:0ms">
                <p class="text-sm text-text-color mb-1">Total Pengeluaran</p>
                <p class="text-2xl font-bold text-red-600">{{ totalExpenses | currency:'IDR':'symbol-narrow':'1.0-0' }}</p>
                <p class="text-xs text-gray-500 mt-2">{{ record.expenses.length || 0 }} transaksi</p>
              </div>
              <div class="bg-primary-color rounded-lg shadow p-6 border-l-4 border-green-500 animate-fade-slide-up hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200" style="animation-delay:100ms">
                <p class="text-sm text-text-color mb-1">Total Pemasukkan</p>
                <p class="text-2xl font-bold text-green-600">{{ totalIncomes | currency:'IDR':'symbol-narrow':'1.0-0' }}</p>
                <p class="text-xs text-gray-500 mt-2">{{ record.incomes.length || 0 }} transaksi</p>
              </div>
              <div class="bg-primary-color rounded-lg shadow p-6 border-l-4 border-orange-500 animate-fade-slide-up hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200" style="animation-delay:200ms">
                <p class="text-sm text-text-color mb-1">Total Hutang</p>
                <p class="text-2xl font-bold text-orange-600">{{ totalDebts | currency:'IDR':'symbol-narrow':'1.0-0' }}</p>
                <p class="text-xs text-gray-500 mt-2">{{ record.debts.length || 0 }} transaksi</p>
              </div>
            }
          </div>

        </div>

        <div class="bg-primary-color rounded-lg shadow-lg p-8">
          <h2 class="text-lg font-semibold mb-6">Detail Transaksi</h2>

          @if (record) {
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

              <div>
                <h3 class="font-bold text-red-500 border-b-2 border-red-500 pb-2 mb-4">Pengeluaran</h3>
                <div class="space-y-2">
                  @for (exp of record.expenses || []; track exp.id; let i = $index) {
                    <div
                      class="bg-primary-color p-3 rounded shadow-md border-l-4 border-red-400 animate-fade-slide-up hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                      [style.animation-delay]="i * 50 + 'ms'">
                      <p class="font-semibold text-text-color text-sm">{{ exp.title }}</p>
                      <p class="text-xs text-gray-500 mb-1">{{ formatDate(exp.createdAt) }}</p>
                      <p class="text-xs text-red-600 font-bold">-{{ exp.amount | currency:'IDR':'symbol-narrow':'1.0-0' }}</p>
                    </div>
                  } @empty {
                    <p class="text-sm text-gray-400">Tidak ada pengeluaran</p>
                  }
                </div>
              </div>

              <div>
                <h3 class="font-bold text-green-500 border-b-2 border-green-500 pb-2 mb-4">Pemasukkan</h3>
                <div class="space-y-2">
                  @for (inc of record.incomes || []; track inc.id; let i = $index) {
                    <div
                      class="bg-primary-color p-3 rounded shadow-xl border-l-4 border-green-400 animate-fade-slide-up hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                      [style.animation-delay]="i * 50 + 'ms'">
                      <p class="font-semibold text-text-color text-sm">{{ inc.title }}</p>
                      <p class="text-xs text-gray-500 mb-1">{{ formatDate(inc.createdAt) }}</p>
                      <p class="text-xs text-green-600 font-bold">+{{ inc.amount | currency:'IDR':'symbol-narrow':'1.0-0' }}</p>
                    </div>
                  } @empty {
                    <p class="text-sm text-gray-400">Tidak ada pemasukkan</p>
                  }
                </div>
              </div>

              <div>
                <h3 class="font-bold text-orange-500 border-b-2 border-orange-500 pb-2 mb-4">Hutang</h3>
                <div class="space-y-2">
                  @for (debt of record.debts || []; track debt.id; let i = $index) {
                    <div
                      class="bg-primary-color p-3 rounded shadow-md border-l-4 border-orange-400 animate-fade-slide-up hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                      [style.animation-delay]="i * 50 + 'ms'">
                      <p class="font-semibold text-text-color text-sm">{{ debt.title }}</p>
                      <p class="text-xs text-orange-600 font-bold">{{ debt.amount | currency:'IDR':'symbol-narrow':'1.0-0' }}</p>
                    </div>
                  } @empty {
                    <p class="text-sm text-gray-400">Tidak ada hutang</p>
                  }
                </div>
              </div>

            </div>
          }
        </div>

      </div>

      <button
        class="fixed bottom-6 right-6 bg-green-500 w-16 h-16 text-white rounded-full text-4xl cursor-pointer flex items-center justify-center shadow-xl hover:bg-green-600 hover:scale-110 transition-all z-50"
        (click)="addTransaction()"
        title="Tambah Transaksi">
        +
      </button>
    </div>
  `
})
export class TransactionPage {
  record: UserRecord | null = null;
  recordByType: { type: string; amount: number; color: string; percentage: number }[] = [];
  pieChartStyle: string = '';
  totalExpenses: number = 0;
  totalIncomes: number = 0;
  totalDebts: number = 0;
  animatedBalance: number = 0;

  constructor(
    private router: Router,
    private recordsService: UserRecordsService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.fetchRecords();
  }

  async fetchRecords() {
    try {
      this.record = await this.recordsService.getRecords();
      this.calculateChartData();
      this.countUpBalance(this.record.balance);
      this.cdr.detectChanges();
    } catch (error) {
      this.snackBar.open(error as string, 'Close', { duration: 3000 });
    }
  }

  calculateChartData() {
    if (!this.record) {
      this.recordByType = [];
      this.pieChartStyle = '';
      return;
    }

    this.totalExpenses = this.record.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
    this.totalIncomes = this.record.incomes?.reduce((sum, inc) => sum + inc.amount, 0) || 0;
    this.totalDebts = this.record.debts?.reduce((sum, debt) => sum + debt.amount, 0) || 0;

    const grouped: { [key: string]: number } = {
      expense: this.totalExpenses,
      income: this.totalIncomes,
      debt: this.totalDebts
    };

    const total = Object.values(grouped).reduce((sum, val) => sum + val, 0);

    if (total === 0) {
      this.recordByType = [];
      this.pieChartStyle = '';
      return;
    }

    const colors = ['#ef4444', '#22c55e', '#f59e0b'];
    let startPercentage = 0;
    const gradientParts: string[] = [];

    this.recordByType = Object.keys(grouped).map((type, index) => {
      const amount = grouped[type];
      const percentage = (amount / total) * 100;
      const endPercentage = startPercentage + percentage;
      const color = colors[index];
      gradientParts.push(`${color} ${startPercentage}% ${endPercentage}%`);
      startPercentage = endPercentage;
      return { type, amount, percentage, color };
    });

    this.pieChartStyle = `conic-gradient(${gradientParts.join(', ')})`;
  }

  private countUpBalance(target: number) {
    const steps = 30;
    const duration = 600;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        this.animatedBalance = target;
        clearInterval(interval);
      } else {
        this.animatedBalance = Math.floor(current);
      }
      this.cdr.detectChanges();
    }, duration / steps);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr.replace(' ', 'T'));
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      + ', '
      + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  addTransaction() {
    this.router.navigate(['/transaction/add']);
  }
}