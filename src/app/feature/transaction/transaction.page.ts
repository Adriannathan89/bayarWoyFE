import { Component } from "@angular/core";
import { HeaderComponent } from "../../shared/header.component";
import { Router } from "@angular/router";
import { UserRecordsService } from "../../core/service/user/user-records.service";
import { UserRecord } from "../../core/service/types/user_record";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    standalone: true,
    imports: [HeaderComponent],
    template: `
        <app-header></app-header>
        <div class="relative w-full flex flex-col items-center h-[880px]">
            <p class="text-xl pt-12">My Transactions</p>
            <button 
            class="absolute bottom-6 right-12 bg-green-500 w-14 h-14 text-white rounded rounded-full text-3xl cursor-pointer flex items-center justify-center shadow-md" 
            (click)="addTransaction()">
                +
            </button>
        </div>
    `
})
export class TransactionPage {
    record: UserRecord | null = null;

    constructor(
    private router: Router,
    private recordsService: UserRecordsService,
    private snackBar: MatSnackBar,) 
    {
        this.fetchRecords();
    }

    async fetchRecords() {
        try {
            this.record = await this.recordsService.getRecords();
            console.log(this.record);
        } catch (error) {
            this.snackBar.open(error as string, 'Close', {
                duration: 3000,
            });
        }
    }

    addTransaction() {
        this.router.navigate(['/transaction/add']);
    }
}