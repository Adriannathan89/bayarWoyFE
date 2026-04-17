import { Component } from "@angular/core";
import { HeaderComponent } from "../../shared/header.component";
import { RouterOutlet } from "@angular/router";

@Component({
    standalone: true,
    imports: [HeaderComponent, RouterOutlet],
    template: `
        <app-header></app-header>
        <router-outlet></router-outlet>
    `
})
export class IndexPage {}