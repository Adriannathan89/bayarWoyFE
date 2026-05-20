import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import {
  LucideUtensils,
  LucideCoffee,
  LucideCar,
  LucideShoppingBag,
  LucideFilm,
  LucideGift,
  LucideFlag,
} from '@lucide/angular';

@Component({
  selector: 'app-add-transaction-details-form',
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
  ],
  styleUrls: ['./add-transaction.styles.css'],
  template: `
    <div class="bw-card" style="padding:24px">
      <div class="grid gap-4" style="grid-template-columns:1fr 1fr">

        <div style="grid-column:1/-1">
          <label class="bw-label">Judul</label>
          <input class="bw-input-desktop" placeholder="Contoh: Makan di restoran"
                 [formControl]="form.controls.title" />
        </div>

        <div style="grid-column:1/-1">
          <label class="bw-label">Kategori</label>
          <div class="flex gap-2 flex-wrap">
            @for (c of categories; track c.id) {
              <button type="button" class="cat-chip-desktop" [class.sel]="selectedCategory === c.id"
                      (click)="onSelectCategory(c.id)">
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
          <input class="bw-input-desktop" type="datetime-local" [formControl]="form.controls.date" />
        </div>

        <div>
          <label class="bw-label">Catatan <span class="text-bw-ink-3 font-normal">(opsional)</span></label>
          <input class="bw-input-desktop" placeholder="Misal: bayar patungan…"
                 [formControl]="form.controls.description" />
        </div>

      </div>
    </div>
  `,
})
export class AddTransactionDetailsFormComponent {
  @Input() form!: FormGroup;
  @Input() categories: { id: string; label: string; icon: string }[] = [];
  @Input() selectedCategory = 'lainnya';
  @Input() onSelectCategory: (id: string) => void = () => {};
}
