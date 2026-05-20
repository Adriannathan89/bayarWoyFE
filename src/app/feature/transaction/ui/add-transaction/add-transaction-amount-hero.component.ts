import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-transaction-amount-hero',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./add-transaction.styles.css'],
  template: `
    <div class="bw-card text-center" style="padding:28px;background:var(--bw-elevated)">
      <div class="text-[12px] font-semibold uppercase tracking-[0.1em] text-bw-ink-3 mb-2">Jumlah</div>
      <div class="mono" style="font-size:56px;font-weight:800;letter-spacing:-0.04em;color:var(--bw-ink)">
        <span class="text-bw-ink-3">Rp </span>{{ formattedAmount }}
      </div>
      <input type="text" inputmode="numeric" class="sr-only"
        [value]="rawAmount" (input)="onAmountInput($event)" />
      <div class="flex gap-2 justify-center mt-8 flex-wrap">
        @for (q of quickAmounts; track q.value) {
          <button type="button" class="quick-chip" [class.sel]="rawAmount === q.value"
                  (click)="onQuickSelect(q.value)">{{ q.label }}</button>
        }
      </div>
    </div>
  `,
})
export class AddTransactionAmountHeroComponent {
  @Input() formattedAmount = '0';
  @Input() rawAmount = 0;
  @Input() quickAmounts: { label: string; value: number }[] = [];
  @Input() onAmountInput: (event: Event) => void = () => {};
  @Input() onQuickSelect: (value: number) => void = () => {};
}
