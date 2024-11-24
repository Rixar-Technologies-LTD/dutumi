
import { Button, Spin } from 'antd';
import '../../../css/business.css';
import React, {useEffect, useState} from 'react';


import { UndoOutlined} from "@ant-design/icons";
import {notifyHttpError} from "../../../../services/notification/notifications";
import {getRequest} from "../../../../services/rest/RestService";
import customerLoadingIcon from "../../../templates/Loading";
import {Business} from "../../../../interfaces/businesses/BusinessInterfaces";
import projectIcon from "../../../../assets/images/icons/generic/folder.png"

import {useNavigate, useParams} from "react-router-dom";
import GoodContentCardPlain from "../../../templates/cards/GoodContentCardPlain";
import {Project} from "../../../../interfaces/projects/ProjectsInterfaces";
import ProjectMembersComponent from "./ProjectMembersComponent";



const ProjectMembersHolderComponent = () => {

    const {projectId} = useParams();

    const [project, setProject] = useState<Project>();
    const [businessSchema, setBusinessSchema] = useState<String>();
    const [isLoading, setIsLoading] = useState(false);

    const [selectedSubscription, setSelectedSubscription] = useState<Business | null>();
    const [isSubscriptionVisible, setSubscriptionsModalVisible] = useState(false);
    const navigate = useNavigate();


    //Fetch products
    useEffect(() => {
        fetchProjectDetails();
    }, []);

    const fetchProjectDetails = () => {
        const url = `/api/v1/projects/details?id=${projectId}`;
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                setProject(response.data.respBody);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const isActive = () => {
        return project?.status == 'ACTIVE_LICENCE';
    }

    const viewProducts = () => {
        navigate(`/businesses/products/${project?.id}?sc=${businessSchema}`);
    }

    const navigateToFeatures = () => {
        navigate(`/projects/features?projectId=${projectId}`);
    }


    return <GoodContentCardPlain title="Project Details"
                                 iconImage={projectIcon}
                                 extraHeaderItems={[
                                     isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>,
                                     <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={() => {
                                         fetchProjectDetails();
                                     }} key="2" type="default">Refresh</Button>,
                                     //  <Button href="/products/instance/new" key="1" type="primary">Add Order</Button>
                                 ]}>

        {/***---------------------------
         /* Members
         **-----------------------------*/}
        <div style={{height: '48px'}}></div>
        <ProjectMembersComponent projectId={projectId}></ProjectMembersComponent>

    </GoodContentCardPlain>;

}

export default ProjectMembersHolderComponent

