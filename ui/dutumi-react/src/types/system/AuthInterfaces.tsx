import {Business} from "../businesses/BusinessInterfaces";


export interface SystemUser {
    "id": string,
    "name": string,
    "email": string,
    "created_at": string
}

export interface User {

    "id": number,
    "username": string,
    "fullName": string,
    "status": string,
    "created_at": string,
    "creator_name": string,
    "creator_id": string,
    "name": string,
    "last_login_at": string,
    "logins_count": number,
    "workspace": Workspace,
    "creator": User,



    "createdBy": string,
    "lastModifiedBy": string,
    "createdDate": string,
    "lastModifiedDate": string,
    "deletedDate": string,
    "permissionNames": String[],
    "email": string,
    "phoneNumber": string,
    "identifierType": string,
    "customerIdentifier": string,
    "staffId": string,
    "salesChannelIdentifier": string,
    "partnerIdentifier": string,
    "businessIdentifier": string,
    "preferredBranchId": string,
    "firstName": string,
    "middleName": string,
    "lastName": string,
    "statusRemark": string,
    "activationTokenTrials":string,
    "activationTokenExpiresAt": string,
    "recoveryTokenExpiresAt": string,
    "recoveryTrialsRemaining": string,
    "failedLoginsCount": string,
    "lastLoginDate": string,
    "loginSessions": string,
    "usedLoginIdentifier": string,
    "emailVerifiedAt": string,
    "phoneVerifiedAt": string,
    "userVerifiedAt": string,
    "roles": [],
    "plainActivationToken": string,
    "plainRecoveryToken": string,
    "permissions": [],
    "isActive": string,
    "isBlocked": string,
    "business": Business

}

export interface Staff {
    "createdBy": string,
    "lastModifiedBy": string,
    "createdDate": string,
    "lastModifiedDate": string,
    "deletedDate": string,
    "id": number,
    "name": string,
    "email": string,
    "is_active": number,
    "created_at": string,
    "updated_at": string,
    "new_password": string
    "assigned_permissions": string[]
}


export interface Contenstant {
    "id": number,
    "code": string,
    "name": string,
    "club_code": string,
    "club_name": string,
    "votes_count": number,
    "is_active": number,
    "email": string,
    "created_at": string,
    "updated_at": string
}

export interface UserPermission {
    "id": number,
    "permission": string
}

export interface PermissionGroup {
    "groupName": string,
    "permissions": Permission[]
}

export interface Permission {
    "code": string,
    "description": string
}

export interface Workspace {
    "id": string,
    "user_id": string,
    "name": string,
    "status": string,
    "created_at": string,
    "updated_at": string
}


