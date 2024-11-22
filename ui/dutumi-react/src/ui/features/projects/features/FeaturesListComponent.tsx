import {
    Button, DatePicker,
    Divider, Form, Input,
    List,
    Modal,
    Pagination,
    Radio,
    RadioChangeEvent, Select,
    Space,
    Spin,
    Table,
    Tag, TimePicker, Upload
} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {FileDoneOutlined, FileImageOutlined, UploadOutlined} from "@ant-design/icons";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    MessageOutlined,
    UndoOutlined,
    UsergroupAddOutlined
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import sectionIcon from "../../../assets/images/icons/subscription.png"
import {useNavigate} from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import Compact from "antd/es/space/Compact";
import {Business, RemindersStats} from "../../../../interfaces/businesses/BusinessInterfaces";
import {Project, ProjectType} from "../../../../interfaces/projects/ProjectsInterfaces";
import {SubscriptionStats} from "../../../../interfaces/MessagesInterfaces";
import {getRequest, postRequest} from "../../../../services/rest/RestService";
import {notifyHttpError, notifySuccess} from "../../../../services/notification/notifications";
import EyasiContentCard from "../../../templates/cards/EyasiContentCard";
import customerLoadingIcon from "../../../templates/Loading";


const FeaturesListComponent = () => {

    const columns: ColumnsType<Business> = [
        {
            title: 'REF',
            dataIndex: 'reference',
            key: 'reference',
            render: (_, record) => (
                <>
                    HSB-{record.id} <br/>
                    <span style={{ fontWeight: 'lighter', fontSize: '12px'}}>{record.createdDate}</span>
                </>
            ),
        },
        {
            title: 'Business',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <div>
                        <span style={{ color:'#5555ff'}}>{record.name}</span> <br/>
                        {record.phoneNumber} <br/>
                        {record.email} <br/>
                    </div>
                </>
            ),
        },
        {
            title: 'Licence Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, business) => (
                <>
                    <Tag color="processing">{business.status ?? 'UNKNOWN'}</Tag><br/>
                    Starts: {business?.subscription?.startDate}<br/>
                    Ends: <span style={{ }}>{business?.subscription?.endDate}</span><br/>
                </>
            ),
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: (_, record) => (
                <>
                    {record.physicalAddress ?? 'UNKNOWN'}
                </>
            ),
        },
        {
            title: 'Payments',
            dataIndex: 'transactions',
            key: 'transactions',
            render: (_, record) => (
                <>
                    <Space size="middle">
                        <Button type="default" size="small" onClick={()=>{showTransactions(record)}} >
                            <FileDoneOutlined/>
                            Transactions ({record.transactions?.length})
                        </Button>
                    </Space>
                </>
            ),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={()=>{viewBusiness(record)}}> View</Button>
                </Space>
            ),
        },
    ];

    const [subscribersList, updateSubscribersList] = useState<Business[]>([]);
    const [projectsList, updateProjectsList] = useState<Project[]>([]);
    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, updatePageSize] = useState(50);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, updateSearchQuery] = useState("");
    const [subscriptionStats, setStats] = useState<SubscriptionStats>();
    const [remindersStats, setRemindersStats] = useState<RemindersStats>();
    const [remindersModalOpen, setRemindersModalOpen] = useState<boolean>(false);

    const [selectedSubscription, setSelectedSubscription] = useState<Business|null>();
    const [isSubscriptionVisible, setSubscriptionsModalVisible] = useState(false);

    const [filter, setFilterGroup] = useState("all");
    const navigate = useNavigate();

    const [projectTypes, updateProjectTypes] = useState<ProjectType[]>([
        {type:"Mobile App",code:"MOBILE_APP"},
        {type:"Web App",code:"WEB_APP"},
        {type:"Micro Service",code:"MICROSERVICE"},
        {type:"Dashboard",code:"DASHBOARD"},
        {type:"Admin Portal",code:"PORTAL"}
    ]);
    const [selectedProjectType, setSelectedProjectType] = useState<ProjectType>();


    const [messageModalOpen, setMessageModal] = useState(false)
    const [messageForm] = Form.useForm();


    //Fetch products
    useEffect(() => {
        fetchProjects();
    }, [currentPageNo, pageSize, searchQuery,filter]);

    const fetchProjects = () => {
        const url = `/api/v1/projects/list`;
        console.log(`fetching projects... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                updateProjectsList(response.data.respBody.data);
                setTotalItems(response.data.respBody.total);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const viewBusiness = (business:Business) => {
        navigate(`/businesses/${business.id}`);
    }

    const fetchRemindersStats= () => {
        setIsLoading(true);
        const url = `/api/v1/reports/subscriptions/expired/reminders`;
        console.log(`fetching reminders stats... ${url}`)
        getRequest(url)
            .then((response) => {
                console.log(response.data.payload);
                setRemindersStats(response.data.payload);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const remindExpiredSubscribers = () => {

        const url:string = `/api/v1/messages/broadcast/reminders`;
        console.log(`Sending subscriptions reminders... ${url}`)

        setIsLoading(true);
        postRequest(url,{ })
            .then((response) => {
                console.log(response.data.payload);
                fetchRemindersStats();
                notifySuccess("Reminders Sent")
                setRemindersModalOpen(false)
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
            setRemindersModalOpen(false)
        })
    }


    const saveMessage = (item: {  }) => {

    }


    const onPageChange = (page: number, pageSize: number) => {
        updateCurrentPageNo(page)
    }

    const onPageSizeChange = (current: number, size: number) => {
        updatePageSize(size)
    }

    const onSearch = (value: string) => {
        if(value===searchQuery){
            fetchProjects()
        }
        updateSearchQuery(value)
    }

    const onFilterGroupChange = (e: RadioChangeEvent) => {
        setFilterGroup(e.target.value);
    };

    const showReminders = ()=>{
        setRemindersModalOpen(true)
        fetchRemindersStats();
    }

    const showTransactions = (subscription: Business)=>{
        setSelectedSubscription(subscription);
        setSubscriptionsModalVisible(true);
    }


    const onProjectTypeChange = (value: any) => {
        setSelectedProjectType(value);
    };

    return <EyasiContentCard title="Features"
                             subTitle="Project Features"
                             iconImage={sectionIcon}
                             extraHeaderItems={[
                                 isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>,
                                 <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={()=>{
                                     fetchProjects();
                                 }} key="2"
                                         type="default">Refresh</Button>,
                                 <Button onClick={()=>{ setMessageModal(true) }} key="1" type="primary">Add Project</Button>
                             ]}>

        {/**---------------*
         /** Search
         *----------------*/}
        <Space style={{marginBottom: 24, marginTop: 48}} direction="horizontal">


            <div style={{padding: '8px 16px', border: '1px solid #00000000', borderRadius:'4px'}}>
                <span>Project</span>
                <Select
                    value={selectedProjectType}
                    onChange={onProjectTypeChange}
                    placeholder="Select Project"
                    style={{width: '100%',minWidth:'240px'}}
                    size="large"
                    options={projectTypes.map((projectType) => ({label: projectType.type, value: projectType.code}))}
                />
            </div>

            <Search size="large"
                    placeholder="Search"
                    onSearch={onSearch}
                    allowClear/>

            <div style={{padding: '8px 16px'}}>
                { filter !== 'all' && <Tag style={{ fontSize: '18px', color: 'blue', padding:'4px 8px'}} >{totalItems}</Tag>}
            </div>
        </Space>


        {/**---------------------------*
         /** Orders Table
         *-----------------------------*/}
        <Table
            columns={columns}
            dataSource={subscribersList}
            pagination={false}
            loading={isLoading}
            rowKey="id"
        />

        {/**---------------------------*
         /** Pagination
         *-----------------------------*/}
        <Pagination style={{marginTop: 32, marginBottom: 32}}
                    pageSize={pageSize}
                    current={currentPageNo}
                    total={totalItems}
                    simple={false}
                    showSizeChanger={true}
                    onChange={onPageChange}
                    showQuickJumper={true}
                    onShowSizeChange={onPageSizeChange}
        />


        {/***------------------------------
         /*  Audience
         ***------------------------------*/}
        <Modal title="Subscription Reminders"
               open={remindersModalOpen}
               footer={<></>}
               confirmLoading={isLoading}
               onCancel={() => {
                   setRemindersModalOpen(false)
               }}>


            <p style={{padding: 0, margin: 0}}>
                <UsergroupAddOutlined style={{marginRight: '8px',color:'orange'}}/>
                Expired Subscriptions: {remindersStats?.expiredSubscriptions}
            </p>
            <p style={{padding: 0, margin: 0}}>
                <CheckCircleOutlined style={{marginRight: '8px',color:'green'}}/>
                Reminded: {remindersStats?.sentReminders}
            </p>
            <p style={{padding: 0, margin: 0}}>
                <ClockCircleOutlined style={{marginRight: '8px',color:'blue'}}/>
                Not Reminded: {remindersStats?.pendingReminders}
            </p>

            <h3 style={{padding: 0, margin: 0, marginTop: '12px'}}>
                <MessageOutlined style={{marginRight:'8px'}}></MessageOutlined>
                Reminder Message</h3>
            <p style={{padding: '8px', margin: 0,
                border:'1px solid #a9a9a9',
                backgroundColor: '#f5f5f5',
                borderRadius:'4px'}}>
                {remindersStats?.reminderMessage}
            </p>

            <Button style={{marginTop: '24px'}} type="primary" loading={isLoading} onClick={remindExpiredSubscribers}>
                <MessageOutlined/>
                Send Reminders to {remindersStats?.pendingReminders} Subscribers
            </Button>

        </Modal>


        {/***------------------------------
         /*  Subscription Details
         ***------------------------------*/}

        {/***------------------------------
         /*  Message
         ***------------------------------*/}
        <Modal title="Project"
               open={messageModalOpen}
               width="640px"
               onOk={() => {
                   messageForm.submit()
               }}
               confirmLoading={isLoading}
               okText="Save"
               onCancel={() => {
                   setMessageModal(false)
               }}>

            <Form
                form={messageForm}
                layout="vertical"
                onFinish={saveMessage}
            >


                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Project Type"
                    name="topicId"
                >
                    <Select
                        value={selectedProjectType}
                        onChange={onProjectTypeChange}
                        style={{width: '100%'}}
                        options={projectTypes.map((projectType) => ({label: projectType.type, value: projectType.code}))}
                    />
                </Form.Item>

                {/*<Form.Item*/}
                {/*    label="Channel"*/}
                {/*    name="type"*/}
                {/*>*/}
                {/*    <Select*/}
                {/*        value={selectedTopic}*/}
                {/*        onChange={onSecondCityChange}*/}
                {/*        style={{width: '100%'}}*/}
                {/*        options={[*/}
                {/*            {"label": "SMS", "value": "SMS_NEWS"},*/}
                {/*            {"label": "WhatsApp", "value": "WHATSAPP_NEWS"},*/}
                {/*        ].map((channel) => ({label: channel.label, value: channel.value}))}*/}
                {/*    />*/}
                {/*</Form.Item>*/}


                <Form.Item
                    style={{marginBottom: 48, marginTop: '16px'}}
                    label="Project Description"
                    name="content"
                >
                    <TextArea showCount/>
                </Form.Item>

                <Compact>
                    <Form.Item
                        name="start_date"
                        label="Start Date">
                        <DatePicker/>
                    </Form.Item>
                    <Form.Item
                        name="mvp_date"
                        label="MPV Release Date">
                        <DatePicker/>
                    </Form.Item>
                </Compact>


            </Form>
        </Modal>

    </EyasiContentCard>;

}

export default FeaturesListComponent

