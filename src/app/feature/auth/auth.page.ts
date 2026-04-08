import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { UserAuthService } from "../../core/service/user/user-auth.service";
import { UserRegisterService } from "../../core/service/user/user-register.service";
import { Router } from "@angular/router";

@Component({
    standalone: true,
    imports: [ReactiveFormsModule],
    template: `
        <div class="flex items-center justify-center w-full h-screen">
            <div class="max-sm:w-[480px] max-md:w-[340px] max-xl:w-[420px] xl:w-[480px] h-[600px] bg-primary-color rounded-tl-2xl rounded-bl-2xl p-8 shadow-md">
                <div class="w-full flex justify-center {{ isLogin ? 'mt-[100px]' : '' }}">
                    <h1 class="text-3xl font-bold mb-4">@if (isLogin) { Login } @else { Register }</h1>
                </div>
                <form [formGroup]="authForm" (ngSubmit)="handleSubmit()" 
                class="flex flex-col gap-6"
                >
                    <div class="flex flex-col gap-[8px]">
                        <p>Username:</p>
                        <input
                            type="text"
                            formControlName="username"
                            class="w-full rounded-xl p-2 border border-secondary-color focus:outline-none"
                        />
                    </div>

                    <div class="flex flex-col gap-[8px]">
                        <p>Password:</p>
                        <input
                            type="password"
                            formControlName="password"
                            class="w-full rounded-xl p-2 border border-secondary-color focus:outline-none"
                        />
                    </div>

                    @if (!isLogin) {
                    <div class="flex flex-col gap-[32px]">
                        <div class="flex flex-col gap-[8px]">
                            <p>Repeat password:</p>
                            <input
                                type="password"
                                formControlName="repeatPassword"
                                class="w-full rounded-xl p-2 border border-secondary-color focus:outline-none"
                            />
                        </div>
                    </div>
                    }

                    <div class="sm:hidden text-neutral-color">
                        <button 
                        type="button"
                        class="ml-[4px] cursor-pointer" 
                        (click)="toggleLogin()">{{ isLogin ? "Don't have an account?" : "Already have an account?" }}</button>
                    </div>

                    <button
                        type="submit"
                        class="cursor-pointer rounded-xl bg-secondary-color px-4 py-2 font-semibold text-primary-color disabled:opacity-60 disabled:cursor-not-allowed
                        {{ !canSubmit ? 'bg-secondary-color' : 'bg-card-color' }}"
                        [disabled]="isSubmitting || !canSubmit"
                    >
                        {{ (isLogin ? 'Login' : 'Register') }}
                    </button>
                </form>
            </div>
            <div class="max-sm:hidden max-md:w-[340px] max-xl:w-[420px] xl:w-[480px] h-[600px] bg-card-color rounded-tr-2xl rounded-br-2xl p-8 shadow-md flex flex-col items-center justify-center gap-[16px] text-card-color">
                <p>Welcome to Bayar Woy Coek</p>
                <div class="w-full flex flex-col items-center gap-[12px]">
                @if (isLogin) {
                    <p>Don't have an account?</p>
                    <button type="button" class="cursor-pointer bg-transparent w-[160px] py-1 px-3 border-1 border-card-color rounded-full text-card-color hover:bg-transparent/90" (click)="toggleLogin()">Register here</button>
                } @else {
                    <p>Already have an account?</p>
                    <button type="button" class="cursor-pointer bg-transparent w-[160px] py-1 px-3 border-1 border-card-color rounded-full text-card-color hover:bg-transparent/90" (click)="toggleLogin()">Login here</button>
                }
                </div>
            </div>
        </div>
    `
})
export class AuthPage {
    isLogin = true;
    isSubmitting = false;
    authForm;

    constructor(private fb: FormBuilder, private registerService: UserRegisterService, private authService: UserAuthService, private router: Router) {
        this.authForm = this.fb.nonNullable.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            repeatPassword: ['']
        });
    }

    toggleLogin() {
        this.isLogin = !this.isLogin;
    }

    get canSubmit() {
        return this.authForm.valid && (this.isLogin || this.authForm.value.password === this.authForm.value.repeatPassword);
    }

    async handleSubmit() {
        if (this.authForm.invalid) {
            return;
        }

        const { username, password } = this.authForm.value;

        if (this.isLogin) {
            this.isSubmitting = true;
            try {
                const success = await this.authService.login(String(username), String(password));

                if (success) {
                    localStorage.setItem('username', String(username));
                    this.router.navigate(['/dashboard']);
                }
            } finally {
                this.isSubmitting = false;
            }

        } else {
            this.isSubmitting = true;
            try {
                const success = await this.registerService.register(String(username), String(password));
                if (success) {
                    this.isLogin = true;
                    this.authForm.reset();
                }
            } finally {
                this.isSubmitting = false;
            }
        }
    }
}