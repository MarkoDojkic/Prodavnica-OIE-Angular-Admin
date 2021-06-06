import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { AccountsComponent } from './main/accounts/accounts.component';
import { OrdersComponent } from './main/orders/orders.component';
import { ProductsComponent } from './main/products/products.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
    { path: 'products', component: ProductsComponent, canActivate: [AuthGuardService], data: { title: 'Производи' } },
    { path: 'orders', component: OrdersComponent, canActivate: [AuthGuardService], data: { title: 'Поруџбине' } },
    { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuardService], data: { title: 'Кориснички налози' } },
    { path: '**', redirectTo: "/products", pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class RoutingModule { }