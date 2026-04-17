import { Component } from "@angular/core";
import { AddTransactionDesktopSubPage } from "../component/add-transaction-desktop.component";
import { AddTransactionMobileSubPage } from "../component/add-transaction-mobile.component";

@Component({
    standalone: true,
    imports: [AddTransactionDesktopSubPage, AddTransactionMobileSubPage],
    template: `
        <div class="w-full h-[960px] px-8 justify-center max-xl:hidden">
            <app-add-transaction-desktop></app-add-transaction-desktop>
        </div>
        <div class="w-full h-[984px] xl:hidden">
            <app-add-transaction-mobile></app-add-transaction-mobile>
        </div>
    `
})
export class AddTransactionPage {
}