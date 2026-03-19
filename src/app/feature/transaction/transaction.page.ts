import { Component } from "@angular/core";
import { HeaderComponent } from "../../shared/header.component";

@Component({
    standalone: true,
    imports: [HeaderComponent],
    template: `
        <app-header></app-header>
        <div>
            <p>Transaction Page</p>
        </div>
    `
})
export class TransactionPage {}