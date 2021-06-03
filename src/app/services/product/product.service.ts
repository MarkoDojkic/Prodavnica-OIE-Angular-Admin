import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/model/product';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private headers: HttpHeaders = new HttpHeaders({
    "Authorization": "Basic " + btoa("prodavnica-oie-admin:" + this.cryptoService.encrypt("8fefa3caea331537a156a114299d5b60ff96a9c5e2e34b824ccfc4fb3d33e3bc6cc34486365e15c4885870da648505e7cc9f957b7383e2a421e766c113f47f0c", "prodavnicatestadmin123456"))
  });

  constructor(private http: HttpClient, private cryptoService: CryptoService) { }

  public addNewProduct(newProduct: Product): Promise<Product> {
    return this.http.post<Product>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/insert", newProduct, { headers: this.headers }).toPromise();
  }

  public updateProduct(productId: number, newProductData: Product, isFree: boolean, isOutOfStock: boolean): Promise<Product> {    

    return this.http.patch<Product>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/update/" + productId + "?isFree=" + isFree + "&isOutOfStock=" + isOutOfStock, newProductData, { headers: this.headers },).toPromise();
  }

  public deleteProduct(productId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/delete/" + productId, { headers: this.headers }).toPromise();
  }

  public deleteAllProductsWithinCategory(categoryId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/deleteAllWithinCategory/" + categoryId, { headers: this.headers }).toPromise();
  }

  public findProduct(productId: number): Promise<Product> {
    return this.http.get<Product>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/find/" + productId, { headers: this.headers }).toPromise();
  }

  public getTotalNumber(): Promise<number> {
    return this.http.get<number>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/getTotalNumber", { headers: this.headers }).toPromise();
  }

  public getTotalNumberWithinCategory(categoryId: number): Promise<number> {
    return this.http.get<number>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/getTotalNumber/" + categoryId, { headers: this.headers }).toPromise();
  }

  public getListOfProducts(): Promise<Array<Product>> {
    return this.http.get<Array<Product>>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/listAll", { headers: this.headers }).toPromise();
  }

  public getListOfProductsWithinCategory(categoryId: number): Promise<Array<Product>> {
    return this.http.get<Array<Product>>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/listAll/" + categoryId, { headers: this.headers }).toPromise();
  }
}
