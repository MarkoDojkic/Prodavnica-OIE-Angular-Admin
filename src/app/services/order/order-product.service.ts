import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderProduct } from 'src/app/model/orderProduct';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class OrderProductService {
  private readonly authOptionHeader = {
    headers: {
      "Authorization": "Basic " + btoa("prodavnica-oie-admin:" + this.cryptoService.encrypt("8fefa3caea331537a156a114299d5b60ff96a9c5e2e34b824ccfc4fb3d33e3bc6cc34486365e15c4885870da648505e7cc9f957b7383e2a421e766c113f47f0c", "prodavnicatestadmin123456"))
    }
  }

  constructor(private http: HttpClient, private cryptoService: CryptoService) { }

  public addNewOrderProduct(newOrderProduct: OrderProduct): Promise<OrderProduct> {
    return this.http.post<OrderProduct>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderproduct/insert", newOrderProduct, this.authOptionHeader).toPromise();
  }

  public updateOrderProduct(orderId: Number, productId: Number, newOrderProductData: OrderProduct): Promise<OrderProduct> {
    return this.http.patch<OrderProduct>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderproduct/update/" + orderId + "/" + productId, newOrderProductData, this.authOptionHeader).toPromise();
  }

  public deleteOrderProduct(orderId: Number, productId: Number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderproduct/delete/" + orderId + "/" + productId, this.authOptionHeader).toPromise();
  }

  public deleteAllOrderProductsByOrder(orderId: Number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderproduct/deleteAllByOrder/" + orderId, this.authOptionHeader).toPromise();
  }

  public deleteAllOrderProductsByProduct(productId: Number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderproduct/deleteAllByProduct/" + productId, this.authOptionHeader).toPromise();
  }


  public findOrderProduct(orderId: Number, productId: Number): Promise<OrderProduct> {
    return this.http.get<OrderProduct>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderproduct/find/" + orderId + "/" + productId, this.authOptionHeader).toPromise();
  }

  public getTotalNumber(): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderproduct/getTotalNumber", this.authOptionHeader).toPromise();
  }

  public getTotalNumberByOrder(orderId: Number): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderproduct/getTotalNumberByOrder/" + orderId, this.authOptionHeader).toPromise();
  }

  public getTotalNumberByProduct(productId: Number): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderproduct/getTotalNumberByProduct/" + productId, this.authOptionHeader).toPromise();
  }

  public getSubtotalByOrder(orderId: Number): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderproduct/getSubtotalByOrder/" + orderId, this.authOptionHeader).toPromise();
  }

  public getSubtotalByProduct(productId: Number): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderproduct/getSubtotalByProduct/" + productId, this.authOptionHeader).toPromise();
  }

  public getListOfOrderedProducts(): Promise<Array<OrderProduct>> {
    return this.http.get<Array<OrderProduct>>
      ("http://localhost:51621/api/prodavnicaoieadmin/orderproduct/listAll", this.authOptionHeader).toPromise();
  }

  public getListOfOrderProductsByOrder(orderId: Number): Promise<Array<OrderProduct>> {
    return this.http.get<Array<OrderProduct>>
      ("http://localhost:51621/api/prodavnicaoieadmin/orderproduct/listAllByOrder/" + orderId, this.authOptionHeader).toPromise();
  }

  public getListOfOrderProductsByProduct(productId: Number): Promise<Array<OrderProduct>> {
    return this.http.get<Array<OrderProduct>>
      ("http://localhost:51621/api/prodavnicaoieadmin/orderproduct/listAllByProduct/" + productId, this.authOptionHeader).toPromise();
  }
}
