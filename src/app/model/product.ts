import { Category } from './category';

export class Product {
    id?: number;
    name: string;
    category: Category;
    description: string;
    leftInStock: number;
    price: number;

    //for showing in orders as ordered product
    orderedQuantity?: number;
    markedForDeletion?: boolean = false;
    isEditing?: boolean = false;
    newStockQuantity?: number;
    newPrice?: number;
}