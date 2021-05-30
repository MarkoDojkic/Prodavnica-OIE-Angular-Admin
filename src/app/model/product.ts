import { Category } from './category';

export class Product {
    id?: Number;
    name: String;
    category: Category;
    description: String;
    leftInStock: Number;
    price: Number;
}