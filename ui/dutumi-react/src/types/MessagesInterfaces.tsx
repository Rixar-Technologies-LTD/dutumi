


export interface BroadcastMessage {
    "id": number,
    "title": string,
    "topic_code": string,
    "type": string,
    "imageUrl": string,
    "content": string,
    "approved": string,
    "sendAt": string,
    "createdDate": string,
    "cancelledAt": string,
    "deliveredAt": string,
    "topic": AppVersion,
}


export interface AppVersion {
    "createdDate": string,
    "id": string,
    "version": string,
    "buildNumber": string,
    "iosActive": boolean,
    "androidActive": boolean,
    "webActive": boolean
}

export interface SubscriptionStats {
    "reference": string,
    "subscriptions": number
}


export interface NotificationHistory {
    "id": number,
    "topicId": string,
    "content": string,
    "remark": string,
    "status": string,
    "pageNumber": number,
    "totalPages": number,
    "totalAudience": number,
    "receiversCount": number,
    "phoneNumber": string,
    "createdDate": String,
    "channel": String,
    "template": BroadcastMessage,
    "phones": String[],
}


export interface BroadCastEvent {
    "id": number,
    "total_audience_count": string,
    "sent_messages_count": string,
    "remark": string,
    "created_at": string,
    "message": BroadcastMessage,
    "batches": BroadCastEventBatch[],
}

export interface BroadCastEventBatch {
    "id": number,
    "phones_list": string[],
    "status": string,
    "retry_count": null,
    "last_retried_at": null,
    "remark": string,
    "audience_count": number,
    "created_at": string,
}

export interface NotificationTemplate {
    "id": number,
    "code": string,
    "type": string,
    "content": string,
    "updated_at": string,
    "last_updated_by": string
}

export interface SmsGateway {
    "id": number,
    "provider_code": string,
    "balance": string,
    "provider_name": string,
    "sender_id": string,
    "is_default": boolean,
    "is_available": boolean,
    "last_updated_by": boolean,
    "updated_at": boolean
}
