import { ProductReviewService } from './../product/product-review.service';
import { OrderService } from './../order/order.service';
import { Account } from './../../model/account';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly authOptionHeader = {
    headers: {
      "Authorization": "Basic " + btoa("prodavnica-oie-admin:" + this.cryptoService.encrypt("8fefa3caea331537a156a114299d5b60ff96a9c5e2e34b824ccfc4fb3d33e3bc6cc34486365e15c4885870da648505e7cc9f957b7383e2a421e766c113f47f0c", "prodavnicatestadmin123456"))
    }
  }

  constructor(private http: HttpClient, private cryptoService: CryptoService,
  private orderService: OrderService, private productReviewService: ProductReviewService) { }

  private checkOtherServices(): Promise<boolean> {
    return this.orderService.getTotalNumber().then(() => {
      return this.productReviewService.getTotalNumber().then(
        () => { return true; }, () => { return false; })
    }, () => { return false; });
  }

  public addNewAccount(newAccount: Account): Promise<Account> {
    return this.http.post<Account>
      ("http://localhost:51681/api/prodavnicaoieadmin/account/insert", newAccount, this.authOptionHeader).toPromise();
  }

  public updateAccount(accountId: number, newAccountData: Account): Promise<Account> {
    return this.http.patch<Account>
      ("http://localhost:51681/api/prodavnicaoieadmin/account/update/" + accountId, newAccountData, this.authOptionHeader).toPromise();
  }

  public deleteAccount(accountId: number): Promise<any> {
    return this.checkOtherServices().then(response => {
      if (response) {
        return this.orderService.deleteAllOrdersFromAccount(accountId).then(() => {
          return this.productReviewService.deleteAllProductReviewsByAccount(accountId).then(() => {
            setTimeout(() => {
              return this.http.delete<any>
                ("http://localhost:51681/api/prodavnicaoieadmin/account/delete/" + accountId, this.authOptionHeader).toPromise()
            }, 1000);
          })
        });
      }
      else return Promise.reject("Necessary services are not active");
    })
    
  }

  public findAccount(accountId: number): Promise<Account> {
    return this.http.get<Account>
      ("http://localhost:51681/api/prodavnicaoieadmin/account/find/" + accountId, this.authOptionHeader).toPromise();
  }

  public getTotalNumber(): Promise<number> {
    return this.http.get<number>
      ("http://localhost:51681/api/prodavnicaoieadmin/account/getTotalNumber", this.authOptionHeader).toPromise();
  }

  public getListOfAccounts(): Promise<Array<Account>> {
    return this.http.get<Array<Account>>
      ("http://localhost:51681/api/prodavnicaoieadmin/account/listAll", this.authOptionHeader).toPromise();
  }
}
