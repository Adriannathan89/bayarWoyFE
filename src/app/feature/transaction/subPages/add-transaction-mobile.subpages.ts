import { Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { UserRecordsService } from "../../../core/service/user/user-records.service";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";

@Component({
    standalone: true,
    selector: 'app-add-transaction-mobile',
    imports: [ReactiveFormsModule],
    template: `
        <div class="w-full h-full pt-12text-card-color p-4 flex flex-col items-center">
            <form
                [formGroup]="transactionForm"
                class="w-full flex flex-col gap-6 mt-8"
                (ngSubmit)="handleSubmit()"
            >   
                <div [hidden]="phase_1" class="w-full flex items-center gap-4">
                    <button type="button" class="cursor-pointer border-b-2 hover:border-[white] border-transparent text-xl" (click)="nextPhase()" aria-label="Back">
                        &larr;
                    </button>
                </div>
                <div [hidden]="phase_1" class="flex flex-col gap-[8px]">
                        <p>Transaction: </p>
                        <input 
                        type="text"
                        class="w-full rounded-xl p-2 border border-secondary-color focus:outline-none" formControlName="title" />
                    </div>

                    <div [hidden]="phase_1" class="flex flex-col gap-[8px]">
                        <p>Description:</p>
                        <textarea 
                        class="w-full rounded-xl p-2 border border-secondary-color focus:outline-none" rows="4" formControlName="description"></textarea>
                    </div>

                    <div [hidden]="phase_1" class="flex flex-col gap-[8px]">
                        <p>Debtor:</p>
                        <select class="w-full rounded-xl p-2 border border-secondary-color focus:outline-none" formControlName="debtor">
                            <option value="" disabled selected>Select a friend</option>
                            <!-- Options will be populated dynamically -->
                        </select>
                    </div>

                <div [hidden]="phase_1" class="flex flex-col gap-[8px]">
                    <p>Type:</p>
                    <select class="w-full rounded-xl p-2 border border-secondary-color focus:outline-none" formControlName="type">
                        <option value="" selected class="bg-secondary-color text-white">Select transaction type</option>
                        <option value="income" class="bg-secondary-color text-white">Income</option>
                        <option value="expense" class="bg-secondary-color text-white">Expense</option>
                    </select>
                </div>


                <div [hidden]="!phase_1" class="flex flex-col gap-[8px]">
                    <p>Amount:</p>
                <input
                    type="text"
                    class="w-full rounded-xl p-2 border border-secondary-color focus:outline-none" formControlName="amount"
                    (input)=formatAmount($event)
                /> 
                </div>

            <div [hidden]="!phase_1" class="w-full h-[500px] h-[700px] flex-col">
                <div class="flex flex-col gap-2 w-full h-[500px] mt-10">
                    <div class="flex gap-[8px] h-1/4 text-xl">
                        <div 
                        class="w-1/3 flex items-center justify-center bg-primary-color text-text-color cursor-pointer" 
                        (click)="clickNumber('1')">1</div>
                        <div 
                        class="w-1/3 flex items-center justify-center bg-primary-color text-text-color cursor-pointer" 
                        (click)="clickNumber('2')">2</div>
                        <div 
                        class="w-1/3 flex items-center justify-center bg-primary-color text-text-color cursor-pointer" 
                        (click)="clickNumber('3')">3</div>
                    </div>
                    <div class="flex gap-[8px] h-1/4 text-xl">
                        <div 
                        class="w-1/3 flex items-center justify-center bg-primary-color text-text-color cursor-pointer" 
                        (click)="clickNumber('4')">4</div>
                        <div 
                        class="w-1/3 flex items-center justify-center bg-primary-color text-text-color cursor-pointer" 
                        (click)="clickNumber('5')">5</div>
                        <div 
                        class="w-1/3 flex items-center justify-center bg-primary-color text-text-color cursor-pointer" 
                        (click)="clickNumber('6')">6</div>
                    </div>
                    <div class="flex gap-[8px] h-1/4 text-xl">
                        <div 
                        class="w-1/3 flex items-center justify-center bg-primary-color text-text-color cursor-pointer" 
                        (click)="clickNumber('7')">7</div>
                        <div 
                        class="w-1/3 flex items-center justify-center bg-primary-color text-text-color cursor-pointer" 
                        (click)="clickNumber('8')">8</div>
                        <div 
                        class="w-1/3 flex items-center justify-center bg-primary-color text-text-color cursor-pointer" 
                        (click)="clickNumber('9')">9</div>
                    </div>
                    <div class="flex gap-[8px] h-1/4 text-xl">
                        <div 
                        class="w-1/3 flex items-center justify-center bg-primary-color text-text-color cursor-pointer" 
                        (click)="clickNumber('.')">.</div>
                        <div 
                        class="w-1/3 flex items-center justify-center bg-primary-color text-text-color cursor-pointer" 
                        (click)="clickNumber('0')">0</div>
                        <div 
                        class="w-1/3 flex items-center justify-center bg-primary-color text-text-color cursor-pointer" 
                        (click)="clickNumber('Del')"><-</div>
                    </div>
                </div>

                <button type="button"
                class="cursor-pointer w-full rounded-xl bg-blue-800 px-4 py-2 mt-5 font-semibold text-card-color mt-10"
                [hidden]="!phase_1"
                (click)="nextPhase()"
                >
                    Next
                </button>
            </div>

            <button type="submit" class="cursor-pointer w-full rounded-xl bg-blue-800 text-primary-color px-4 py-2 mt-5 font-semibold text-card-color"
            [hidden]="phase_1"
            >
                Add Transaction
            </button>
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
}