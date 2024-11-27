import {SystemUser, User} from '../system/AuthInterfaces';
import {Project} from "interfaces/projects/ProjectsInterfaces";

export interface ProjectType {
    type: string,
    code: string
}

export interface Asset {
    id: string,
    name: string
    type: string
    category: string
    location: string
    description: string
    status: string
    created_at: string,
    assets_count: number,


    unit_price: number,
    "price_currency": string,
    "unit_price_in_default_currency": string,

    vendor: string,
    next_payment_date: string,
    "ownership": string,
    "usage_status": string,

    "host_name": string,
    "ip_address": string,
    "mac_address": string,

    "processor_cores_count": string,
    "processor_type": string,
    "storage_size": string,
    "storage_type": string,

    "memory_size": string,
    "memory_type": string,
    "operating_system": string,
    "project": Project,
    "author": SystemUser
}

export interface AssetGroup {
    id: string,
    name: string
    description: string
    status: string
    created_at: string,
    assets_count: number,
    project: Project,
    author: SystemUser
}

