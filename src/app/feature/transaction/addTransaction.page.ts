import { Component } from "@angular/core";
import { HeaderComponent } from "../../shared/header.component";
import { AddTransactionDesktopSubPage } from "./subPages/add-transaction-desktop.subpage";
import { AddTransactionMobileSubPage } from "./subPages/add-transaction-mobile.subpages";

@Component({
    standalone: true,
    imports: [HeaderComponent, AddTransactionDesktopSubPage, AddTransactionMobileSubPage],
    template: `
        <app-header></app-header>
        <div class="w-full flex flex-col items-center h-[960px] px-8 justify-center max-xl:hidden">
            <app-add-transaction-desktop></app-add-transaction-desktop>
        </div>
        <div class="w-full h-[984px] xl:hidden">
            <app-add-transaction-mobile></app-add-transaction-mobile>
        </div>
    `
})
export class AddTransactionPage {
}