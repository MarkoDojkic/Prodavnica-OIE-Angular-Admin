import { OrderService } from './services/order/order.service';
import { ProductReviewService } from './services/product/product-review.service';
import { ProductService } from './services/product/product.service';
import { CategoryService } from './services/product/category.service';
import { OrderProductService } from './services/order/order-product.service';
import { AccountService } from './services/account/account.service';
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { RoutingModule } from './routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CryptoService } from './services/crypto/crypto.service';
import { ProductsComponent } from './main/products/products.component';
import { OrdersComponent } from './main/orders/orders.component';
import { AccountsComponent } from './main/accounts/accounts.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getSerbianPaginatorIntl } from './services/MatPaginatorLocalization';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    OrdersComponent,
    AccountsComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    RoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule
  ],

  
  providers: [Title, CryptoService, AccountService, CategoryService, { provide: MatPaginatorIntl, useValue: getSerbianPaginatorIntl() },
    ProductService, ProductReviewService, OrderService, OrderProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
