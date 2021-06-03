import { OrderProductService } from './order-product.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from 'src/app/model/order';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private headers: HttpHeaders = new HttpHeaders({
    "Authorization": "Basic " + btoa("prodavnica-oie-admin:" + this.cryptoService.encrypt("8fefa3caea331537a156a114299d5b60ff96a9c5e2e34b824ccfc4fb3d33e3bc6cc34486365e15c4885870da648505e7cc9f957b7383e2a421e766c113f47f0c", "prodavnicatestadmin123456"))
  });

  constructor(private http: HttpClient, private cryptoService: CryptoService, private orderProductService: OrderProductService) { }

  private checkOtherServices(): Promise<boolean> {
    return this.orderProductService.getTotalNumber()
      .then(() => { return true; }, () => { return false; });
  }

  public addNewOrder(newOrder: Order): Promise<Order> {
    return this.checkOtherServices().then(response => {
      if(response)
        return this.http.post<Order>
          ("http://localhost:51683/api/prodavnicaoieadmin/order/insert", newOrder, { headers: this.headers }).toPromise();
      else return Promise.reject("Necessary services are not active");
    });
    
  }

  public updateOrder(orderId: Number, newOrderData: Order): Promise<Order> {
    return this.http.patch<Order>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/update/" + orderId, newOrderData, { headers: this.headers }).toPromise();
  }

  public deleteOrder(orderId: number): Promise<any> {
    return this.orderProductService.deleteAllOrderProductsByOrder(orderId).then(() => {
      return this.deleteOrderOnly(orderId);
    });
  }

  public deleteOrderOnly(orderId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/delete/" + orderId, { headers: this.headers }).toPromise();
  }

  public deleteAllOrdersFromAccount(accountId: number): Promise<any> {
    return this.getListOfOrdersByAccount(accountId).then(response => {
      response.forEach(order => {
        this.orderProductService.deleteAllOrderProductsByOrder(order.id);
      });
    }).then(() => {
      setTimeout(() => {
        return this.http.delete<any>
        ("http://localhost:51683/api/prodavnicaoieadmin/order/deleteAllFromAccount/" + accountId, { headers: this.headers }).toPromise();
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
        ("http://localhost:51683/api/prodavnicaoieadmin/order/deleteAllWithShippingMethod/" + shippingMethod, { headers: this.headers }).toPromise();
    });
  }

  public deleteAllOrdersWithStatus(status: "PENDING" | "CANCELED" | "COMPLETED"): Promise<any> {
    return this.getListOfOrdersWithStatus(status).then(response => {
      response.forEach(order => {
        this.orderProductService.deleteAllOrderProductsByOrder(order.id);
      })
    }).then(() => {
      return this.http.delete<any>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/deleteAllWithStatus/" + status, { headers: this.headers }).toPromise();
    });
  }


  public findOrder(orderId: number): Promise<Order> {
    return this.http.get<Order>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/find/" + orderId, { headers: this.headers }).toPromise();
  }

  public getTotalNumber(): Promise<number> {
    return this.http.get<number>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/getTotalNumber", { headers: this.headers }).toPromise();
  }

  public getTotalNumberFromAccount(accountId: number): Promise<number> {
    return this.http.get<number>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/getTotalNumberFromAccount/" + accountId, { headers: this.headers }).toPromise();
  }

  public getTotalNumberWithShippingMethod(shippingMethod: "PERSONAL" | "COURIER" | "POST"): Promise<number> {
    return this.http.get<number>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/getTotalNumberWithShippingMethod/" + shippingMethod, { headers: this.headers }).toPromise();
  }

  public getTotalNumberWithStatus(status: "PENDING" | "CANCELED" | "COMPLETED"): Promise<number> {
    return this.http.get<number>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/getTotalNumberWithStatus/" + status, { headers: this.headers }).toPromise();
  }


  public getListOfOrders(): Promise<Array<Order>> {
    return this.http.get<Array<Order>>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/listAll", { headers: this.headers }).toPromise();
  }

  public getListOfOrdersByAccount(accountId: number): Promise<Array<Order>> {
    return this.http.get<Array<Order>>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/listAllFromAccount/" + accountId, { headers: this.headers }).toPromise();
  }

  public getListOfOrdersWithShippingMethod(shippingMethod: "PERSONAL" | "COURIER" | "POST"): Promise<Array<Order>> {
    return this.http.get<Array<Order>>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/listAllWithShippingMethod/" + shippingMethod, { headers: this.headers }).toPromise();
  }

  public getListOfOrdersWithStatus(status: "PENDING" | "CANCELED" | "COMPLETED"): Promise<Array<Order>> {
    return this.http.get<Array<Order>>
      ("http://localhost:51683/api/prodavnicaoieadmin/order/listAllWithStatus/" + status, { headers: this.headers }).toPromise();
  }
}
