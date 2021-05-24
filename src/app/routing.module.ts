import { AccountsComponent } from './main/accounts/accounts.component';
import { OrdersComponent } from './main/orders/orders.component';
import { ProductsComponent } from './main/products/products.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
    { path: 'products', component: ProductsComponent, data: { title: 'Производи' } },
    { path: 'orders', component: OrdersComponent, data: { title: 'Поруџбине' } },
    { path: 'accounts', component: AccountsComponent, data: { title: 'Кориснички налози' } },
    { path: '**', redirectTo: "/", pathMatch: 'full', data: { title: 'Админ логовање' } }
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