import { OrderProductService } from './order-product.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from 'src/app/model/order';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly authOptionHeader = {
    headers: {
      "Authorization": "Basic " + btoa("prodavnica-oie-admin:" + this.cryptoService.encrypt("8fefa3caea331537a156a114299d5b60ff96a9c5e2e34b824ccfc4fb3d33e3bc6cc34486365e15c4885870da648505e7cc9f957b7383e2a421e766c113f47f0c", "prodavnicatestadmin123456"))
    }
  }

  constructor(private http: HttpClient, private cryptoService: CryptoService, private orderProductService: OrderProductService) { }

  public addNewOrder(newOrder: Order): Promise<Order> {
    return this.http.post<Order>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/insert", newOrder, this.authOptionHeader).toPromise();
  }

  public updateOrder(orderId: Number, newOrderData: Order): Promise<Order> {
    return this.http.patch<Order>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/update/" + orderId, newOrderData, this.authOptionHeader).toPromise();
  }

  public deleteOrder(orderId: number): Promise<any> {
    return this.orderProductService.deleteAllOrderProductsByOrder(orderId).then(() => {
      return this.http.delete<any>
        ("http://localhost:51683/api/prodavnicaoieadmin/order/delete/" + orderId, this.authOptionHeader).toPromise()
    });
  }

  public deleteAllOrdersFromAccount(accountId: number): Promise<any> {
    return this.getListOfOrdersByAccount(accountId).then(response => {
      response.forEach(order => {
        this.orderProductService.deleteAllOrderProductsByOrder(order.id);
      });
    }).then(() => {
      setTimeout(() => {
        return this.http.delete<any>
        ("http://localhost:51683/api/prodavnicaoieadmin/order/deleteAllFromAccount/" + accountId, this.authOptionHeader).toPromise();
      }, 1000);
    });
  }

  public deleteAllOrdersWithShippingMethod(shippingMethod: "PERSONAL" | "COURIER" | "POST"): Promise<any> {
    return this.getListOfOrdersWithShippingMethod(shippingMethod).then(response => {
      response.forEach(order => {
        this.orderProductService.deleteAllOrderProductsByOrder(order.id);
      })
    }).then(() => {
      return this.http.delete<any>
        ("http://localhost:51683/api/prodavnicaoieadmin/order/deleteAllWithShippingMethod/" + shippingMethod, this.authOptionHeader).toPromise();
    });
  }

  public deleteAllOrdersWithStatus(status: "PENDING" | "CANCELED" | "COMPLETED"): Promise<any> {
    return this.getListOfOrdersWithStatus(status).then(response => {
      response.forEach(order => {
        this.orderProductService.deleteAllOrderProductsByOrder(order.id);
      })
    }).then(() => {
      return this.http.delete<any>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/deleteAllWithStatus/" + status, this.authOptionHeader).toPromise();
    });
  }


  public findOrder(orderId: number): Promise<Order> {
    return this.http.get<Order>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/find/" + orderId, this.authOptionHeader).toPromise();
  }

  public getTotalNumber(): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/getTotalNumber", this.authOptionHeader).toPromise();
  }

  public getTotalNumberFromAccount(accountId: number): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/getTotalNumberFromAccount/" + accountId, this.authOptionHeader).toPromise();
  }

  public getTotalNumberWithShippingMethod(shippingMethod: "PERSONAL" | "COURIER" | "POST"): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/getTotalNumberWithShippingMethod/" + shippingMethod, this.authOptionHeader).toPromise();
  }

  public getTotalNumberWithStatus(status: "PENDING" | "CANCELED" | "COMPLETED"): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/getTotalNumberWithStatus/" + status, this.authOptionHeader).toPromise();
  }


  public getListOfOrders(): Promise<Array<Order>> {
    return this.http.get<Array<Order>>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/listAll", this.authOptionHeader).toPromise();
  }

  public getListOfOrdersByAccount(accountId: number): Promise<Array<Order>> {
    return this.http.get<Array<Order>>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/listAllFromAccount/" + accountId, this.authOptionHeader).toPromise();
  }

  public getListOfOrdersWithShippingMethod(shippingMethod: "PERSONAL" | "COURIER" | "POST"): Promise<Array<Order>> {
    return this.http.get<Array<Order>>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/listAllWithShippingMethod/" + shippingMethod, this.authOptionHeader).toPromise();
  }

  public getListOfOrdersWithStatus(status: "PENDING" | "CANCELED" | "COMPLETED"): Promise<Array<Order>> {
    return this.http.get<Array<Order>>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/listAllWithStatus/" + status, this.authOptionHeader).toPromise();
  }
}
