import { Component, signal, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRecordsService } from '../../../core/service/user/user-records.service';
import { AddTransactionMobilePhase1Component } from '../ui/add-transaction/add-transaction-mobile-phase1.component';
import { AddTransactionMobilePhase2Component } from '../ui/add-transaction/add-transaction-mobile-phase2.component';

type TxType = 'expense' | 'income' | 'debt';

const CATEGORIES = [
  { id: 'makanan',   label: 'Makanan',   icon: 'utensils' },
  { id: 'minum',     label: 'Minum',     icon: 'coffee' },
  { id: 'transport', label: 'Transport', icon: 'car' },
  { id: 'belanja',   label: 'Belanja',   icon: 'bag' },
  { id: 'hiburan',   label: 'Hiburan',   icon: 'film' },
  { id: 'hadiah',    label: 'Hadiah',    icon: 'gift' },
  { id: 'lainnya',   label: 'Lainnya',   icon: 'flag' },
];

@Component({
  selector: 'app-add-transaction-mobile',
  standalone: true,
  imports: [
    AddTransactionMobilePhase1Component,
    AddTransactionMobilePhase2Component,
  ],
  template: `
    <div class="flex flex-col h-full">

      <!-- ─ Phase 1: Type + Amount + Numpad ─ -->
      @if (phase === 1) {
        <app-add-transaction-mobile-phase1
          [txTypes]="txTypes"
          [selectedType]="selectedType()"
          [formattedAmount]="formattedAmount()"
          [onSelectType]="selectType"
          [onPressNum]="pressNum"
          [onNext]="goToPhase2"
        />
      }

      <!-- ─ Phase 2: Details ─ -->
      @if (phase === 2) {
        <app-add-transaction-mobile-phase2
          [typeLabel]="typeLabel()"
          [formattedAmount]="formattedAmount()"
          [form]="form"
          [categories]="categories"
          [selectedCategory]="selectedCategory()"
          [saving]="saving()"
          [onEditAmount]="backToPhase1"
          [onSelectCategory]="selectCategory"
          [onSubmit]="submit"
          [onCancel]="goBack"
        />
      }
    </div>
  `,
})
export class AddTransactionMobileSubPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private recordsService = inject(UserRecordsService);
  private snackBar = inject(MatSnackBar);

  readonly txTypes = [
    { id: 'income'  as TxType, label: 'Pemasukan',   accent: 'var(--bw-green)',  softAccent: 'var(--bw-green-soft)' },
    { id: 'expense' as TxType, label: 'Pengeluaran', accent: 'var(--bw-red)',    softAccent: 'var(--bw-red-soft)' },
    { id: 'debt'    as TxType, label: 'Hutang',      accent: 'var(--bw-amber)',  softAccent: 'var(--bw-amber-soft)' },
  ];
  readonly categories = CATEGORIES;

  phase = 1;
  selectedType = signal<TxType>('income');
  rawAmount = signal(0);
  selectedCategory = signal('lainnya');
  saving = signal(false);

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    date: [this.todayDate()],
  });

  formattedAmount(): string {
    const v = this.rawAmount();
    return v === 0 ? '0' : new Intl.NumberFormat('id-ID').format(v);
  }

  typeLabel(): string {
    return this.txTypes.find(t => t.id === this.selectedType())?.label ?? '';
  }

  pressNum = (key: string) => {
    if (key === 'del') {
      const s = String(this.rawAmount()).slice(0, -1);
      this.rawAmount.set(s ? Number(s) : 0);
      return;
    }
    const current = this.rawAmount() === 0 ? '' : String(this.rawAmount());
    const next = Number(current + key);
    if (next > 999_999_999) return;
    this.rawAmount.set(next);
  };

  goToPhase2 = () => {
    if (this.rawAmount() === 0) {
      this.snackBar.open('Masukkan jumlah terlebih dahulu.', 'Tutup', { duration: 2000 });
      return;
    }
    this.phase = 2;
  };

  submit = async () => {
    if (!this.form.controls.title.value?.trim()) {
      this.snackBar.open('Judul tidak boleh kosong.', 'Tutup', { duration: 2000 });
      return;
    }
    this.saving.set(true);
    try {
      const description = [
        this.selectedCategory() !== 'lainnya'
          ? this.categories.find(c => c.id === this.selectedCategory())?.label
          : '',
        this.form.controls.description.value,
      ].filter(Boolean).join(' · ');

      await this.recordsService.createRecord(
        this.form.controls.title.value!.trim(),
        description,
        this.rawAmount(),
        this.selectedType(),
      );
      this.snackBar.open('Transaksi tersimpan!', 'Tutup', { duration: 2500 });
      this.router.navigate(['/transaction']);
    } catch {
      this.snackBar.open('Gagal menyimpan. Coba lagi.', 'Tutup', { duration: 3000 });
    } finally {
      this.saving.set(false);
    }
  };

  goBack() { this.router.navigate(['/transaction']); }

  backToPhase1 = () => { this.phase = 1; };
  selectType = (type: TxType) => this.selectedType.set(type);
  selectCategory = (id: string) => this.selectedCategory.set(id);

  private todayDate(): string {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }
}
