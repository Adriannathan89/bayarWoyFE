import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  LucideArrowUp, LucideArrowDown, LucideUsers, LucideCheck,
  LucideUtensils, LucideCoffee, LucideCar,
  LucideShoppingBag, LucideFilm, LucideGift, LucideFlag,
  LucideDelete,
} from '@lucide/angular';
import { UserRecordsService } from '../../../core/service/user/user-records.service';

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
    ReactiveFormsModule,
    LucideArrowUp, LucideArrowDown, LucideUsers, LucideCheck,
    LucideUtensils, LucideCoffee, LucideCar,
    LucideShoppingBag, LucideFilm, LucideGift, LucideFlag,
    LucideDelete,
  ],
  styles: [`
    :host { display: block; }
    .type-tile {
      flex: 1; padding: 12px 8px; border-radius: 12px;
      border: 1px solid var(--bw-border); background: var(--bw-surface);
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      cursor: pointer; transition: background 0.12s, border-color 0.12s;
    }
    .type-tile.sel { background: var(--bw-ink); border-color: var(--bw-ink); color: var(--bw-on-ink); }
    .numpad-btn {
      aspect-ratio: 1; border-radius: 14px;
      background: var(--bw-elevated); color: var(--bw-ink);
      font-size: 22px; font-weight: 600;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: background 0.1s, transform 0.08s;
      border: none; font-family: var(--bw-font-mono);
      letter-spacing: -0.02em;
    }
    .numpad-btn:active { transform: scale(0.93); background: var(--bw-border); }
    .numpad-del { background: var(--bw-sunken); }
    .cat-chip {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 7px 12px; border-radius: 999px; font-size: 13px; font-weight: 600;
      background: var(--bw-elevated); color: var(--bw-ink-2);
      cursor: pointer; flex-shrink: 0;
      transition: background 0.12s, color 0.12s;
    }
    .cat-chip.sel { background: var(--bw-ink); color: var(--bw-lime); }
    .bw-input {
      width: 100%; font-family: inherit; font-size: 15px;
      padding: 14px 16px; border-radius: 12px;
      background: var(--bw-elevated); color: var(--bw-ink);
      border: 1px solid var(--bw-border); outline: none;
      transition: border-color .12s, background .12s;
    }
    .bw-input:focus { border-color: var(--bw-ink); background: var(--bw-surface); }
    .bw-input::placeholder { color: var(--bw-ink-3); }
    .bw-label { font-size: 13px; font-weight: 600; color: var(--bw-ink-2); margin-bottom: 8px; display: block; }
  `],
  template: `
    <div class="flex flex-col h-full">

      <!-- ─ Phase 1: Type + Amount + Numpad ─ -->
      @if (phase === 1) {
        <div class="flex flex-col gap-4 px-5 pt-3 pb-4 animate-fade-in">

          <!-- Type selector -->
          <div class="flex gap-2">
            @for (t of txTypes; track t.id) {
              <button type="button" class="type-tile" [class.sel]="selectedType() === t.id"
                      (click)="selectedType.set(t.id)">
                <div class="w-8 h-8 rounded-[8px] flex items-center justify-center"
                     [style.background]="selectedType() === t.id ? t.accent : 'var(--bw-sunken)'"
                     [style.color]="selectedType() === t.id ? 'var(--bw-ink)' : t.accent">
                  @if (t.id === 'expense') {
                    <svg lucideArrowUp class="w-4 h-4" style="stroke-width:2.4"></svg>
                  } @else if (t.id === 'income') {
                    <svg lucideArrowDown class="w-4 h-4" style="stroke-width:2.4"></svg>
                  } @else {
                    <svg lucideUsers class="w-4 h-4" style="stroke-width:2.4"></svg>
                  }
                </div>
                <span class="text-[12px] font-bold leading-tight text-center"
                      [style.color]="selectedType() === t.id ? 'var(--bw-on-ink)' : 'var(--bw-ink-2)'">
                  {{ t.label }}
                </span>
              </button>
            }
          </div>

          <!-- Amount display -->
          <div class="text-center py-4">
            <div class="text-[11px] font-semibold uppercase tracking-[0.1em] text-bw-ink-3 mb-2">Jumlah</div>
            <div class="mono leading-none" style="font-size:52px;font-weight:800;letter-spacing:-0.04em;color:var(--bw-ink)">
              <span class="text-bw-ink-3" style="font-size:28px">Rp </span>{{ formattedAmount() }}
            </div>
          </div>

          <!-- Numpad -->
          <div class="grid grid-cols-3 gap-2.5 px-2">
            @for (n of [1,2,3,4,5,6,7,8,9]; track n) {
              <button type="button" class="numpad-btn" (click)="pressNum(n.toString())">{{ n }}</button>
            }
            <button type="button" class="numpad-btn" (click)="pressNum('000')">000</button>
            <button type="button" class="numpad-btn" (click)="pressNum('0')">0</button>
            <button type="button" class="numpad-btn numpad-del" (click)="pressNum('del')">
              <svg lucideDelete class="w-5 h-5" style="stroke-width:1.8"></svg>
            </button>
          </div>

          <!-- Next -->
          <button type="button" (click)="goToPhase2()"
            class="mx-2 py-4 rounded-[12px] bg-bw-ink text-bw-on-ink text-[15px] font-semibold cursor-pointer hover:opacity-90 transition">
            Lanjutkan →
          </button>

        </div>
      }

      <!-- ─ Phase 2: Details ─ -->
      @if (phase === 2) {
        <div class="flex flex-col gap-4 px-5 pt-3 pb-6 animate-fade-slide-up">

          <!-- Amount recap -->
          <div class="flex items-center justify-between py-3 px-4 rounded-[12px]"
               style="background:var(--bw-elevated)">
            <div>
              <div class="text-[11px] font-semibold uppercase tracking-wider text-bw-ink-3">{{ typeLabel() }}</div>
              <div class="mono text-[22px] font-bold text-bw-ink leading-tight">
                Rp {{ formattedAmount() }}
              </div>
            </div>
            <button type="button" (click)="phase = 1"
              class="text-[13px] font-semibold text-bw-ink-3 hover:text-bw-ink cursor-pointer px-3 py-1.5 rounded-[8px] hover:bg-bw-sunken transition">
              ← Ubah
            </button>
          </div>

          <!-- Judul -->
          <div>
            <label class="bw-label">Judul</label>
            <input class="bw-input" placeholder="Contoh: Makan siang"
                   [formControl]="form.controls.title" />
          </div>

          <!-- Kategori -->
          <div>
            <label class="bw-label">Kategori</label>
            <div class="flex gap-2 overflow-x-auto pb-1" style="scrollbar-width:none">
              @for (c of categories; track c.id) {
                <button type="button" class="cat-chip" [class.sel]="selectedCategory() === c.id"
                        (click)="selectedCategory.set(c.id)">
                  @if (c.icon === 'utensils') { <svg lucideUtensils class="w-3 h-3"></svg> }
                  @else if (c.icon === 'coffee') { <svg lucideCoffee class="w-3 h-3"></svg> }
                  @else if (c.icon === 'car') { <svg lucideCar class="w-3 h-3"></svg> }
                  @else if (c.icon === 'bag') { <svg lucideShoppingBag class="w-3 h-3"></svg> }
                  @else if (c.icon === 'film') { <svg lucideFilm class="w-3 h-3"></svg> }
                  @else if (c.icon === 'gift') { <svg lucideGift class="w-3 h-3"></svg> }
                  @else { <svg lucideFlag class="w-3 h-3"></svg> }
                  {{ c.label }}
                </button>
              }
            </div>
          </div>

          <!-- Tanggal -->
          <div>
            <label class="bw-label">Tanggal</label>
            <input class="bw-input" type="date" [formControl]="form.controls.date" />
          </div>

          <!-- Catatan -->
          <div>
            <label class="bw-label">Catatan <span class="text-bw-ink-3 font-normal">(opsional)</span></label>
            <input class="bw-input" placeholder="Tambahkan catatan…"
                   [formControl]="form.controls.description" />
          </div>

          <!-- Save -->
          <button type="button" (click)="handleSubmit()" [disabled]="saving()"
            class="flex items-center justify-center gap-2 py-4 rounded-[12px] bg-bw-ink text-bw-on-ink text-[15px] font-semibold cursor-pointer hover:opacity-90 transition disabled:opacity-50 mt-2">
            <svg lucideCheck class="w-5 h-5 shrink-0"></svg>
            {{ saving() ? 'Menyimpan…' : 'Simpan Transaksi' }}
          </button>
          <button type="button" (click)="goBack()"
            class="py-3 rounded-[12px] border border-bw-border text-bw-ink-2 text-[14px] font-semibold cursor-pointer hover:bg-bw-sunken transition">
            Batal
          </button>

        </div>
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
    { id: 'income'  as TxType, label: 'Pemasukan',   accent: 'var(--bw-green)' },
    { id: 'expense' as TxType, label: 'Pengeluaran', accent: 'var(--bw-red)' },
    { id: 'debt'    as TxType, label: 'Hutang',      accent: 'var(--bw-amber)' },
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

  pressNum(key: string) {
    if (key === 'del') {
      const s = String(this.rawAmount()).slice(0, -1);
      this.rawAmount.set(s ? Number(s) : 0);
      return;
    }
    const current = this.rawAmount() === 0 ? '' : String(this.rawAmount());
    const next = Number(current + key);
    if (next > 999_999_999) return;
    this.rawAmount.set(next);
  }

  goToPhase2() {
    if (this.rawAmount() === 0) {
      this.snackBar.open('Masukkan jumlah terlebih dahulu.', 'Tutup', { duration: 2000 });
      return;
    }
    this.phase = 2;
  }

  async handleSubmit() {
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
  }

  goBack() { this.router.navigate(['/transaction']); }

  private todayDate(): string {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }
}
