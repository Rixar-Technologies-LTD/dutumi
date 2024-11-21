 ;

export interface Product {
    "id": string,
    "createdDate": string,
    "name": string,
    "cachedMinPrice": number,
    "productStatus": string,
    "productVariantList": ProductVariant[],
}

export interface ProductVariant {
    "id": 13,
    "createdDate": string,
    "productId": string,
    "businessId": string,
    "discountAmount": string,
    "variantName": string,
    "thumbnailUrl": string,
    "fullName": string,
    "barCode": string,
    "sellingPrice": number,
    "buyingPrice": number,
    "lowStockLevel": number,
    "storeKeepingUnit": string,
    "categoryIdLevel1": number
}

export interface Order {
    "id": string,
    "createdDate": string,
    "productNames": string,
    "amountDue": number,
    "productStatus": string,
    "deliveryStatus": string,
    "orderProducts": OrderProduct[],
}

export interface OrderProduct {
    "id": 13,
    "createdDate": string,
    "productId": string,
    "businessId": string,
    "discountAmount": string,
    "productName": string,
    "thumbnailUrl": string,
    "fullName": string,
    "barCode": string,
    "sellingPrice": number,
    "buyingPrice": number,
    "lowStockLevel": number,
    "storeKeepingUnit": string,
    "categoryIdLevel1": number
}
