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
import { PlusCircleOutlined} from "@ant-design/icons";
import {
    UndoOutlined
} from "@ant-design/icons";

import {notifyError, notifyHttpError, notifySuccess} from "../../../services/notification/notifications";
import {getRequest, postRequest} from "../../../services/rest/RestService";
import EyasiContentCard from "../../templates/cards/EyasiContentCard";
import customerLoadingIcon from "../../templates/Loading";
import {
    RemindersStats,
    Business,
    SubscriptionStats
} from "../../../interfaces/businesses/BusinessInterfaces";
import sectionIcon from "../../../assets/images/icons/projects.png"
import {useNavigate} from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import Compact from "antd/es/space/Compact";
import {Project, ProjectType} from "../../../interfaces/projects/ProjectsInterfaces";

const ProjectsListComponent = () => {

    const columns: ColumnsType<Project> = [
        {
            title: 'ID',
            dataIndex: 'reference',
            key: 'reference',
            render: (_, record) => (
                <>
                    PRJ-{record.id}
                </>
            ),
        },
        {
            title: 'Project Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <div>
                        <span style={{ color:'#5555ff'}}>{record.project_name}</span>
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
                    Starts: {business?.start_date}<br/>
                    MVP: <span style={{ }}>{business?.mvp_date}</span><br/>
                </>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'project_description',
            key: 'project_description',
            render: (_, record) => (
                <>
                    <div>
                        <span style={{ color:'#5555ff'}}>{record.project_description}</span>
                    </div>
                </>
            ),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={()=>{viewProject(record)}}>View</Button> <br/>
                    <Button type="default" onClick={()=>{showEditForm(record)}}>Edit</Button>
                </Space>
            ),
        }
    ];

    const [subscribersList, updateSubscribersList] = useState<Project[]>([]);
    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, updatePageSize] = useState(50);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, updateSearchQuery] = useState("");
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

    const [messageModalOpen, setProjectModal] = useState(false)
    const [projectForm] = Form.useForm();

    //Fetch products
    useEffect(() => {
        fetchProjects();
    }, [currentPageNo, pageSize, searchQuery,filter]);


    const fetchProjects = () => {
        const url = `/api/v1/projects/list?query=${searchQuery}&filterGroup=${filter}&pageSize=${pageSize}&pageNo=${currentPageNo-1}`;
        console.log(`Fetching projects... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                updateSubscribersList(response.data.respBody.data);
                setTotalItems(response.data.respBody.total);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const viewProject = (project:Project) => {
        navigate(`/projects/${project.id}`);
    }

    const showEditForm = (project: { }) => {
        projectForm.setFieldsValue(project)
        projectForm.setFieldValue("start_date","");
        projectForm.setFieldValue("mvp_date","");
        setProjectModal(true)
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

    const saveProject = (item: Project) => {
        setIsLoading(true);
        postRequest(item.id? "/api/v1/projects/update" : "/api/v1/projects/add", item)
            .then((response) => {
                notifySuccess("Success", "Saved!")
                setIsLoading(false);
                setProjectModal(false)
            }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
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


    return <EyasiContentCard title="Projects"
                             subTitle="My Project"
                             iconImage={sectionIcon}
                             extraHeaderItems={[
                                 isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>,
                                 <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={()=>{
                                     fetchProjects();
                                 }} key="2"
                                         type="default">Refresh</Button>
                             ]}>

        {/**---------------*
         /** Search
         *----------------*/}
        <Space style={{marginBottom: 24, marginTop: 8}} direction="horizontal">
            <Button icon={<PlusCircleOutlined/>} size="large" onClick={()=>{ setProjectModal(true) }} type="primary">Create Project</Button>
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
         /*  Project
         ***------------------------------*/}
        <Modal title="Project"
               open={messageModalOpen}
               width="640px"
               onOk={() => {
                   projectForm.submit()
               }}
               confirmLoading={isLoading}
               okText="Save"
               onCancel={() => {
                   setProjectModal(false)
               }}>

            <Form
                form={projectForm}
                layout="vertical"
                onFinish={saveProject}
            >

                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Project Type"
                    name="project_type"
                >
                    <Select
                        value={selectedProjectType}
                        onChange={onProjectTypeChange}
                        style={{width: '100%'}}
                        options={projectTypes.map((projectType) => ({label: projectType.type, value: projectType.code}))}
                    />
                </Form.Item>

                <Form.Item
                    style={{marginBottom: 24, marginTop: '16px'}}
                    label="Project name"
                    name="project_name"
                >
                    <Input type="text"/>
                </Form.Item>

                <Form.Item
                    style={{marginBottom: 24, marginTop: '16px'}}
                    label="Project Description"
                    name="project_description"
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

export default ProjectsListComponent

