import {
    Button, Card,
    Col,
    Divider,
    List,
    Modal,
    Row, Space,
    Spin, Statistic, Tag
} from 'antd';

import '../../../css/business.css';
import React, {useEffect, useState} from 'react';


import {CalendarOutlined, UndoOutlined, UserOutlined} from "@ant-design/icons";
import {notifyHttpError} from "../../../services/notification/notifications";
import {getRequest} from "../../../services/rest/RestService";
import customerLoadingIcon from "../../templates/Loading";
import {Business} from "../../../interfaces/businesses/BusinessInterfaces";
import featuresIcon from "../../../assets/images/icons/generic/features.png"
import issueIcon from "../../../assets/images/icons/generic/issue.png"
import takeOffIcon from "../../../assets/images/icons/generic/takeoff.png"
import projectIcon from "../../../assets/images/icons/generic/folder.png"

import {useNavigate, useParams} from "react-router-dom";
import GoodContentCardPlain from "../../templates/cards/GoodContentCardPlain";
import ProjectMembersComponent from "./members/ProjectMembersComponent";
import ProjectIssuesComponent from "./issues/ProjectIssuesComponent";
import GoodImageIcon from "../../templates/icons/GoodImageIcon";
import {Project} from "../../../interfaces/projects/ProjectsInterfaces";
import {limitText} from "../../../utils/helpers";



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
        </Row>

        <Row gutter={16} style={{marginTop: '8px', marginBottom: '12px'}}>
            <Col span={24}>
                <Row gutter={16} style={{marginBottom: '12px'}}>
                    <Col span={6}>
                        <Card className="dtm-btn" onClick={navigateToFeatures} bordered={false}
                              style={{border: '1px solid #e3d5ca'}}>
                            <Statistic title="Features"
                                       value={(0).toLocaleString()}
                                       prefix={<GoodImageIcon iconPath={featuresIcon}/>}
                                       suffix={``}/>
                        </Card>
                    </Col>

                    <Col span={6}>
                        <Card bordered={false} style={{border: '1px solid #e3d5ca'}}>
                            <Statistic title="Issues" value={(0).toLocaleString()}
                                       prefix={<GoodImageIcon iconPath={issueIcon}/>}/>
                        </Card>
                    </Col>

                    <Col span={6} style={{marginTop: '0'}}>
                        <Card bordered={false} style={{border: '1px solid #e3d5ca'}}>
                            <Statistic title="Releases" value={(0).toLocaleString()}
                                       prefix={<GoodImageIcon iconPath={takeOffIcon}/>}
                                       suffix={``}/>
                        </Card>
                    </Col>

                    <Col span={6} style={{marginTop: '0'}}>
                        <Card onClick={viewProducts}
                              bordered={false}
                              style={{border: '1px solid #e3d5ca'}}>
                            <Statistic title="Products" value={(0).toLocaleString()}
                                       prefix={<GoodImageIcon iconPath={featuresIcon}/>}
                                       suffix=""/>
                        </Card>
                    </Col>
                </Row>
            </Col>

        </Row>


        {/***---------------------------
         /* Issues
         **-----------------------------*/}
        <div style={{height: '48px'}}></div>
        <ProjectIssuesComponent project={project}></ProjectIssuesComponent>

        {/***---------------------------
         /* Members
         **-----------------------------*/}
        <div style={{height: '48px'}}></div>
        <ProjectMembersComponent projectId={projectId}></ProjectMembersComponent>

    </GoodContentCardPlain>;

}

export default ProjectDetailsComponent

