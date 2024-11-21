import {Commission} from "./CommissionInterfaces";


export interface ReferralAgent {
    "id": number,
    "fullName": string,
    "createdDate": string,
    "phoneNumber": string,
    "region": string,
    "status": string,
    "totalCommissions": number,
    "issuedCommissions": number,
    "unIssuedCommissions": number
}

export interface CommissionedReferralAgent {
    "id": number,
    "first_name": string,
    "second_name": string,
    "phone_number": string,
    "reference_number": string,
    "sales_zone": string,
    "created_at": string,
    "commissions_sum_amount": string,
    "commissions_count": string,
    "commissions" : Commission[]
}

