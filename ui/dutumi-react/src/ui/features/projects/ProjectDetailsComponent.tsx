import {
    Button, Card,
    Col,
    Divider,
    List,
    Modal,
    Row,
    Spin, Statistic
} from 'antd';

import '../../../css/business.css';
import React, {useEffect, useState} from 'react';


import {UndoOutlined} from "@ant-design/icons";
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
import ProjectMembersComponent from "./components/ProjectMembersComponent";
import ProjectIssuesComponent from "./issues/ProjectIssuesComponent";
import GoodImageIcon from "../../templates/icons/GoodImageIcon";



const ProjectDetailsComponent = () => {

    const {projectId} = useParams();

    const [business, setBusiness] = useState<Business>();
    const [businessSchema, setBusinessSchema] = useState<String>();
    const [isLoading, setIsLoading] = useState(false);

    const [selectedSubscription, setSelectedSubscription] = useState<Business | null>();
    const [isSubscriptionVisible, setSubscriptionsModalVisible] = useState(false);
    const navigate = useNavigate();


    //Fetch products
    useEffect(() => {
        // fetchBusinessesDetails();
    }, []);

    const fetchBusinessesDetails = () => {
        const url = `/api/v1/manage/businesses/details?id=${projectId}`;
        console.log(`fetching businesses details... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                setBusiness(response.data.respBody);
                setBusinessSchema(response.data.respBody.schemaName);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const isActive = () => {
        return business?.status == 'ACTIVE_LICENCE';
    }

    const showSuspensionForm = (action: string) => {
    }

    const viewUser = () => {
        navigate(`/users/${business?.owner?.id}`);
    }

    const viewProducts = () => {
        navigate(`/businesses/products/${business?.id}?sc=${businessSchema}`);
    }

    const navigateToFeatures = () => {
        navigate(`/projects/features?projectId=${projectId}`);
    }

    const viewOrders = () => {
        navigate(`/businesses/orders/${business?.id}?sc=${businessSchema}`);
    }

    return <GoodContentCardPlain title="Project Details"
                                 iconImage={projectIcon}
                                 extraHeaderItems={[
                                     isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>,
                                     <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={() => {
                                         fetchBusinessesDetails();
                                     }} key="2" type="default">Refresh</Button>,
                                     //  <Button href="/products/instance/new" key="1" type="primary">Add Order</Button>
                                 ]}>

        <Row gutter={16} style={{marginTop: '32px', marginBottom: '12px'}}>
            <Col span={24}>
                <Row gutter={16} style={{ marginBottom: '12px'}}>
                    <Col span={6}>
                        <Card className="dtm-btn"  onClick={navigateToFeatures} bordered={false} style={{border: '1px solid #e3d5ca'}}>
                            <Statistic title="Features"
                                       value={(business?.stats?.branchesCount ?? 0).toLocaleString()}
                                       prefix={<GoodImageIcon iconPath={featuresIcon}/>}
                                       suffix={``}/>
                        </Card>
                    </Col>

                    <Col span={6}>
                        <Card bordered={false} style={{border: '1px solid #e3d5ca'}}>
                            <Statistic title="Issues" value={(business?.stats?.usersCount ?? 0).toLocaleString()}
                                       prefix={<GoodImageIcon iconPath={issueIcon}/>}/>
                        </Card>
                    </Col>

                    <Col span={6} style={{ marginTop:'0'}}>
                        <Card bordered={false} style={{border: '1px solid #e3d5ca'}}>
                            <Statistic title="Releases" value={(business?.stats?.usersCount ?? 0).toLocaleString()}
                                       prefix={<GoodImageIcon iconPath={takeOffIcon}/>}
                                       suffix={``}/>
                        </Card>
                    </Col>

                    <Col span={6} style={{ marginTop:'0'}}>
                        <Card onClick={viewProducts}
                              bordered={false}
                              style={{border: '1px solid #e3d5ca'}}>
                            <Statistic title="Products" value={(business?.stats?.products ?? 0).toLocaleString()}
                                       prefix={<GoodImageIcon iconPath={featuresIcon}/>}
                                       suffix=""/>
                        </Card>
                    </Col>
                </Row>
            </Col>


        </Row>


        {/***---------------------------
         /* Subscriptions
         **-----------------------------*/}
        <Row style={{marginTop: '64px'}}>
            <Col span={24}>
                <ProjectIssuesComponent business={business}></ProjectIssuesComponent>
            </Col>
        </Row>

        <Row style={{marginTop: '64px'}}>
            <Col span={24}>
                <ProjectMembersComponent projectId={projectId}></ProjectMembersComponent>
            </Col>
        </Row>



    </GoodContentCardPlain>;

}

export default ProjectDetailsComponent

