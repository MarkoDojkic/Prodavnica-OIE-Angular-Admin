import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductReview } from 'src/app/model/productReview';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class ProductReviewService {
  private headers: HttpHeaders = new HttpHeaders({
    "Authorization": "Basic " + btoa("prodavnica-oie-admin:" + this.cryptoService.encrypt("8fefa3caea331537a156a114299d5b60ff96a9c5e2e34b824ccfc4fb3d33e3bc6cc34486365e15c4885870da648505e7cc9f957b7383e2a421e766c113f47f0c", "prodavnicatestadmin123456"))
  });

  constructor(private http: HttpClient, private cryptoService: CryptoService) { }

  public addNewProductReview(newProductReview: ProductReview): Promise<ProductReview> {
    return this.http.post<ProductReview>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/insert", newProductReview, { headers: this.headers }).toPromise();
  }

  public updateProductReview(productId: number, accountId: number, newProductReviewData: ProductReview): Promise<ProductReview> {
    return this.http.patch<ProductReview>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/update/" + productId + "/" + accountId + "?isNegativeReview=" + (newProductReviewData.review === 0).valueOf(), newProductReviewData, { headers: this.headers }).toPromise();
  }

  public deleteProductReview(productId: number, accountId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/delete/" + productId + "/" + accountId, { headers: this.headers }).toPromise();
  }

  public deleteAllProductReviewsByAccount(accountId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/deleteAllByAccount/" + accountId, { headers: this.headers }).toPromise();
  }

  public deleteAllProductReviewsByProduct(productId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/deleteAllByProduct/" + productId, { headers: this.headers }).toPromise();
  }


  public findProductReview(productId: number, accountId: number): Promise<ProductReview> {
    return this.http.get<ProductReview>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/find/" + productId + "/" + accountId, { headers: this.headers }).toPromise();
  }

  public getTotalNumber(): Promise<number> {
    return this.http.get<number>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/getTotalNumber", { headers: this.headers }).toPromise();
  }

  public getTotalNumberByAccount(accountId: number): Promise<number> {
    return this.http.get<number>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/getTotalNumberByAccount/" + accountId, { headers: this.headers }).toPromise();
  }

  public getTotalNumberByProduct(productId: number): Promise<number> {
    return this.http.get<number>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/getTotalNumberByProduct/" + productId, { headers: this.headers }).toPromise();
  }

  public getListOfProductReviews(): Promise<Array<ProductReview>> {
    return this.http.get<Array<ProductReview>>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/listAll", { headers: this.headers }).toPromise();
  }

  public getListOfProductReviewsByAccount(accountId: number): Promise<Array<ProductReview>> {
    return this.http.get<Array<ProductReview>>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/listAllByAccount/" + accountId, { headers: this.headers }).toPromise();
  }

  public getListOfProductReviewsByProduct(productId: number): Promise<Array<ProductReview>> {
    return this.http.get<Array<ProductReview>>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/listAllByProduct/" + productId, { headers: this.headers }).toPromise();
  }
}
