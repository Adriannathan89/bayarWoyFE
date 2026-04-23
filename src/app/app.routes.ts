import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
    {
        path: "login",
        loadComponent: () => import('./feature/auth/auth.page').then(m => m.AuthPage)
    },
    {
        "path": "",
        "redirectTo": "dashboard",
        "pathMatch": "full"
    },
    {
        path: "dashboard",
        canActivate: [authGuard],
        loadComponent: () => import('./shared/underContructionSite.page').then(m => m.UnderConstructionSitePage)
    },
    // {
    //     path: "friends",
    //     loadComponent: () => import('./feature/friends/index').then(m => m.IndexPage),
    //     canActivate: [authGuard],
    //     children: [
    //         { path: "", loadComponent: () => import('./feature/friends/page/friend-list.page').then(m => m.FriendListPage) },
    //         { path: "add", loadComponent: () => import('./feature/friends/page/add-friend.page').then(m => m.AddFriendPage) },
    //         { path: "requests", loadComponent: () => import('./feature/friends/page/friend-request.page').then(m => m.FriendRequestPage) }
    //     ]
    // },
    {
        path: "friends",
        canActivate: [authGuard],
        loadComponent: () => import('./shared/underContructionSite.page').then(m => m.UnderConstructionSitePage)
    },
    {
        path: "transaction",
        loadComponent: () => import('./feature/transaction/index').then(m => m.IndexPage),
        canActivate: [authGuard],
        children: [
            { path: "", loadComponent: () => import('./feature/transaction/page/transaction.page').then(m => m.TransactionPage) },   
            { path: "add", loadComponent: () => import('./feature/transaction/page/addTransaction.page').then(m => m.AddTransactionPage) }
        ]
    },
];
