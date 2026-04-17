import { Component } from "@angular/core";
import { HeaderComponent } from "../../shared/header.component";
import { RouterOutlet } from "@angular/router";
import { NavbarOnFriendPageComponent } from "./component/navbarOnFriendPage.component";

@Component({
    standalone: true,
    imports: [HeaderComponent, RouterOutlet, NavbarOnFriendPageComponent],
    template: `
        <app-header></app-header>
        <div class="flex justify-center mt-[40px] gap-20">
            <app-navbar-on-friend-page></app-navbar-on-friend-page>
            <router-outlet></router-outlet>
        </div>
    `
})
export class IndexPage {}
