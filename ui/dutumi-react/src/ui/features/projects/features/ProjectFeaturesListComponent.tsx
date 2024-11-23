import {
    Button, DatePicker,
     Form, Input,
    Modal,
    Pagination,
    RadioChangeEvent, Select,
    Space,
    Spin,
    Table,
    Tag
} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {FileDoneOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    MessageOutlined,
    UndoOutlined,
    UsergroupAddOutlined
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import sectionIcon from "../../../../assets/images/pages/features.png"
import {useNavigate} from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import Compact from "antd/es/space/Compact";
import {Business, RemindersStats} from "../../../../interfaces/businesses/BusinessInterfaces";
import {Project, ProjectType, Task} from "../../../../interfaces/projects/ProjectsInterfaces";
import {SubscriptionStats} from "../../../../interfaces/MessagesInterfaces";
import {getRequest, postRequest} from "../../../../services/rest/RestService";
import {notifyHttpError, notifySuccess} from "../../../../services/notification/notifications";
import EyasiContentCard from "../../../templates/cards/EyasiContentCard";
import customerLoadingIcon from "../../../templates/Loading";
import {isEmpty} from "../../../../utils/helpers";


const ProjectFeaturesListComponent = () => {

    const columns: ColumnsType<Task> = [
        {
            title: 'REF',
            dataIndex: 'reference',
            key: 'reference',
            render: (_, record) => (
                <>
                    FEAT-{record.id}
                </>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <div>
                         {record.name}
                    </div>
                </>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, business) => (
                <>
                    <Tag color="processing">{business.status ?? 'UNKNOWN'}</Tag><br/>
                </>
            ),
        },
        {
            title: 'Assignee',
            dataIndex: 'location',
            key: 'location',
            render: (_, record) => (
                <>
                    {record.creator?.name ?? 'No Assignee'}
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
                        <Button type="default" size="small" onClick={()=>{}} >
                            <FileDoneOutlined/>
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
                    <Button type="primary" onClick={()=>{viewFeature(record)}}> View</Button>
                </Space>
            ),
        },
    ];

    const [projectsList, updateProjectsList] = useState<Project[]>([]);
    const [featuresList, updateFeaturesList] = useState<Task[]>([]);

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

    const [selectedProjectId, setSelectedProjectId] = useState<String>();
    const [messageModalOpen, setFeatureFormOpen] = useState(false)
    const [featureForm] = Form.useForm();


    //Fetch products
    useEffect(() => {
        fetchProjects();
    }, []);

    //Fetch products
    useEffect(() => {
        fetchFeatures();
    }, [selectedProjectId,currentPageNo, pageSize, searchQuery,filter]);

    const fetchProjects = () => {
        const url = `/api/v1/projects/list`;
        console.log(`fetching projects... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                updateProjectsList(response.data.respBody.data);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const fetchFeatures = () => {
        if(isEmpty(selectedProjectId)){
            console.log("no project selected")
            return ;
        }
        const url = `/api/v1/projects/features?projectId=${selectedProjectId}`;
        console.log(`fetching features... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                updateFeaturesList(response.data.respBody.data);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const fetchFeaturesStats= () => {
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

    const saveFeature = (item: any) => {

        const url:string = isEmpty(item.id)? '/api/v1/projects/features/add' : `/api/v1/projects/features/update`;
        setIsLoading(true);
        postRequest(url,{
            "project_id" : selectedProjectId,
            ...item
        })
            .then((response) => {
                console.log(response.data.payload);
                notifySuccess("Record Saved")
                setFeatureFormOpen(false)
                fetchFeatures();
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
               setIsLoading(false);
         })
    }

    const onPageChange = (page: number, pageSize: number) => {
        updateCurrentPageNo(page)
    }

    const onPageSizeChange = (current: number, size: number) => {
        updatePageSize(size)
    }

    const onSearch = (value: string) => {
        if(value===searchQuery){
            fetchFeatures()
        }
        updateSearchQuery(value)
    }

    const onFilterGroupChange = (e: RadioChangeEvent) => {
        setFilterGroup(e.target.value);
    };

    const showReminders = ()=>{
        setRemindersModalOpen(true)
        fetchFeaturesStats();
    }

    const showTransactions = (subscription: Business)=>{
        setSelectedSubscription(subscription);
        setSubscriptionsModalVisible(true);
    }

    const onProjectChanged = (value: any) => {
        setSelectedProjectId(value);
    };

    const viewFeature = (task:Task) => {
        navigate(`/projects/features/details?projectId=${task.id}`);
    }


    return <EyasiContentCard title="Features"
                             subTitle="Project Features"
                             iconImage={sectionIcon}
                             extraHeaderItems={[
                                 isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>,
                                 <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={()=>{
                                     fetchFeatures();
                                 }} key="2"
                                         type="default">Refresh</Button>
                             ]}>

        {/**---------------*
         /** Search
         *----------------*/}
        <Space style={{marginBottom: 24, marginTop: 48}} direction="horizontal">

            <div style={{padding: '8px 16px', border: '1px solid #00000000', borderRadius:'4px'}}>
                <Select
                    value={selectedProjectId}
                    onChange={onProjectChanged}
                    placeholder="Select Project"
                    style={{width: '100%',minWidth:'240px'}}
                    size="large"
                    options={projectsList.map((project) => ({label: project.name, value: project.id}))}
                />
            </div>

            <Search size="large"
                    placeholder="Search"
                    onSearch={onSearch}
                    allowClear/>

            <Button onClick={()=>{ setFeatureFormOpen(true) }}
                    size="large"
                    icon={<PlusCircleOutlined/>}
                    key="1" type="primary">Add Feature</Button>


            <div style={{padding: '8px 16px'}}>
                { filter !== 'all' && <Tag style={{ fontSize: '18px', color: 'blue', padding:'4px 8px'}} >{totalItems}</Tag>}
            </div>
        </Space>


        {/**---------------------------*
         /** Orders Table
         *-----------------------------*/}
        <Table
            columns={columns}
            dataSource={featuresList}
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
w
            <Button style={{marginTop: '24px'}} type="primary" loading={isLoading}>
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
        <Modal title="Feature"
               open={messageModalOpen}
               width="640px"
               onOk={() => {
                   featureForm.submit()
               }}
               confirmLoading={isLoading}
               okText="Save"
               onCancel={() => {
                   setFeatureFormOpen(false)
               }}>

            <Form
                form={featureForm}
                layout="vertical"
                onFinish={saveFeature}
            >

                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>

                <Form.Item
                    style={{marginBottom: 16, marginTop: '16px'}}
                    label="Feature Name"
                    name="name"
                >
                    <Input type={"text"}/>
                </Form.Item>

                <Form.Item
                    style={{marginBottom: 16, marginTop: '16px'}}
                    label="Feature Description"
                    name="description"
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
                        name="end_date"
                        label="End Date">
                        <DatePicker/>
                    </Form.Item>
                </Compact>


            </Form>
        </Modal>

    </EyasiContentCard>;

}

export default ProjectFeaturesListComponent

