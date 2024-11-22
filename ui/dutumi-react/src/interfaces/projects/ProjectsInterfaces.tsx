import {PaymentTransaction} from '../PaymentTransactions';
import {User} from '../system/AuthInterfaces';

export interface ProjectType {
    type: string,
    code: string
}

export interface Project {
    id: string,
    owner_user_id: string
    project_name: string
    project_description: string
    project_type: string
    start_date: string
    mvp_date: string
    status: string
    created_at: string
}
