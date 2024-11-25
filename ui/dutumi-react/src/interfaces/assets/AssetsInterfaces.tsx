import {SystemUser, User} from '../system/AuthInterfaces';
import {Project} from "interfaces/projects/ProjectsInterfaces";

export interface ProjectType {
    type: string,
    code: string
}

export interface Asset {
    id: string,
    name: string
    description: string
    status: string
    created_at: string,
    assets_count: number,
    project: Project,
    author: SystemUser
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

