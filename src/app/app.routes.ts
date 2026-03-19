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
        path: "friends",
        loadComponent: () => import('./feature/friends/friend.page').then(m => m.FriendPage)
    },
    {
        path: "transaction",
        loadComponent: () => import('./feature/transaction/transaction.page').then(m => m.TransactionPage)
    },
    {
        "path": "",
        "loadComponent": () => import("./feature/home/home.page").then(m => m.HomePage)
    }
];
