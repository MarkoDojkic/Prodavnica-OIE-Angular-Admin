export class ProductReview {
    product_id: number;
    account_id: number;
    comment: string;
    review: number;

    //For display in table
    productName?: string;
    accountNameSurname?: string;
}