import { Category } from './category';

export class Product {
    id?: number;
    name: string;
    category: Category;
    description: string;
    leftInStock: number;
    price: number;
}