import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductReview } from 'src/app/model/productReview';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class ProductReviewService {
  private readonly authOptionHeader = {
    headers: {
      "Authorization": "Basic " + btoa("prodavnica-oie-admin:" + this.cryptoService.encrypt("8fefa3caea331537a156a114299d5b60ff96a9c5e2e34b824ccfc4fb3d33e3bc6cc34486365e15c4885870da648505e7cc9f957b7383e2a421e766c113f47f0c", "prodavnicatestadmin123456"))
    }
  }

  constructor(private http: HttpClient, private cryptoService: CryptoService) { }

  public addNewProductReview(newProductReview: ProductReview): Promise<ProductReview> {
    return this.http.post<ProductReview>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/insert", newProductReview, this.authOptionHeader).toPromise();
  }

  public updateProductReview(productId: number, accountId: number, newProductReviewData: ProductReview): Promise<ProductReview> {
    return this.http.patch<ProductReview>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/update/" + productId + "/" + accountId, newProductReviewData, this.authOptionHeader).toPromise();
  }

  public deleteProductReview(productId: number, accountId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/delete/" + productId + "/" + accountId, this.authOptionHeader).toPromise();
  }

  public deleteAllProductReviewsByAccount(accountId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/deleteAllByAccount/" + accountId, this.authOptionHeader).toPromise();
  }

  public deleteAllProductReviewsByProduct(productId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/deleteAllByProduct/" + productId, this.authOptionHeader).toPromise();
  }


  public findProductReview(productId: number, accountId: number): Promise<ProductReview> {
    return this.http.get<ProductReview>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/find/" + productId + "/" + accountId, this.authOptionHeader).toPromise();
  }

  public getTotalNumber(): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/getTotalNumber", this.authOptionHeader).toPromise();
  }

  public getTotalNumberByAccount(accountId: number): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/getTotalNumberByAccount/" + accountId, this.authOptionHeader).toPromise();
  }

  public getTotalNumberByProduct(productId: number): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/getTotalNumberByProduct/" + productId, this.authOptionHeader).toPromise();
  }

  public getListOfProductReviews(): Promise<Array<ProductReview>> {
    return this.http.get<Array<ProductReview>>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/listAll", this.authOptionHeader).toPromise();
  }

  public getListOfProductReviewsByAccount(accountId: number): Promise<Array<ProductReview>> {
    return this.http.get<Array<ProductReview>>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/listAllByAccount/" + accountId, this.authOptionHeader).toPromise();
  }

  public getListOfProductReviewsByProduct(productId: number): Promise<Array<ProductReview>> {
    return this.http.get<Array<ProductReview>>
      ("http://localhost:51682/api/prodavnicaoieadmin/productReview/listAllByProduct/" + productId, this.authOptionHeader).toPromise();
  }
}
