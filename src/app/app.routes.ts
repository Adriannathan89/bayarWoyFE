import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { MainLayoutComponent } from './shared/main-layout.component';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./feature/auth/auth.page').then(m => m.AuthPage),
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./feature/dashboard/dashboard.page').then(m => m.DashboardPage),
            },
            {
                path: 'friends',
                loadComponent: () => import('./shared/underContructionSite.page').then(m => m.UnderConstructionSitePage),
            },
            {
                path: 'transaction',
                loadComponent: () => import('./feature/transaction/index').then(m => m.IndexPage),
                children: [
                    { path: '', loadComponent: () => import('./feature/transaction/page/transaction.page').then(m => m.TransactionPage) },
                    { path: 'add', loadComponent: () => import('./feature/transaction/page/addTransaction.page').then(m => m.AddTransactionPage) },
                ],
            },
        ],
    },
];
