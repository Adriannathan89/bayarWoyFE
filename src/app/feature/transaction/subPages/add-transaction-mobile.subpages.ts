import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { UserRecordsService } from "../../../core/service/user/user-records.service";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";

@Component({
    standalone: true,
    selector: 'app-add-transaction-mobile',
    imports: [ReactiveFormsModule, CommonModule],
    template: `
        <div class="w-full h-full flex flex-col bg-background-color rounded-lg shadow-lg">
            <div class="bg-card-color text-white px-6 py-6 flex items-center justify-between shadow-lg">
                <div>
                    <h1 class="text-2xl font-bold">Transaksi Baru</h1>
                    <p class="opacity-75 text-sm">{{ phase_1 ? 'Masukkan Jumlah' : 'Detail Transaksi' }}</p>
                </div>
                <button type="button" *ngIf="!phase_1" (click)="nextPhase()" class="bg-card-color hover:opacity-80 p-2 rounded-full transition text-white">
                    ←
                </button>
            </div>

            <form
                [formGroup]="transactionForm"
                class="flex-1 flex flex-col overflow-y-auto p-6"
                (ngSubmit)="handleSubmit()"
            > 
                <div *ngIf="phase_1" class="flex flex-col h-full">
                    <div class="bg-primary-color rounded-xl shadow-md p-6 mb-6">
                        <p class="text-text-color text-sm mb-2">Jumlah</p>
                        <p class="text-5xl font-bold text-card-color">{{ transactionForm.get('amount')?.value || '0' }}</p>
                    </div>

                    <div class="flex flex flex-col justify-center pt-12">
                        <div class="grid grid-cols-3 gap-3">
                            <button type="button" *ngFor="let num of [1,2,3,4,5,6,7,8,9]" 
                                (click)="clickNumber(num.toString())"
                                class="bg-primary-color hover:bg-[var(--secondary-color)] cursor-pointer text-text-color font-bold py-6 px-4 rounded-lg shadow-md active:shadow-inner transition text-2xl">
                                {{ num }}
                            </button>
                            <button type="button" (click)="clickNumber('.')" 
                                class="bg-primary-color hover:bg-[var(--secondary-color)] cursor-pointer text-text-color font-bold py-6 px-4 rounded-lg shadow-md active:shadow-inner transition text-2xl">
                                .
                            </button>
                            <button type="button" (click)="clickNumber('0')" 
                                class="bg-primary-color hover:bg-[var(--secondary-color)] cursor-pointer text-text-color font-bold py-6 px-4 rounded-lg shadow-md active:shadow-inner transition text-2xl">
                                0
                            </button>
                            <button type="button" (click)="clickNumber('Del')" 
                                class="hover:bg-[var(--secondary-color)] bg-primary-color cursor-pointer text-text-color font-bold py-6 px-4 rounded-lg shadow-md active:shadow-inner transition text-2xl">
                                ←
                            </button>
                        </div>
                    </div>

                    <button type="button" (click)="nextPhase()" 
                        class="w-full mt-12 bg-card-color hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition">
                        Lanjutkan
                    </button>
                </div>

                <!-- Phase 2: Details Form -->
                <div *ngIf="!phase_1" class="flex flex-col gap-4">
                    <!-- Title -->
                    <div class="bg-primary-color rounded-xl p-4 shadow-md">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Judul Transaksi</label>
                        <input 
                            type="text"
                            placeholder="Contoh: Makan Siang"
                            class="w-full rounded-lg p-3 border-2 border-secondary-color focus:border-blue-500 focus:outline-none transition" 
                            formControlName="title" />
                    </div>

                    <div class="bg-primary-color rounded-xl p-4 shadow-md">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Tipe Transaksi</label>
                        <select class="w-full rounded-lg p-3 border-2 border-secondary-color focus:border-blue-500 focus:outline-none transition" formControlName="type">
                            <option class="bg-primary-color" value="" disabled selected>Pilih tipe</option>
                            <option class="bg-primary-color" value="expense">Pengeluaran</option>
                            <option class="bg-primary-color" value="income">Pemasukkan</option>
                        </select>
                    </div>

                    <div class="bg-primary-color rounded-xl p-4 shadow-md">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Deskripsi (Opsional)</label>
                        <textarea 
                            placeholder="Tambahkan catatan"
                            class="w-full rounded-lg p-3 border-2 border-secondary-color focus:border-blue-500 focus:outline-none transition" 
                            rows="3" 
                            formControlName="description"></textarea>
                    </div>

                    <div class="bg-primary-color rounded-xl p-4 shadow-md">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Orang yang Berhutang</label>
                        <select class="w-full rounded-lg p-3 border-2 border-secondary-color focus:border-blue-500 focus:outline-none transition" formControlName="debtor">
                            <option value="" selected>Pilih teman</option>
                        </select>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button type="submit" class="flex-1 bg-card-color hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition">
                            Simpan Transaksi
                        </button>
                        <button type="button" (click)="goBack()" class="flex-1 bg-primary-color hover:opacity-80 text-text-color font-bold py-3 px-4 rounded-lg transition border border-secondary-color">
                            Batal
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class AddTransactionMobileSubPage {
    transactionForm;
    phase_1: boolean = true;

    constructor(private fb: FormBuilder, private router: Router, private recordsService: UserRecordsService, private cdr: ChangeDetectorRef) {
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

    nextPhase() {
        this.phase_1 = !this.phase_1;
        this.cdr.detectChanges();
    }

    handleSubmit() {
        if (this.transactionForm.valid) {
            const { title, amount, description, debtor, type } = this.transactionForm.value;

            const formatedAmount = parseInt(amount!.replace(/\,/g, ''), 10);
            if (!debtor && this.transactionForm.valid) {
                this.recordsService.createRecord(title!, description!, formatedAmount, type!).then(() => {
                    this.router.navigate(['/transaction']);
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

    clickNumber(num: string) {
        const currentValue = this.transactionForm.get('amount')?.value || '';
        if (num === 'Del') {
            this.transactionForm.get('amount')?.setValue(currentValue.slice(0, -1));
        } else {
            this.transactionForm.get('amount')?.setValue(currentValue + num);
        }
        let value = this.transactionForm.get('amount')?.value || '';
        value = value.replace(/^0+(?=\d)/, "").replace(/\D/g, "");
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.transactionForm.get('amount')?.setValue(value);
    }

    goBack() {
        this.router.navigate(['/transaction']);
    }
}
