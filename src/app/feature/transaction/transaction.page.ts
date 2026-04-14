import { Component, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../../shared/header.component";
import { Router } from "@angular/router";
import { UserRecordsService } from "../../core/service/user/user-records.service";
import { UserRecord } from "../../core/service/types/user_record";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    standalone: true,
    imports: [HeaderComponent, CommonModule],
    template: `
        <app-header></app-header>
        <div class="relative w-full flex flex-col items-center min-h-[880px] pb-24">
            <p class="text-xl font-bold mt-12 mb-6">Grafik Pengeluaran</p>
            
            @if (record && recordByType.length > 0) {
                <div class="flex flex-col items-center w-full max-w-md px-4">
                    <div 
                        class="w-64 h-64 rounded-full shadow-lg border-4 border-white"
                        [ngStyle]="{'background': pieChartStyle}">
                    </div>

                    <div class="mt-6 w-full grid grid-cols-2 gap-4">
                        @for (item of recordByType; track item.type) {
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 rounded-full" [ngStyle]="{'background-color': item.color}"></div>
                                <div class="text-sm">
                                    <p class="font-semibold">{{ item.type }}</p>
                                    <p class="text-gray-600">{{ item.amount | currency:'IDR':'symbol-narrow':'1.0-0' }} ({{ item.percentage | number:'1.0-1' }}%)</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            } @else {
                <p class="text-gray-500 mt-4">Belum ada data pengeluaran.</p>
            }

            <p class="text-xl font-bold mt-12 mb-4">Semua Target Record</p>
            
            @if (record) {
                <div class="w-full max-w-lg px-4 flex flex-col space-y-6">

                    <div>
                        <h2 class="font-bold text-red-500 border-b pb-1 mb-3">Pengeluaran</h2>
                        @for (exp of record.expenses || []; track exp.id) {
                            <div class="flex justify-between items-center bg-gray-50 p-3 rounded shadow-sm mb-2">
                                <div>
                                    <p class="font-semibold">{{ exp.title }}</p>
                                    <p class="text-xs text-gray-500">{{ exp.type }} - {{ exp.description }}</p>
                                </div>
                                <p class="text-red-500 font-bold">-{{ exp.amount | currency:'IDR':'symbol-narrow':'1.0-0' }}</p>
                            </div>
                        } @empty {
                            <p class="text-sm text-gray-500">Tidak ada pengeluaran</p>
                        }
                    </div>

                    <div>
                        <h2 class="font-bold text-green-500 border-b pb-1 mb-3">Pemasukkan</h2>
                        @for (inc of record.incomes || []; track inc.id) {
                            <div class="flex justify-between items-center bg-gray-50 p-3 rounded shadow-sm mb-2">
                                <div>
                                    <p class="font-semibold">{{ inc.title }}</p>
                                    <p class="text-xs text-gray-500">{{ inc.type }} - {{ inc.description }}</p>
                                </div>
                                <p class="text-green-500 font-bold">+{{ inc.amount | currency:'IDR':'symbol-narrow':'1.0-0' }}</p>
                            </div>
                        } @empty {
                            <p class="text-sm text-gray-500">Tidak ada pemasukkan</p>
                        }
                    </div>

                    <div>
                        <h2 class="font-bold text-orange-500 border-b pb-1 mb-3">Hutang</h2>
                        @for (debt of record.debts || []; track debt.id) {
                            <div class="flex justify-between items-center bg-gray-50 p-3 rounded shadow-sm mb-2">
                                <div>
                                    <p class="font-semibold">{{ debt.title }}</p>
                                    <p class="text-xs text-gray-500">{{ debt.type }} - {{ debt.description }}</p>
                                </div>
                                <p class="text-orange-500 font-bold">{{ debt.amount | currency:'IDR':'symbol-narrow':'1.0-0' }}</p>
                            </div>
                        } @empty {
                            <p class="text-sm text-gray-500">Tidak ada hutang</p>
                        }
                    </div>

                </div>
            }

            <button 
            class="fixed bottom-6 right-6 md:right-12 bg-green-500 w-14 h-14 text-white rounded rounded-full text-3xl cursor-pointer flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-50" 
            (click)="addTransaction()">
                +
            </button>
        </div>
    `
})
export class TransactionPage {
    record: UserRecord | null = null;
    recordByType: { type: string, amount: number, color: string, percentage: number }[] = [];
    pieChartStyle: string = '';

    constructor(
    private router: Router,
    private recordsService: UserRecordsService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef) 
    {
        this.fetchRecords();
    }

    async fetchRecords() {
        try {
            this.record = await this.recordsService.getRecords();
            this.calculateChartData();
            this.cdr.detectChanges();
        } catch (error) {
            this.snackBar.open(error as string, 'Close', {
                duration: 3000,
            });
        }
    }

    calculateChartData() {
        if (!this.record || !this.record.expenses || this.record.expenses.length === 0) {
            this.recordByType = [];
            this.pieChartStyle = '';
            return;
        }
        
        const grouped: { [key: string]: number } = {};
        grouped['expense'] = this.record.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        grouped['income'] = this.record.incomes.reduce((sum, inc) => sum + inc.amount, 0);
        grouped['debt'] = this.record.debts.reduce((sum, debt) => sum + debt.amount, 0);

        const total = Object.values(grouped).reduce((sum, val) => sum + val, 0);
        const colors = ['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
        
        let startPercentage = 0;
        let gradientParts: string[] = [];
        
        this.recordByType = Object.keys(grouped).map((type, index) => {
            const amount = grouped[type];
            const percentage = (amount / total) * 100;
            const endPercentage = startPercentage + percentage;
            const color = colors[index % colors.length];
            
            gradientParts.push(`${color} ${startPercentage}% ${endPercentage}%`);
            startPercentage = endPercentage;
            
            return { type, amount, percentage, color };
        });

        this.pieChartStyle = `conic-gradient(${gradientParts.join(', ')})`;
    }

    addTransaction() {
        this.router.navigate(['/transaction/add']);
    }
}