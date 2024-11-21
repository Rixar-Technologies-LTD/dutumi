import {Business} from "../businesses/BusinessInterfaces";


export interface Commission {
    "id": number,
    "amount": string,
    "percentage": string,
    "created_at": string,
    "subscription": Business
}
