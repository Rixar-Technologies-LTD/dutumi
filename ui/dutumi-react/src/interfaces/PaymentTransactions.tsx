import {Business} from "./businesses/BusinessInterfaces";

export interface PaymentTransaction {

    "createdDate": string,
    "id": string,
    "businessSubscriptionId": string,
    "businessId": string,
    "channel": string,
    "channelTransactionId": string,
    "paymentMethodId": string,
    "amount": number,
    "amountIndex": string,
    "currency": string,
    "payerName": string,
    "payerPhone": string,
    "payerAccount": string,
    "referenceNumber": string,
    "financialServiceProvider": string,
    "remark": string,
    "narration": string,
    "business": Business
}
