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

    //For editing and table
    accountName?: string = undefined;
    accountSurname?: string = undefined;
    shippingMethodNew?: "PERSONAL" | "COURIER" | "POST" = undefined;
    statusNew?: "PENDING" | "CANCELED" | "COMPLETED" = undefined;
    isEditing?: boolean = false;
}