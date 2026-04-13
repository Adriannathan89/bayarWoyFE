import { Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormBuilder, Validators } from "@angular/forms";
import { UserRecordsService } from "../../../core/service/user/user-records.service";
import { Router } from "@angular/router";

@Component({
    standalone: true,
    selector: 'app-add-transaction-desktop',
    imports: [ReactiveFormsModule],
    template: `
        <div class="w-[780px] h-[780px] bg-transparent xl:bg-[var(--primary-color)] rounded-lg p-8 xl:shadow-md flex flex-col items-center">
                <p class="text-xl max-md:text-lg">Add Transaction</p>
                <form
                    [formGroup]="transactionForm"
                    class="w-full flex flex-col gap-6 max-md:gap-10 mt-4"
                    (ngSubmit)="handleSubmit()"
                >
                    <div class="flex flex-col gap-[8px]">
                        <p>Transaction: </p>
                        <input 
                        type="text"
                        class="w-full rounded-xl p-2 border border-secondary-color focus:outline-none" formControlName="title" />
                    </div>

                    <div class="flex flex-col gap-[8px]">
                        <p>Amount:</p>
                        <input 
                        type="text"
                        (input) = formatAmount($event)
                        class="w-full rounded-xl p-2 border border-secondary-color focus:outline-none" formControlName="amount" />
                    </div>

                    <div class="flex flex-col gap-[8px]">
                        <p>Description:</p>
                        <textarea 
                        class="w-full rounded-xl p-2 border border-secondary-color focus:outline-none" rows="4" formControlName="description"></textarea>
                    </div>

                    <div class="flex flex-col gap-[8px]">
                        <p>Debtor:</p>
                        <select class="w-full rounded-xl p-2 border border-secondary-color focus:outline-none" formControlName="debtor">
                            <option value="" disabled selected>Select a friend</option>
                            <!-- Options will be populated dynamically -->
                        </select>
                    </div>

                    <div>
                        <p>Type:</p>
                        <select class="w-full rounded-xl p-2 border border-secondary-color focus:outline-none" formControlName="type">
                            <option value="" selected class="bg-secondary-color text-white">Select transaction type</option>
                            <option value="income" class="bg-secondary-color text-white">Income</option>
                            <option value="expense" class="bg-secondary-color text-white">Expense</option>
                        </select>
                    </div>
                    <button type="submit" class="cursor-pointer rounded-xl bg-blue-500 px-4 py-2 mt-5 font-semibold text-primary-color">
                        Add Transaction
                    </button>
                </form>
            </div>
    `

})
export class AddTransactionDesktopSubPage {
    transactionForm;

    constructor(private fb: FormBuilder, private router: Router, private recordsService: UserRecordsService) {
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
}