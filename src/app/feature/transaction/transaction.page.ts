import { Component } from "@angular/core";
import { HeaderComponent } from "../../shared/header.component";
import { Router } from "@angular/router";

@Component({
    standalone: true,
    imports: [HeaderComponent],
    template: `
        <app-header></app-header>
        <div class="relative w-full flex flex-col items-center h-[940px]">
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
    constructor(private router: Router) {}

    addTransaction() {
        this.router.navigate(['/transaction/add']);
    }
}