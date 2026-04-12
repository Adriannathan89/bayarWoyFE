import { Component } from "@angular/core";
import { SwithTheme } from "../core/service/styles/switch-theme.service";
import { Router } from "@angular/router";
import { NavbarComponent } from "./navbar.component";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [NavbarComponent, CommonModule],
    template: `
        <div class="w-full h-20 bg-primary-color text-text-color flex items-center justify-between py-4 md:px-4 shadow-b-md border-b border-secondary-color">
            <div class="max-sm:text-sm xl:text-2xl max-sm:mt-[4px] flex font-bold ml-6">
                <p>BayarWoy</p>
            </div>
            <div class="flex gap-[32px] md:mr-6 mr-2">
                <button
                type="button"
                (click)="toggleTheme()"
                role="switch"
                [attr.aria-checked]="isDark"
                [attr.aria-label]="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
                class="relative inline-flex w-16 xl:w-18 items-center rounded-full border border-text-color bg-secondary-color px-1 transition-colors duration-300 cursor-pointer
                mt-[5px]"
                >

                <span
                    class="w-full h-full max-h-6 max-w-6 rounded-full bg-primary-color shadow-md transition-transform duration-300 flex items-center justify-center"
                    [ngClass]="isDark ? 'translate-x-[30px] xl:translate-x-[38px]' : 'translate-y-0'">
                    <svg
                        [class.hidden]="isDark"
                        class="h-3.5 w-3.5 text-secondary-color"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="12" r="4"></circle>
                        <line x1="12" y1="2" x2="12" y2="5"></line>
                        <line x1="12" y1="19" x2="12" y2="22"></line>
                        <line x1="4.93" y1="4.93" x2="7.05" y2="7.05"></line>
                        <line x1="16.95" y1="16.95" x2="19.07" y2="19.07"></line>
                        <line x1="2" y1="12" x2="5" y2="12"></line>
                        <line x1="19" y1="12" x2="22" y2="12"></line>
                        <line x1="4.93" y1="19.07" x2="7.05" y2="16.95"></line>
                        <line x1="16.95" y1="7.05" x2="19.07" y2="4.93"></line>
                    </svg>
                    <svg
                        [class.hidden]="!isDark"
                        class="h-5 w-5 text-secondary-color"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M21 12.79A9 9 0 1 1 11.21 3c.16 0 .31 0 .47.01A7 7 0 1 0 20.99 12c0 .27-.01.53-.03.79H21Z"></path>
                    </svg>
                </span>
                </button>
                <div class="flex max-xl:gap-[20px] gap-[32px]">
                    @if(isLogin) {
                        <app-navbar></app-navbar>
                        <p class="max-sm:text-sm max-sm:mt-[8px] md:text-md md:mt-[8px] xl:text-xl mt-[4px]">{{ username }}</p>
                    } @else {
                        <button class="py-2 px-3 w-[94px] h-[40px] shadow-md rounded-3xl bg-card-color cursor-pointer text-card-color" (click)="login()">Login</button>
                    }
                </div>
            </div>

        </div>
    `
})
export class HeaderComponent {
    constructor(
        private switchThemeService: SwithTheme, 
        private router: Router,
    ) {}

    get isDark(): boolean {
        return this.switchThemeService.isDark;
    }

    get isLogin(): boolean {
        return localStorage.getItem('username') !== null;
    }

    get username(): string {
        return localStorage.getItem('username') || '';
    }

    toggleTheme(): void {
        this.switchThemeService.toggleTheme();
    }

    login(): void {
        this.router.navigate(['/login']);
    }
}