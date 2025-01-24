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
import {
    BankOutlined,
    CalendarOutlined, ExportOutlined, PauseCircleOutlined,
    PlayCircleOutlined, TagsOutlined, TeamOutlined,
    UserOutlined
} from "@ant-design/icons";
import {UndoOutlined} from "@ant-design/icons";
import {notifyHttpError} from "../../../services/notification/notifications";
import {getRequest} from "../../../services/http/RestClient";
import customerLoadingIcon from "../../templates/Loading";
import {Business} from "../../../types/businesses/BusinessInterfaces";
import sectionIcon from "../../../assets/images/icons/subscription.png"
import {useNavigate, useParams} from "react-router-dom";
import GoodLabelValueWidget from "../../templates/GoodLabelValueWidget";
import BranchesComponent from "./components/BusinessBranchesComponent";
import BusinessSubscriptionsComponent from "./components/BusinessSubscriptionsComponent";
import BusinessStaffComponent from "./components/BusinessStaffComponent";
import {BsBuilding} from "react-icons/bs";
import GoodContentCardPlain from "../../templates/cards/GoodContentCardPlain";

const BusinessDetailsComponent = () => {

    const {businessId} = useParams();

    const [business, setBusiness] = useState<Business>();
    const [businessSchema, setBusinessSchema] = useState<String>();
    const [isLoading, setIsLoading] = useState(true);

    const [selectedSubscription, setSelectedSubscription] = useState<Business | null>();
    const [isSubscriptionVisible, setSubscriptionsModalVisible] = useState(false);
    const navigate = useNavigate();


    //Fetch products
    useEffect(() => {
        fetchBusinessesDetails();
    }, []);

    const fetchBusinessesDetails = () => {
        const url = `/api/v1/manage/businesses/details?id=${businessId}`;
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

    const viewOrders = () => {
        navigate(`/businesses/orders/${business?.id}?sc=${businessSchema}`);
    }

    return <GoodContentCardPlain title="Business Details"
                                 iconImage={sectionIcon}
                                 extraHeaderItems={[
                                     isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>,
                                     <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={() => {
                                         fetchBusinessesDetails();
                                     }} key="2" type="default">Refresh</Button>,
                                     //  <Button href="/products/instance/new" key="1" type="primary">Add Order</Button>
                                 ]}>


        <Row>
            <Col span={8}>
                <Card className="good-shadow"
                      title={<> <BsBuilding style={{marginRight: '12px'}}></BsBuilding> Business</>}
                      style={{marginRight: '18px', backgroundColor: '#f7f2ef'}}>
                    <GoodLabelValueWidget borderColor="#e6d7cf" label="Name" value={business?.name}/>
                    <GoodLabelValueWidget borderColor="#e6d7cf" label="Phone" value={business?.phoneNumber}/>
                    <GoodLabelValueWidget borderColor="#e6d7cf" label="Email" value={business?.email}/>
                    <GoodLabelValueWidget borderColor="#e6d7cf" label="Schema" value={business?.schemaName}/>
                    <GoodLabelValueWidget borderColor="#e6d7cf" label="Status" value={business?.status} isTag={true}
                                          tagColor={`${business?.status == 'ACTIVE_LICENCE' ? 'green' : 'red'}`}/>
                    {isActive() ?
                        <Button icon={<PauseCircleOutlined/>} style={{margin: '0px 0px', backgroundColor: '#ff595e'}}
                                onClick={() => {
                                    showSuspensionForm("block")
                                }} type="primary">Suspend Business</Button> :
                        <Button icon={<PlayCircleOutlined/>} style={{margin: '0px 0px', backgroundColor: '#57cc99'}}
                                onClick={() => {
                                    showSuspensionForm("activate")
                                }} type="primary">Activate Business</Button>
                    }
                </Card>
            </Col>

            <Col span={8}>
                <Card className="good-shadow"
                      title={<><UserOutlined style={{marginRight: '18px'}}></UserOutlined>Owner</>}
                      style={{marginRight: '12px', backgroundColor: '#f0f6f8'}}>
                    <GoodLabelValueWidget borderColor="#d1e4eb" label="Name" value={`${business?.owner?.firstName} ${business?.owner?.lastName}`}/>
                    <GoodLabelValueWidget borderColor="#d1e4eb" label="Email" value={business?.owner?.email}/>
                    <GoodLabelValueWidget borderColor="#d1e4eb" label="Phone" value={business?.owner?.phoneNumber}/>
                    <GoodLabelValueWidget borderColor="#d1e4eb" label="Joined" value={business?.owner?.createdDate}/>
                    <GoodLabelValueWidget borderColor="#d1e4eb" label="Status" value={business?.owner?.status}
                                          isTag={true}
                                          tagColor={`${business?.owner?.status == 'ACTIVE' ? 'green' : 'red'}`}/>
                    <Button icon={<ExportOutlined/>} style={{margin: '0px 0px'}} onClick={viewUser} type="link">View
                        User</Button>

                </Card>
            </Col>

            <Col span={8}>
                <Card className="good-shadow"
                      title={<><CalendarOutlined style={{marginRight: '12px'}}></CalendarOutlined> Current
                          Subscription</>}
                      style={{backgroundColor: '#f7fdfe'}}>
                    <GoodLabelValueWidget label="Start" value={business?.subscription?.startDate}/>
                    <GoodLabelValueWidget label="End" value={business?.subscription?.endDate}/>
                    <GoodLabelValueWidget label="Created" value={business?.subscription?.createdDate}/>
                    <GoodLabelValueWidget label="Paid" value={`${business?.subscription?.amountPaid} TZS`}/>
                    <GoodLabelValueWidget label="Status" value={`${business?.subscription?.status}`} isTag={true}
                                          tagColor={`${business?.owner?.status == 'ACTIVE' ? 'green' : 'red'}`}/>
                </Card>
            </Col>
        </Row>

        <Row gutter={16} style={{marginTop: '32px', marginBottom: '12px'}}>
            <Col span={4}>
                <Card bordered={false} style={{border: '1px solid #e3d5ca'}}>
                    <Statistic title="Users" value={(business?.stats?.usersCount ?? 0).toLocaleString()}
                               prefix={<UserOutlined/>}/>
                </Card>
            </Col>
            <Col span={4}>
                <Card bordered={false} style={{border: '1px solid #e3d5ca'}}>
                    <Statistic title="Branches" value={(business?.stats?.branchesCount ?? 0).toLocaleString()}
                               prefix={<BankOutlined/>}
                               suffix={`/${business?.subscription?.numberOfBranches}`} />
                </Card>
            </Col>
            <Col span={4}>
                <Card bordered={false} style={{border: '1px solid #e3d5ca'}}>
                    <Statistic title="Staff" value={(business?.stats?.usersCount ?? 0).toLocaleString()}
                               prefix={<TeamOutlined/>}
                               suffix={`/${business?.subscription?.numberOfUsers}`} />
                </Card>
            </Col>
            <Col span={4}>
                <Card onClick={viewProducts}
                      bordered={false}
                      style={{border: '1px solid #e3d5ca'}}>
                    <Statistic title="Products" value={(business?.stats?.products ?? 0).toLocaleString()}
                               prefix={<TagsOutlined/>}
                               suffix=""/>
                </Card>
            </Col>
            <Col span={4}>
                <Card bordered={false} style={{border: '1px solid #e3d5ca'}}>
                    <Statistic title="Product Variations" value={(business?.stats?.variants ?? 0).toLocaleString()}
                               prefix={<TagsOutlined/>}
                               suffix=""/>
                </Card>
            </Col>
            <Col span={4}>
                <Card
                    onClick={viewOrders}
                    bordered={false} style={{border: '1px solid #e3d5ca'}}>
                    <Statistic title="Orders" value={(business?.stats?.orders ?? 0).toLocaleString()}
                               suffix=""/>
                </Card>
            </Col>
        </Row>


        {/***---------------------------
         /* Branches
         **-----------------------------*/}
        <Row style={{marginTop: '64px'}}>
            <Col span={12}>
                <BranchesComponent business={business}></BranchesComponent>
            </Col>

            <Col span={12}>
                <BusinessStaffComponent business={business}></BusinessStaffComponent>
            </Col>
        </Row>

        {/***---------------------------
         /* Subscriptions
         **-----------------------------*/}
        <Row style={{marginTop: '64px'}}>
            <Col span={24}>
                <BusinessSubscriptionsComponent business={business}></BusinessSubscriptionsComponent>
            </Col>
        </Row>


        {/***------------------------------
         /*  Subscription Details
         ***------------------------------*/}
        <Modal title="Subscription Details"
               open={isSubscriptionVisible}
               footer={<></>}
               onCancel={() => {
                   setSubscriptionsModalVisible(false)
               }}>

            <List>
                <List.Item key="1">
                    <List.Item.Meta
                        title={<p style={{fontWeight: 'lighter', padding: '0px', margin: '0px'}}>Phone</p>}
                    />
                    <div>
                        {selectedSubscription?.phoneNumber}
                    </div>
                </List.Item>
                <List.Item key="2" style={{margin: '0px', padding: '0px'}}>
                    <List.Item.Meta
                        title={<p style={{fontWeight: 'lighter', padding: '0px', margin: '0px'}}>Topic</p>}/>
                    <div>{selectedSubscription?.name ?? 'Unknown'}</div>
                </List.Item>
                <List.Item key="2" style={{margin: '0px', padding: '0px'}}>
                    <List.Item.Meta
                        title={<p style={{fontWeight: 'lighter', padding: '0px', margin: '0px'}}>Start Date</p>}/>
                    <div>{selectedSubscription?.startDate ?? 'Unknown'}</div>
                </List.Item>
                <List.Item key="2" style={{margin: '0px', padding: '0px'}}>
                    <List.Item.Meta
                        title={<p style={{fontWeight: 'lighter', padding: '0px', margin: '0px'}}>End Date</p>}/>
                    <div>{selectedSubscription?.endDate ?? 'Unknown'}</div>
                </List.Item>
            </List>
            <Divider/>

            <h3 style={{marginTop: '48px'}}>Transactions</h3>
            <div style={{border: '1px solid #f1f1f1', padding: '8px 16px'}}>
                <List
                    dataSource={selectedSubscription?.transactions}
                    renderItem={(transaction) => (
                        <List.Item key={transaction.id} style={{margin: '0px', padding: '0px'}}>
                            <List.Item.Meta
                                title={<p>{transaction?.amount} TZS</p>}
                                description={`${transaction.paymentMethodId} ${transaction.channel}`}
                            />
                            <div>{transaction?.createdDate}</div>
                        </List.Item>
                    )}
                />
            </div>

        </Modal>


    </GoodContentCardPlain>;

}

export default BusinessDetailsComponent

