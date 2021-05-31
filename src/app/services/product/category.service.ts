import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from 'src/app/model/category';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly authOptionHeader = {
    headers: {
      "Authorization": "Basic " + btoa("prodavnica-oie-admin:" + this.cryptoService.encrypt("8fefa3caea331537a156a114299d5b60ff96a9c5e2e34b824ccfc4fb3d33e3bc6cc34486365e15c4885870da648505e7cc9f957b7383e2a421e766c113f47f0c", "prodavnicatestadmin123456"))
    }
  }

  constructor(private http: HttpClient, private cryptoService: CryptoService) { }

  public addNewCategory(newCategory: Category): Promise<Category> {
    return this.http.post<Category>
      ("http://localhost:51682/api/prodavnicaoieadmin/category/insert", newCategory, this.authOptionHeader).toPromise();
  }

  public updateCategory(categoryId: number, newCategoryData: Category): Promise<Category> {
    return this.http.patch<Category>
      ("http://localhost:51682/api/prodavnicaoieadmin/category/update/" + categoryId, newCategoryData, this.authOptionHeader).toPromise();
  }

  public deleteCategory(categoryId: number): Promise<any> {
    return this.http.delete<any>
      ("http://localhost:51682/api/prodavnicaoieadmin/category/delete/" + categoryId, this.authOptionHeader).toPromise();
  }

  public findCategory(categoryId: number): Promise<Category> {
    return this.http.get<Category>
      ("http://localhost:51682/api/prodavnicaoieadmin/category/find" + categoryId, this.authOptionHeader).toPromise();
  }

  public getTotalNumber(): Promise<Number> {
    return this.http.get<Number>
      ("http://localhost:51682/api/prodavnicaoieadmin/category/getTotalNumber", this.authOptionHeader).toPromise();
  }

  public getListOfCategories(): Promise<Array<Category>> {
    return this.http.get<Array<Category>>
      ("http://localhost:51682/api/prodavnicaoieadmin/category/listAll", this.authOptionHeader).toPromise();
  }
}
