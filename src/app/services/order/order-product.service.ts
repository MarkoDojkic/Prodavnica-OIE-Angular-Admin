import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderProduct } from 'src/app/model/orderProduct';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class OrderProductService {
  private headers: HttpHeaders = new HttpHeaders({
    "Authorization": "Basic " + btoa("prodavnica-oie-admin:" + this.cryptoService.encrypt("8fefa3caea331537a156a114299d5b60ff96a9c5e2e34b824ccfc4fb3d33e3bc6cc34486365e15c4885870da648505e7cc9f957b7383e2a421e766c113f47f0c", "prodavnicatestadmin123456"))
  });

  constructor(private http: HttpClient, private cryptoService: CryptoService) { }

  public addNewOrderProduct(newOrderProduct: OrderProduct): Promise<OrderProduct> {
    return this.http.post<OrderProduct>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/insert", newOrderProduct, { headers: this.headers }).toPromise();
  }

  public updateOrderProduct(orderId: number, productId: number, newOrderProductData: OrderProduct): Promise<OrderProduct> {
    return this.http.patch<OrderProduct>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/update/" + orderId + "/" + productId, newOrderProductData, { headers: this.headers }).toPromise();
  }

  public deleteOrderProduct(orderId: number, productId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/delete/" + orderId + "/" + productId, { headers: this.headers }).toPromise();
  }

  public deleteAllOrderProductsByOrder(orderId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/deleteAllByOrder/" + orderId, { headers: this.headers }).toPromise();
  }

  public deleteAllOrderProductsByProduct(productId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/deleteAllByProduct/" + productId, { headers: this.headers }).toPromise();
  }


  public findOrderProduct(orderId: number, productId: number): Promise<OrderProduct> {
    return this.http.get<OrderProduct>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/find/" + orderId + "/" + productId, { headers: this.headers }).toPromise();
  }

  public getTotalNumber(): Promise<number> {
    return this.http.get<number>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/getTotalNumber", { headers: this.headers }).toPromise();
  }

  public getTotalNumberByOrder(orderId: number): Promise<number> {
    return this.http.get<number>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/getTotalNumberByOrder/" + orderId, { headers: this.headers }).toPromise();
  }

  public getTotalNumberByProduct(productId: number): Promise<number> {
    return this.http.get<number>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/getTotalNumberByProduct/" + productId, { headers: this.headers }).toPromise();
  }

  public getSubtotalByOrder(orderId: number): Promise<number> {
    return this.http.get<number>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/getSubtotalByOrder/" + orderId, { headers: this.headers }).toPromise();
  }

  public getSubtotalByProduct(productId: number): Promise<number> {
    return this.http.get<number>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/getSubtotalByProduct/" + productId, { headers: this.headers }).toPromise();
  }

  public getListOfOrderedProducts(): Promise<Array<OrderProduct>> {
    return this.http.get<Array<OrderProduct>>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/listAll", { headers: this.headers }).toPromise();
  }

  public getListOfOrderProductsByOrder(orderId: number): Promise<Array<OrderProduct>> {
    return this.http.get<Array<OrderProduct>>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/listAllByOrder/" + orderId, { headers: this.headers }).toPromise();
  }

  public getListOfOrderProductsByProduct(productId: number): Promise<Array<OrderProduct>> {
    return this.http.get<Array<OrderProduct>>
      ("http://localhost:51683/api/prodavnicaoieadmin/orderProduct/listAllByProduct/" + productId, { headers: this.headers }).toPromise();
  }
}
