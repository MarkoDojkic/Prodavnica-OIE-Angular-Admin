/* enum ShippingMethods {
    PERSONAL,COURIER,POST
}

enum Status {
    PENDING,CANCELED,COMPLETED
} */

export class Order {
    id?: Number;
    account_id: Number;
    shippingMethod: "PERSONAL" | "COURIER" | "POST";
    status: "PENDING" | "CANCELED" | "COMPLETED";
}