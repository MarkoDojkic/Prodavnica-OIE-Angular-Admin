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
      ("http://localhost:51682/api/prodavnicaoieadmin/productreview/insert", newProductReview, this.authOptionHeader).toPromise();
  }

  public updateProductReview(productId: Number, accountId: Number, newProductReviewData: ProductReview): Promise<ProductReview> {
    return this.http.patch<ProductReview>
      ("http://localhost:51682/api/prodavnicaoieadmin/productreview/update/" + productId + "/" + accountId, newProductReviewData, this.authOptionHeader).toPromise();
  }

  public deleteProductReview(productId: Number, accountId: Number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51682/api/prodavnicaoieadmin/productreview/delete/" + productId + "/" + accountId, this.authOptionHeader).toPromise();
  }

  public deleteAllProductReviewsByAccount(accountId: Number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51682/api/prodavnicaoieadmin/productreview/deleteAllByAccount/" + accountId, this.authOptionHeader).toPromise();
  }

  public deleteAllProductReviewsByProduct(productId: Number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51682/api/prodavnicaoieadmin/productreview/deleteAllByProduct/" + productId, this.authOptionHeader).toPromise();
  }


  public findProductReview(productId: Number, accountId: Number): Promise<ProductReview> {
    return this.http.get<ProductReview>
      ("http://localhost:51682/api/prodavnicaoieadmin/productreview/find/" + productId + "/" + accountId, this.authOptionHeader).toPromise();
  }

  public getTotalNumber(): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51682/api/prodavnicaoieadmin/productreview/getTotalNumber", this.authOptionHeader).toPromise();
  }

  public getTotalNumberByAccount(accountId: Number): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51682/api/prodavnicaoieadmin/productreview/getTotalNumberByAccount/" + accountId, this.authOptionHeader).toPromise();
  }

  public getTotalNumberByProduct(productId: Number): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51682/api/prodavnicaoieadmin/productreview/getTotalNumberByProduct/" + productId, this.authOptionHeader).toPromise();
  }

  public getListOfProductReviews(): Promise<Array<ProductReview>> {
    return this.http.get<Array<ProductReview>>
      ("http://localhost:51621/api/prodavnicaoieadmin/productreview/listAll", this.authOptionHeader).toPromise();
  }

  public getListOfProductReviewsByAccount(accountId: Number): Promise<Array<ProductReview>> {
    return this.http.get<Array<ProductReview>>
      ("http://localhost:51621/api/prodavnicaoieadmin/productreview/listAllByAccount/" + accountId, this.authOptionHeader).toPromise();
  }

  public getListOfProductReviewsByProduct(productId: Number): Promise<Array<ProductReview>> {
    return this.http.get<Array<ProductReview>>
      ("http://localhost:51621/api/prodavnicaoieadmin/productreview/listAllByProduct/" + productId, this.authOptionHeader).toPromise();
  }
}
