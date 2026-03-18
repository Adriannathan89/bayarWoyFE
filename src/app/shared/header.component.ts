import { Component } from "@angular/core";
import { SwithTheme } from "../core/service/styles/switch-theme.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-header',
    standalone: true,
    template: `
        <div class="w-full h-20 bg-primary-color text-text-color flex items-center justify-between p-4 shadow-b-md border-b border-secondary-color">
            <div class="text-2xl flex font-bold ml-6">
                <p>BayarWoy</p>
            </div>
            <div class="flex gap-[32px] mr-6">
                <button
                type="button"
                (click)="toggleTheme()"
                role="switch"
                [attr.aria-checked]="isDark"
                [attr.aria-label]="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
                class="relative inline-flex h-8 w-16 items-center rounded-full border border-text-color bg-secondary-color px-1 transition-colors duration-300 cursor-pointer
                mt-[5px]"
                >

                <span
                    class="h-6 w-6 rounded-full bg-primary-color shadow-md transition-transform duration-300 flex items-center justify-center"
                    [style.transform]="isDark ? 'translateX(2rem)' : 'translateX(0)'">
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
                        class="h-3.5 w-3.5 text-secondary-color"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M21 12.79A9 9 0 1 1 11.21 3c.16 0 .31 0 .47.01A7 7 0 1 0 20.99 12c0 .27-.01.53-.03.79H21Z"></path>
                    </svg>
                </span>
                </button>
                <div>
                    @if(isLogin) {
                         <p class="text-sm">username</p>
                    } @else {
                        <button class="p-2 w-[80px] h-[40px] rounded-3xl bg-card-color cursor-pointer" (click)="login()">Login</button>
                    }
                </div>
            </div>

        </div>
    `
})
export class HeaderComponent {
    constructor(private switchThemeService: SwithTheme, private router: Router) {}

    get isDark(): boolean {
        return this.switchThemeService.isDark;
    }

    get isLogin(): boolean {
        return localStorage.getItem('username') !== null;
    }

    toggleTheme(): void {
        this.switchThemeService.toggleTheme();
    }

    login(): void {
        this.router.navigate(['/login']);
    }
}