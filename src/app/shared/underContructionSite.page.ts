import { Component } from "@angular/core";
import { HeaderComponent } from "./header.component";

@Component({
    standalone: true,
    imports: [HeaderComponent],
    template: `
        <app-header></app-header>
        <div class="w-full h-[980px] flex flex-col gap-4 justify-center items-center">
            <h1 class="text-xl">Under Construction</h1>
            <p>This page is currently under construction. Please check back later.</p>
        </div>
    `,
})
export class UnderConstructionSitePage {}