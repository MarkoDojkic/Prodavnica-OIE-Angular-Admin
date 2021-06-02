import { ProductService } from './../../services/product/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  
  /* productsChips: Array<string> */

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
  }

}
