import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import {
  LucideUtensils,
  LucideCoffee,
  LucideCar,
  LucideShoppingBag,
  LucideFilm,
  LucideGift,
  LucideFlag,
  LucideCheck,
} from '@lucide/angular';

@Component({
  selector: 'app-add-transaction-mobile-phase2',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideUtensils,
    LucideCoffee,
    LucideCar,
    LucideShoppingBag,
    LucideFilm,
    LucideGift,
    LucideFlag,
    LucideCheck,
  ],
  styleUrls: ['./add-transaction.styles.css'],
  template: `
    <div class="flex flex-col gap-4 px-5 pt-3 pb-6 animate-fade-slide-up">

      <div class="flex items-center justify-between py-3 px-4 rounded-[12px]"
           style="background:var(--bw-elevated)">
        <div>
          <div class="text-[11px] font-semibold uppercase tracking-wider text-bw-ink-3">{{ typeLabel }}</div>
          <div class="mono text-[22px] font-bold text-bw-ink leading-tight">
            Rp {{ formattedAmount }}
          </div>
        </div>
        <button type="button" (click)="onEditAmount()"
          class="text-[13px] font-semibold text-bw-ink-3 hover:text-bw-ink cursor-pointer px-3 py-1.5 rounded-[8px] hover:bg-bw-sunken transition">
          ← Ubah
        </button>
      </div>

      <div>
        <label class="bw-label">Judul</label>
         <input class="bw-input-mobile" placeholder="Contoh: Makan siang"
           [formControl]="control('title')" />
      </div>

      <div>
        <label class="bw-label">Kategori</label>
        <div class="flex gap-2 overflow-x-auto pb-1" style="scrollbar-width:none">
          @for (c of categories; track c.id) {
            <button type="button" class="cat-chip-mobile" [class.sel]="selectedCategory === c.id"
                    (click)="onSelectCategory(c.id)">
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

      <div>
        <label class="bw-label">Tanggal</label>
        <input class="bw-input-mobile" type="date" [formControl]="control('date')" />
      </div>

      <div>
        <label class="bw-label">Catatan <span class="text-bw-ink-3 font-normal">(opsional)</span></label>
         <input class="bw-input-mobile" placeholder="Tambahkan catatan…"
           [formControl]="control('description')" />
      </div>

      <button type="button" (click)="onSubmit()" [disabled]="saving"
        class="flex items-center justify-center gap-2 py-4 rounded-[12px] bg-bw-ink text-bw-on-ink text-[15px] font-semibold cursor-pointer hover:opacity-90 transition disabled:opacity-50 mt-2">
        <svg lucideCheck class="w-5 h-5 shrink-0"></svg>
        {{ saving ? 'Menyimpan…' : 'Simpan Transaksi' }}
      </button>
      <button type="button" (click)="onCancel()"
        class="py-3 rounded-[12px] border border-bw-border text-bw-ink-2 text-[14px] font-semibold cursor-pointer hover:bg-bw-sunken transition">
        Batal
      </button>

    </div>
  `,
})
export class AddTransactionMobilePhase2Component {
  @Input() typeLabel = '';
  @Input() formattedAmount = '0';
  @Input() form!: FormGroup;
  @Input() categories: { id: string; label: string; icon: string }[] = [];
  @Input() selectedCategory = 'lainnya';
  @Input() saving = false;
  @Input() onEditAmount: () => void = () => {};
  @Input() onSelectCategory: (id: string) => void = () => {};
  @Input() onSubmit: () => void = () => {};
  @Input() onCancel: () => void = () => {};

  control(name: 'title' | 'date' | 'description'): FormControl {
    return this.form.get(name) as FormControl;
  }
}
