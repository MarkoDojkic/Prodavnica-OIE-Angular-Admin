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
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/insert", newOrderProduct, this.authOptionHeader).toPromise();
  }

  public updateOrderProduct(orderId: number, productId: number, newOrderProductData: OrderProduct): Promise<OrderProduct> {
    return this.http.patch<OrderProduct>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/update/" + orderId + "/" + productId, newOrderProductData, this.authOptionHeader).toPromise();
  }

  public deleteOrderProduct(orderId: number, productId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/delete/" + orderId + "/" + productId, this.authOptionHeader).toPromise();
  }

  public deleteAllOrderProductsByOrder(orderId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/deleteAllByOrder/" + orderId, this.authOptionHeader).toPromise();
  }

  public deleteAllOrderProductsByProduct(productId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/deleteAllByProduct/" + productId, this.authOptionHeader).toPromise();
  }


  public findOrderProduct(orderId: number, productId: number): Promise<OrderProduct> {
    return this.http.get<OrderProduct>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/find/" + orderId + "/" + productId, this.authOptionHeader).toPromise();
  }

  public getTotalNumber(): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/getTotalNumber", this.authOptionHeader).toPromise();
  }

  public getTotalNumberByOrder(orderId: number): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/getTotalNumberByOrder/" + orderId, this.authOptionHeader).toPromise();
  }

  public getTotalNumberByProduct(productId: number): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/getTotalNumberByProduct/" + productId, this.authOptionHeader).toPromise();
  }

  public getSubtotalByOrder(orderId: number): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/getSubtotalByOrder/" + orderId, this.authOptionHeader).toPromise();
  }

  public getSubtotalByProduct(productId: number): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/getSubtotalByProduct/" + productId, this.authOptionHeader).toPromise();
  }

  public getListOfOrderedProducts(): Promise<Array<OrderProduct>> {
    return this.http.get<Array<OrderProduct>>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/listAll", this.authOptionHeader).toPromise();
  }

  public getListOfOrderProductsByOrder(orderId: number): Promise<Array<OrderProduct>> {
    return this.http.get<Array<OrderProduct>>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/listAllByOrder/" + orderId, this.authOptionHeader).toPromise();
  }

  public getListOfOrderProductsByProduct(productId: number): Promise<Array<OrderProduct>> {
    return this.http.get<Array<OrderProduct>>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/listAllByProduct/" + productId, this.authOptionHeader).toPromise();
  }
}
