import { Component, OnInit, signal, inject, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  LucideArrowUp, LucideArrowDown, LucideUsers, LucideCheck,
  LucideUtensils, LucideCoffee, LucideCar,
  LucideShoppingBag, LucideFilm, LucideGift, LucideFlag,
} from '@lucide/angular';
import { UserRecordsService } from '../../../core/service/user/user-records.service';

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
    ReactiveFormsModule,
    LucideArrowUp, LucideArrowDown, LucideUsers, LucideCheck,
    LucideUtensils, LucideCoffee, LucideCar,
    LucideShoppingBag, LucideFilm, LucideGift, LucideFlag,
  ],
  styles: [`
    :host { display: block; }
    .bw-card { background: var(--bw-surface); border: 1px solid var(--bw-border); border-radius: var(--bw-r-lg); }
    .type-tile {
      padding: 20px 18px; border-radius: var(--bw-r-lg); border: 1px solid var(--bw-border);
      background: var(--bw-surface); color: var(--bw-ink);
      display: flex; flex-direction: column; gap: 10px; position: relative;
      cursor: pointer; transition: background 0.15s, border-color 0.15s;
      text-align: left;
    }
    .type-tile.sel { background: var(--bw-lime-alpha); border-color: var(--bw-lime); }
    .quick-chip {
      padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;
      background: var(--bw-surface); color: var(--bw-ink-2);
      border: 1px solid var(--bw-border); cursor: pointer;
      transition: background 0.12s, color 0.12s, border-color 0.12s;
    }
    .quick-chip.sel { background: var(--bw-ink); color: var(--bw-on-ink); border-color: var(--bw-ink); }
    .cat-chip {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 12px; border-radius: 999px; font-size: 13px; font-weight: 600;
      background: var(--bw-elevated); color: var(--bw-ink-2);
      cursor: pointer; transition: background 0.12s, color 0.12s;
      border: 1px solid transparent;
    }
    .cat-chip.sel { background: var(--bw-ink); color: var(--bw-on-ink); }
    .bw-input {
      width: 100%; font-family: inherit; font-size: 15px;
      padding: 14px 16px; border-radius: var(--bw-r-md);
      background: var(--bw-elevated); color: var(--bw-ink);
      border: 1px solid var(--bw-border); outline: none;
      transition: border-color .12s, background .12s;
    }
    .bw-input:focus { border-color: var(--bw-ink); background: var(--bw-surface); }
    .bw-input::placeholder { color: var(--bw-ink-3); }
    .bw-label { font-size: 13px; font-weight: 600; color: var(--bw-ink-2); margin-bottom: 8px; display: block; }
  `],
  template: `
    <div class="flex justify-center px-8 py-8">
      <div class="w-full max-w-[720px] flex flex-col gap-4 animate-fade-slide-up">

        <!-- Type picker -->
        <div class="grid grid-cols-3 gap-2.5">
          @for (t of txTypes; track t.id) {
            <button type="button" class="type-tile" [class.sel]="selectedType() === t.id"
                    (click)="selectedType.set(t.id)">
              <div class="w-9 h-9 rounded-[10px] flex items-center justify-center"
                   [style.background]="selectedType() === t.id ? t.softAccent : 'var(--bw-sunken)'"
                   [style.color]="t.accent">
                @if (t.id === 'expense') {
                  <svg lucideArrowUp class="w-[18px] h-[18px]" style="stroke-width:2.4"></svg>
                } @else if (t.id === 'income') {
                  <svg lucideArrowDown class="w-[18px] h-[18px]" style="stroke-width:2.4"></svg>
                } @else {
                  <svg lucideUsers class="w-[18px] h-[18px]" style="stroke-width:2.4"></svg>
                }
              </div>
              <div class="text-[16px] font-bold">{{ t.label }}</div>
              @if (selectedType() === t.id) {
                <div class="absolute top-4 right-4">
                  <svg lucideCheck class="w-[18px] h-[18px]" style="color:var(--bw-lime)"></svg>
                </div>
              }
            </button>
          }
        </div>

        <!-- Amount hero -->
        <div class="bw-card text-center" style="padding:28px;background:var(--bw-elevated)">
          <div class="text-[12px] font-semibold uppercase tracking-[0.1em] text-bw-ink-3 mb-2">Jumlah</div>
          <div class="mono" style="font-size:56px;font-weight:800;letter-spacing:-0.04em;color:var(--bw-ink)">
            <span class="text-bw-ink-3">Rp </span>{{ formattedAmount() }}
          </div>
          <!-- Hidden input for keyboard entry -->
          <input type="text" inputmode="numeric" class="sr-only"
            [value]="rawAmount()" (input)="onAmountInput($event)" />
          <div class="flex gap-2 justify-center mt-8 flex-wrap">
            @for (q of quickAmounts; track q.value) {
              <button type="button" class="quick-chip" [class.sel]="rawAmount() === q.value"
                      (click)="rawAmount.set(q.value)">{{ q.label }}</button>
            }
          </div>
        </div>

        <!-- Details -->
        <div class="bw-card" style="padding:24px">
          <div class="grid gap-4" style="grid-template-columns:1fr 1fr">

            <div style="grid-column:1/-1">
              <label class="bw-label">Judul</label>
              <input class="bw-input" placeholder="Contoh: Makan di restoran"
                     [formControl]="form.controls.title" />
            </div>

            <div style="grid-column:1/-1">
              <label class="bw-label">Kategori</label>
              <div class="flex gap-2 flex-wrap">
                @for (c of categories; track c.id) {
                  <button type="button" class="cat-chip" [class.sel]="selectedCategory() === c.id"
                          (click)="selectedCategory.set(c.id)">
                    @if (c.icon === 'utensils') { <svg lucideUtensils class="w-3.5 h-3.5"></svg> }
                    @else if (c.icon === 'coffee') { <svg lucideCoffee class="w-3.5 h-3.5"></svg> }
                    @else if (c.icon === 'car') { <svg lucideCar class="w-3.5 h-3.5"></svg> }
                    @else if (c.icon === 'bag') { <svg lucideShoppingBag class="w-3.5 h-3.5"></svg> }
                    @else if (c.icon === 'film') { <svg lucideFilm class="w-3.5 h-3.5"></svg> }
                    @else if (c.icon === 'gift') { <svg lucideGift class="w-3.5 h-3.5"></svg> }
                    @else { <svg lucideFlag class="w-3.5 h-3.5"></svg> }
                    {{ c.label }}
                  </button>
                }
              </div>
            </div>

            <div>
              <label class="bw-label">Tanggal</label>
              <input class="bw-input" type="datetime-local" [formControl]="form.controls.date" />
            </div>

            <div>
              <label class="bw-label">Catatan <span class="text-bw-ink-3 font-normal">(opsional)</span></label>
              <input class="bw-input" placeholder="Misal: bayar patungan…"
                     [formControl]="form.controls.description" />
            </div>

          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2.5">
          <button type="button" (click)="handleSubmit(true)"
            class="flex-1 flex items-center justify-center py-3.5 rounded-[12px] border border-bw-border-strong text-bw-ink text-[14px] font-semibold hover:bg-bw-sunken transition cursor-pointer">
            Simpan & catat lagi
          </button>
          <button type="button" (click)="handleSubmit(false)" [disabled]="saving()"
            class="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-[12px] bg-bw-ink text-bw-on-ink text-[14px] font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-50">
            <svg lucideCheck class="w-4 h-4 shrink-0"></svg>
            {{ saving() ? 'Menyimpan…' : 'Simpan transaksi' }}
          </button>
        </div>
        <p class="text-[12px] text-bw-ink-3 text-center">
          💡 Tip: tekan
          <kbd class="px-1.5 py-0.5 rounded-[4px] bg-bw-sunken font-mono text-[11px]">⌘ + Enter</kbd>
          untuk simpan cepat
        </p>

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

  onAmountInput(e: Event) {
    const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '');
    this.rawAmount.set(raw ? Math.min(Number(raw), 999_999_999) : 0);
  }

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

  private todayISO(): string {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }
}
