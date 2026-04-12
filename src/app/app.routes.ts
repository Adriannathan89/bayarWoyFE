import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
    {
        path: "login",
        loadComponent: () => import('./feature/auth/auth.page').then(m => m.AuthPage)
    },
    {
        "path": "",
        "loadComponent": () => import("./feature/home/home.page").then(m => m.HomePage)
    },
    {
        path: "dashboard",
        canActivate: [authGuard],
        loadComponent: () => import('./feature/dashboard/dashboard.page').then(m => m.DashboardPage)
    },
    {
        path: "friends",
        canActivate: [authGuard],
        loadComponent: () => import('./feature/friends/friend.page').then(m => m.FriendPage)
    },
    {
        path: "transaction",
        canActivate: [authGuard],
        loadComponent: () => import('./feature/transaction/transaction.page').then(m => m.TransactionPage)
    },
    {
        path: "transaction/add",
        canActivate: [authGuard],
        loadComponent: () => import('./feature/transaction/addTransaction.page').then(m => m.AddTransactionPage)
    }
];
