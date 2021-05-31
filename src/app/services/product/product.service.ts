import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/model/product';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly authOptionHeader = {
    headers: {
      "Authorization": "Basic " + btoa("prodavnica-oie-admin:" + this.cryptoService.encrypt("8fefa3caea331537a156a114299d5b60ff96a9c5e2e34b824ccfc4fb3d33e3bc6cc34486365e15c4885870da648505e7cc9f957b7383e2a421e766c113f47f0c", "prodavnicatestadmin123456"))
    }
  }

  constructor(private http: HttpClient, private cryptoService: CryptoService) { }

  public addNewProduct(newProduct: Product): Promise<Product> {
    return this.http.post<Product>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/insert", newProduct, this.authOptionHeader).toPromise();
  }

  public updateProduct(productId: number, newProductData: Product): Promise<Product> {
    return this.http.patch<Product>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/update/" + productId, newProductData, this.authOptionHeader).toPromise();
  }

  public deleteProduct(productId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/delete/" + productId, this.authOptionHeader).toPromise();
  }

  public deleteAllProductsWithinCategory(categoryId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/deleteAllWithinCategory/" + categoryId, this.authOptionHeader).toPromise();
  }

  public findProduct(productId: number): Promise<Product> {
    return this.http.get<Product>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/find" + productId, this.authOptionHeader).toPromise();
  }

  public getTotalNumber(): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/getTotalNumber", this.authOptionHeader).toPromise();
  }

  public getTotalNumberWithinCategory(categoryId: number): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/getTotalNumber/" + categoryId, this.authOptionHeader).toPromise();
  }

  public getListOfProducts(): Promise<Array<Product>> {
    return this.http.get<Array<Product>>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/listAll", this.authOptionHeader).toPromise();
  }

  public getListOfProductsWithinCategory(categoryId: number): Promise<Array<Product>> {
    return this.http.get<Array<Product>>
      ("http://localhost:51682/api/prodavnicaoieadmin/product/listAll/" + categoryId, this.authOptionHeader).toPromise();
  }
}
