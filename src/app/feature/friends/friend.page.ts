import { Component } from "@angular/core";
import { HeaderComponent } from "../../shared/header.component";

@Component({
    standalone: true,
    imports: [HeaderComponent],
    template: `
        <app-header></app-header>
        <div>
            <p>Friends Page</p>
        </div>
    `
})
export class FriendPage {}