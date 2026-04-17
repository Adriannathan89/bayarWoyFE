import { Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormBuilder, Validators } from "@angular/forms";
import { UserRecordsService } from "../../../core/service/user/user-records.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    standalone: true,
    selector: 'app-add-transaction-desktop',
    imports: [ReactiveFormsModule, CommonModule],
    template: `
        <div class="w-full flex items-center justify-center p-6">
            <div class="w-full max-w-5xl">
                <div class="bg-background-color rounded-3xl shadow-xl border-1 border-secondary-color">
                    <form [formGroup]="transactionForm" class="p-12" (ngSubmit)="handleSubmit()">
                        <div class="mb-10">
                            <div class="flex items-center mb-6">
                                <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-card-color rounded-lg">
                                    <span class="text-xl font-bold text-white">1</span>
                                </div>
                                <h2 class="text-2xl font-bold text-text-color ml-4">Informasi Dasar</h2>
                            </div>
                            <div class="grid grid-cols-3 gap-8 bg-primary-color rounded-2xl p-8 border border-secondary-color">
                                <div class="col-span-3">
                                    <label class="block text-sm font-semibold text-text-color mb-3">Judul Transaksi</label>
                                    <input type="text" placeholder="Contoh: Makan di restoran" class="w-full rounded-xl p-4 border-2 border-secondary-color focus:border-secondary-color focus:outline-none transition text-base bg-background-color text-text-color" formControlName="title" />
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-text-color mb-3">Tipe</label>
                                    <select class="w-full rounded-xl p-4 border-2 border-secondary-color focus:border-secondary-color focus:outline-none transition text-base bg-background-color text-text-color" formControlName="type">
                                        <option class="bg-primary-color text-text-color" value="" selected>Pilih tipe</option>
                                        <option class="bg-primary-color text-text-color" value="expense">📉 Pengeluaran</option>
                                        <option class="bg-primary-color text-text-color" value="income">📈 Pemasukkan</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-text-color mb-3">Jumlah (Rp)</label>
                                    <input type="text" placeholder="0" (input)="formatAmount($event)" class="w-full rounded-xl p-4 border-2 border-secondary-color focus:border-secondary-color focus:outline-none transition text-base bg-background-color text-text-color" formControlName="amount" />
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-text-color mb-3">Kategori</label>
                                    <select class="w-full rounded-xl p-4 border-2 border-secondary-color focus:border-secondary-color focus:outline-none transition text-base bg-background-color text-text-color" formControlName="debtor">
                                        <option class="bg-primary-color text-text-color" value="">Pilih kategori</option>
                                        <option class="bg-primary-color text-text-color" value="makanan">🍔 Makanan</option>
                                        <option class="bg-primary-color text-text-color" value="transport">🚗 Transport</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="mb-10">
                            <div class="flex items-center mb-6">
                                <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-card-color rounded-lg">
                                    <span class="text-xl font-bold text-white">2</span>
                                </div>
                                <h2 class="text-2xl font-bold text-text-color ml-4">Detail & Catatan</h2>
                            </div>
                            <div class="bg-primary-color rounded-2xl p-8 border border-secondary-color">
                                <label class="block text-sm font-semibold text-text-color mb-3">Deskripsi</label>
                                <textarea placeholder="Catatan detail transaksi" class="w-full rounded-xl p-4 border-2 border-secondary-color focus:border-secondary-color focus:outline-none transition text-base bg-background-color text-text-color" rows="5" formControlName="description"></textarea>
                            </div>
                        </div>
                        <div class="bg-primary-color rounded-2xl p-8 mb-10 border-2 border-secondary-color">
                            <h3 class="text-lg font-semibold text-text-color mb-4">📊 Ringkasan</h3>
                            <div class="grid grid-cols-3 gap-6">
                                <div class="bg-primary-color rounded-xl p-4 shadow-sm">
                                    <p class="text-secondary-color text-sm mb-1">Tipe</p>
                                    <p class="text-2xl font-bold text-card-color">{{ transactionForm.get('type')?.value?.toUpperCase() || '-' }}</p>
                                </div>
                                <div class="bg-primary-color rounded-xl p-4 shadow-sm">
                                    <p class="text-secondary-color text-sm mb-1">Jumlah</p>
                                    <p class="text-2xl font-bold text-card-color">Rp {{ transactionForm.get('amount')?.value || '0' }}</p>
                                </div>
                                <div class="bg-primary-color rounded-xl p-4 shadow-sm">
                                    <p class="text-secondary-color text-sm mb-1">Status</p>
                                    <p class="text-2xl font-bold" [ngClass]="transactionForm.valid ? 'text-card-color' : 'text-secondary-color'">{{ transactionForm.valid ? '✓ Siap' : '⚠ Belum' }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-4 pt-8 border-t-2 border-secondary-color">
                            <button type="submit" [disabled]="!transactionForm.valid" class="flex-1 cursor-pointer rounded-xl bg-card-color hover:opacity-90 disabled:opacity-50 px-8 py-4 font-semibold text-white text-lg transition shadow-lg">
                                ✓ Tambah Transaksi
                            </button>
                            <button type="button" (click)="goBack()" class="flex-1 cursor-pointer rounded-xl bg-primary-color hover:opacity-80 px-8 py-4 font-semibold text-text-color text-lg transition border border-secondary-color">
                                ✕ Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `

})
export class AddTransactionDesktopSubPage {
    transactionForm;

    constructor(
        private fb: FormBuilder, 
        private router: Router, private recordsService: UserRecordsService,
        private snackBar: MatSnackBar
        ) {
        this.transactionForm = this.fb.group({
            title: ['', Validators.required],
            amount: ['', [Validators.required, Validators.min(0)]],
            description: ['', Validators.required],
            debtor: [''],
            type: ['', Validators.required]
        });

        this.transactionForm.get('amount')?.valueChanges.subscribe(value => {

        });
    }

    handleSubmit() {
        if (this.transactionForm.valid) {
            const { title, amount, description, debtor, type } = this.transactionForm.value;

            const formatedAmount = parseInt(amount!.replace(/\,/g, ''), 10);
            if (!debtor && this.transactionForm.valid) {
                this.recordsService.createRecord(title!, description!, formatedAmount, type!).then(() => {
                    this.router.navigate(['/transaction']);
                }).catch(err => {
                    this.snackBar.open('Gagal menambahkan transaksi. Silakan coba lagi.', 'Tutup', { duration: 3000 });
                });
            }
        }
    }

    formatAmount(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/^0+(?=\d)/, "").replace(/\D/g, "");


        const numericValue = parseInt(value, 10);

        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        input.value = value;
    }

    goBack() {
        this.router.navigate(['/transaction']);
    }
}