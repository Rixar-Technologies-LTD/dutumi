import {PaymentTransaction} from "./PaymentTransactions";


export interface SmartPhonePayment {
    id: number,
    transaction_id: string,
    paid_amount: number,
    package: string,
    created_at: string,
    phone_number: string,
    payment_status: string,
    delivery_status: string,
    remark: string,
    transactions : PaymentTransaction[]
}

export interface TeamTopic {
    id: number,
    name: string,
    code: string,
    subscribersCount: number,
    created_at: string,
}
