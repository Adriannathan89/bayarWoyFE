import { Component } from "@angular/core";
import { HeaderComponent } from "../../shared/header.component";

@Component({
    standalone: true,
    imports: [HeaderComponent],
    template: `
    <app-header></app-header>
    `
})
export class HomePage {}