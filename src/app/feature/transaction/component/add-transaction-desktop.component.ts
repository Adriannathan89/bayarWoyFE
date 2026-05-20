import { Component, OnInit, signal, inject, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRecordsService } from '../../../core/service/user/user-records.service';
import { AddTransactionTypePickerDesktopComponent } from '../ui/add-transaction/add-transaction-type-picker-desktop.component';
import { AddTransactionAmountHeroComponent } from '../ui/add-transaction/add-transaction-amount-hero.component';
import { AddTransactionDetailsFormComponent } from '../ui/add-transaction/add-transaction-details-form.component';
import { AddTransactionActionsDesktopComponent } from '../ui/add-transaction/add-transaction-actions-desktop.component';

type TxType = 'expense' | 'income' | 'debt';

const QUICK_AMOUNTS = [
  { label: '10rb',  value: 10_000 },
  { label: '25rb',  value: 25_000 },
  { label: '50rb',  value: 50_000 },
  { label: '100rb', value: 100_000 },
  { label: '250rb', value: 250_000 },
  { label: '500rb', value: 500_000 },
];

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
  selector: 'app-add-transaction-desktop',
  standalone: true,
  imports: [
    AddTransactionTypePickerDesktopComponent,
    AddTransactionAmountHeroComponent,
    AddTransactionDetailsFormComponent,
    AddTransactionActionsDesktopComponent,
  ],
  template: `
    <div class="flex justify-center px-8 py-8">
      <div class="w-full max-w-[720px] flex flex-col gap-4 animate-fade-slide-up">

        <app-add-transaction-type-picker-desktop
          [txTypes]="txTypes"
          [selectedType]="selectedType()"
          [onSelectType]="selectType"
        />

        <app-add-transaction-amount-hero
          [formattedAmount]="formattedAmount()"
          [rawAmount]="rawAmount()"
          [quickAmounts]="quickAmounts"
          [onAmountInput]="handleAmountInput"
          [onQuickSelect]="setRawAmount"
        />

        <app-add-transaction-details-form
          [form]="form"
          [categories]="categories"
          [selectedCategory]="selectedCategory()"
          [onSelectCategory]="selectCategory"
        />

        <app-add-transaction-actions-desktop
          [saving]="saving()"
          [onSubmitAgain]="submitAndAgain"
          [onSubmit]="submitOnce"
        />

      </div>
    </div>
  `,
})
export class AddTransactionDesktopSubPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private recordsService = inject(UserRecordsService);
  private snackBar = inject(MatSnackBar);

  readonly txTypes = [
    { id: 'income'  as TxType, label: 'Pemasukan',      accent: 'var(--bw-green)',  softAccent: 'var(--bw-green-soft)' },
    { id: 'expense' as TxType, label: 'Pengeluaran',    accent: 'var(--bw-red)',    softAccent: 'var(--bw-red-soft)' },
    { id: 'debt'    as TxType, label: 'Hutang/Piutang', accent: 'var(--bw-amber)',  softAccent: 'var(--bw-amber-soft)' },
  ];
  readonly quickAmounts = QUICK_AMOUNTS;
  readonly categories = CATEGORIES;

  selectedType = signal<TxType>('income');
  rawAmount = signal(0);
  selectedCategory = signal('lainnya');
  saving = signal(false);

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    date: [this.todayISO()],
  });

  ngOnInit() {
    const type = this.route.snapshot.queryParamMap.get('type') as TxType | null;
    if (type && ['income', 'expense', 'debt'].includes(type)) {
      this.selectedType.set(type);
    }
  }

  formattedAmount(): string {
    const v = this.rawAmount();
    return v === 0 ? '0' : new Intl.NumberFormat('id-ID').format(v);
  }

  handleAmountInput = (e: Event) => {
    const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '');
    this.rawAmount.set(raw ? Math.min(Number(raw), 999_999_999) : 0);
  };

  @HostListener('window:keydown', ['$event'])
  onGlobalKey(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      this.handleSubmit(false);
    }
  }

  async handleSubmit(andAgain: boolean) {
    if (this.rawAmount() === 0) {
      this.snackBar.open('Masukkan jumlah terlebih dahulu.', 'Tutup', { duration: 2000 });
      return;
    }
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
        this.form.controls.date.value!,
      );
      this.snackBar.open('Transaksi tersimpan!', 'Tutup', { duration: 2500 });
      if (andAgain) {
        this.form.reset({ title: '', description: '', date: this.todayISO() });
        this.rawAmount.set(0);
        this.selectedCategory.set('lainnya');
      } else {
        this.router.navigate(['/transaction']);
      }
    } catch {
      this.snackBar.open('Gagal menyimpan. Coba lagi.', 'Tutup', { duration: 3000 });
    } finally {
      this.saving.set(false);
    }
  }

  selectType = (type: TxType) => this.selectedType.set(type);
  selectCategory = (id: string) => this.selectedCategory.set(id);
  setRawAmount = (value: number) => this.rawAmount.set(value);
  submitAndAgain = () => this.handleSubmit(true);
  submitOnce = () => this.handleSubmit(false);

  private todayISO(): string {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }
}
