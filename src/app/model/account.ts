export class Account {
    id?: number;
    name: string; 
    surname: string;
    password_hash: string;
    email: string;
    phoneNumber: string;
    mobilePhoneNumber: string;
    deliveryAddress: string;
    deliveryAddressPAK: string;

    /* For editing purposes */
    nameNew?: string = undefined; 
    surnameNew?: string = undefined;
    passwordNew?: string = undefined;
    emailNew?: string = undefined;
    phoneNumberNew?: string = undefined;
    mobilePhoneNumberNew?: string = undefined;
    deliveryAddressNew?: string = undefined;
    deliveryAddressPAKNew?: string = undefined;
    isEditing?: boolean = false;
}