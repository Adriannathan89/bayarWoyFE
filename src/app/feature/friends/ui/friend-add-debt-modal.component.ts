import { Component, Inject, signal, computed } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DebtService } from "../../../core/service/debt/debt.service";

export type AddDebtDialogData = {
    friendId: string;
    friendUsername: string;
};

@Component({
    selector: 'app-friend-add-debt-modal',
    standalone: true,
    imports: [ReactiveFormsModule, MatDialogModule],
    template: `
        <div class="p-6 w-[400px] bg-bw-surface rounded-[var(--bw-r-xl)]">
            <h2 class="text-[18px] font-bold text-bw-ink mb-1">Tambah Hutang</h2>
            <p class="text-[13px] text-bw-ink-3 mb-5">kepada <span class="font-semibold text-bw-ink-2">{{ data.friendUsername }}</span></p>

            <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1.5">
                    <label class="text-[13px] font-semibold text-bw-ink-2">Nominal (Rp)</label>
                    <input
                        type="text"
                        inputmode="numeric"
                        [value]="formattedAmount()"
                        (input)="handleAmountInput($event)"
                        placeholder="0"
                        class="w-full px-4 py-2.5 rounded-[var(--bw-r-md)] border border-bw-border bg-bw-elevated text-bw-ink text-[14px] outline-none focus:border-bw-ink transition-colors"
                    />
                    @if (rawAmount() === 0 && amountTouched) {
                        <p class="text-[12px] text-bw-red">Nominal harus lebih dari 0</p>
                    }
                </div>

                <div class="flex flex-col gap-1.5">
                    <label class="text-[13px] font-semibold text-bw-ink-2">Deskripsi</label>
                    <input
                        type="text"
                        formControlName="description"
                        placeholder="Untuk apa..."
                        class="w-full px-4 py-2.5 rounded-[var(--bw-r-md)] border border-bw-border bg-bw-elevated text-bw-ink text-[14px] outline-none focus:border-bw-ink transition-colors"
                    />
                    @if (form.controls.description.invalid && form.controls.description.touched) {
                        <p class="text-[12px] text-bw-red">Deskripsi wajib diisi</p>
                    }
                </div>

                <div class="flex gap-3 justify-end mt-2">
                    <button
                        type="button"
                        class="px-4 py-2 rounded-[var(--bw-r-md)] text-[13px] font-semibold border border-bw-border text-bw-ink-2 cursor-pointer hover:border-bw-ink transition-colors"
                        (click)="dialogRef.close()">
                        Batal
                    </button>
                    <button
                        type="submit"
                        [disabled]="!canSubmit || submitting"
                        class="px-4 py-2 rounded-[var(--bw-r-md)] text-[13px] font-semibold cursor-pointer disabled:opacity-50"
                        style="background:var(--bw-ink);color:var(--bw-on-ink)">
                        {{ submitting ? 'Menyimpan...' : 'Simpan' }}
                    </button>
                </div>
            </form>
        </div>
    `
})
export class FriendAddDebtModalComponent {
    rawAmount = signal(0);
    amountTouched = false;
    submitting = false;
    form;

    formattedAmount = computed(() => {
        const v = this.rawAmount();
        return v === 0 ? '' : new Intl.NumberFormat('id-ID').format(v);
    });

    get canSubmit() {
        return this.rawAmount() > 0 && this.form.controls.description.valid;
    }

    constructor(
        public dialogRef: MatDialogRef<FriendAddDebtModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AddDebtDialogData,
        private fb: FormBuilder,
        private debtService: DebtService,
        private snackBar: MatSnackBar
    ) {
        this.form = this.fb.nonNullable.group({
            description: ['', [Validators.required]],
        });
    }

    handleAmountInput(e: Event) {
        this.amountTouched = true;
        const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '');
        this.rawAmount.set(raw ? Math.min(Number(raw), 999_999_999) : 0);
    }

    async submit() {
        this.amountTouched = true;
        if (!this.canSubmit) return;
        this.submitting = true;
        try {
            const { description } = this.form.getRawValue();
            await this.debtService.createDebt(this.rawAmount(), description, this.data.friendId);
            this.snackBar.open('Hutang berhasil ditambahkan.', 'Tutup', { duration: 3000 });
            this.dialogRef.close('success');
        } catch {
            this.snackBar.open('Gagal menambahkan hutang.', 'Tutup', { duration: 3000 });
            this.submitting = false;
        }
    }
}
