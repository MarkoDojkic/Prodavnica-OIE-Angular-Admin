/* enum ShippingMethods {
    PERSONAL,COURIER,POST
}

enum Status {
    PENDING,CANCELED,COMPLETED
} */

export class Order {
    id?: number;
    account_id: number;
    shippingMethod: "PERSONAL" | "COURIER" | "POST";
    status: "PENDING" | "CANCELED" | "COMPLETED";
}