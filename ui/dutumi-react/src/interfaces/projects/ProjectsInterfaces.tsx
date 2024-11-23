import {PaymentTransaction} from '../PaymentTransactions';
import {SystemUser, User} from '../system/AuthInterfaces';

export interface ProjectType {
    type: string,
    code: string
}

export interface Project {
    id: string,
    owner_user_id: string
    name: string
    description: string
    type: string
    start_date: string
    mvp_date: string
    status: string
    created_at: string
}

export interface ProjectMember {
    id: string,
    project_id: string
    user_id: string
    status: string
    created_at: string,
    user: SystemUser,
    added_by_user: SystemUser
}


export interface Task {
    "id": string,
    "project_id": string,
    "creator_user_id": string,
    "assignee_user_id": string,
    "name": string,
    "type": string,
    "status": string,
    "description": string,
    "start_date": string,
    "end_date": string,
    "remark": string,
    "created_at": string,
    "updated_at": string,

    "creator": SystemUser,
    "owner": SystemUser,
    "designer": SystemUser,
    "implementor": SystemUser,
    "tester": SystemUser,
    "approver": SystemUser,
    "deployer": SystemUser,
}

export interface Member {
    "id": string,
    "status": string,
    "user": SystemUser,
    "author": SystemUser
}
