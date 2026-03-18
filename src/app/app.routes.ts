import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "login",
        loadComponent: () => import('./feature/auth/auth.page').then(m => m.AuthPage)
    },
    {
        path: "dashboard",
        loadComponent: () => import('./feature/dashboard/dashboard.page').then(m => m.DashboardPage)
    },
    {
        "path": "",
        "loadComponent": () => import("./feature/home/home.page").then(m => m.HomePage)
    }
];
