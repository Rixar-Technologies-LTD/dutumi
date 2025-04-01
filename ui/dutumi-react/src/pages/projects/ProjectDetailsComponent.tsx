import {
    Button, Card,
    Col,
    List,
    Row, Space,
    Spin, Statistic, Tag
} from 'antd';

import 'css/business.css';
import React, {useEffect, useState} from 'react';


import {CalendarOutlined, UndoOutlined} from "@ant-design/icons";
import {notifyHttpError} from "../../services/notification/notifications";
import {getRequest} from "../../services/http/RestClient";
import customerLoadingIcon from "components/Loading";
import {Business} from "types/businesses/BusinessInterfaces";
import featuresIcon from "assets/images/icons/generic/features.png"
import issueIcon from "assets/images/icons/generic/issue.png"
import takeOffIcon from "assets/images/icons/generic/takeoff.png"
import projectIcon from "assets/images/icons/generic/folder.png"

import {useNavigate, useParams} from "react-router-dom";
import GoodContentCardPlain from "components/cards/GoodContentCardPlain";
import GoodImageIcon from "components/icons/GoodImageIcon";
import {Project} from "types/projects/ProjectsInterfaces";
import {limitText} from "utils/helpers";
import ProjectFeaturesListComponent from "./features/ProjectFeaturesListComponent";


const ProjectDetailsComponent = () => {

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

    const navigateToMembers = () => {
        navigate(`/projects/members/${projectId}`);
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


        <Row gutter={16} style={{marginTop: '8px', marginBottom: '32px'}}>

            <Col span={8}>
                <List
                    style={{backgroundColor: '#ffffff'}}
                    bordered
                    size="large"
                    header={<Space>
                        Project Status <Tag color="blue">{project?.status}</Tag>
                    </Space>}
                >

                    {/*  Description */}
                    <List.Item>
                        {limitText(project?.description, 164)}
                    </List.Item>

                    {/*  Created By */}
                    <List.Item
                        actions={[<Space> {project?.name}</Space>]}>
                        Name
                    </List.Item>
                    {/*  Created By */}
                    <List.Item
                        actions={[<Space>  {project?.created_at}</Space>]}>
                        <CalendarOutlined/> Created
                    </List.Item>

                </List>
            </Col>


            <Col span={16}>
                <Row gutter={16} style={{marginBottom: '12px'}}>
                    <Col span={12} style={{ marginBottom:'16px'}}>
                        <Card className="dtm-btn" onClick={navigateToFeatures} bordered={false}
                              style={{border: '1px solid #e3d5ca'}}>
                            <Statistic title="Features"
                                       value={(0).toLocaleString()}
                                       prefix={<GoodImageIcon iconPath={featuresIcon}/>}
                                       suffix={``}/>
                        </Card>
                    </Col>

                    <Col span={12} style={{ marginBottom:'16px'}}>
                        <Card bordered={false} style={{border: '1px solid #e3d5ca'}}>
                            <Statistic title="Issues/Bugs" value={(0).toLocaleString()}
                                       prefix={<GoodImageIcon iconPath={issueIcon}/>}/>
                        </Card>
                    </Col>

                    <Col span={12} style={{marginTop: '0'}}>
                        <Card bordered={false} style={{border: '1px solid #e3d5ca'}}>
                            <Statistic title="Releases" value={(0).toLocaleString()}
                                       prefix={<GoodImageIcon iconPath={takeOffIcon}/>}
                                       suffix={``}/>
                        </Card>
                    </Col>

                    <Col span={12} style={{marginTop: '0'}}>
                        <Card className="dtm-btn" onClick={navigateToMembers}
                              bordered={false}
                              style={{border: '1px solid #e3d5ca'}}>
                            <Statistic title="People" value={(0).toLocaleString()}
                                       prefix={<GoodImageIcon iconPath={featuresIcon}/>}
                                       suffix=""/>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>


        {/***---------------------------
         /* Features
         **-----------------------------*/}
        <ProjectFeaturesListComponent projectId={projectId ?? ''}></ProjectFeaturesListComponent>


    </GoodContentCardPlain>;

}

export default ProjectDetailsComponent

