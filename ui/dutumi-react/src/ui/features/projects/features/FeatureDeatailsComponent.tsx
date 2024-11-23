import {
    Button, Col, List,
    Pagination,  Row, Select,
    Space,
    Spin,
    Table,
    Tag
} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {FileDoneOutlined, PlusCircleOutlined, UserOutlined} from "@ant-design/icons";
import {
    UndoOutlined
} from "@ant-design/icons";
import sectionIcon from "../../../../assets/images/pages/list.png"
import {useNavigate, useSearchParams} from "react-router-dom";
import {Business, RemindersStats} from "../../../../interfaces/businesses/BusinessInterfaces";
import {Project, ProjectType, Task} from "../../../../interfaces/projects/ProjectsInterfaces";
import {SubscriptionStats} from "../../../../interfaces/MessagesInterfaces";
import {getRequest, postRequest} from "../../../../services/rest/RestService";
import {notifyHttpError, notifySuccess} from "../../../../services/notification/notifications";
import EyasiContentCard from "../../../templates/cards/EyasiContentCard";
import customerLoadingIcon from "../../../templates/Loading";
import FeatureForm from "./components/FeatureFormComponent";
import AssignmentForm from "./components/AssignementFormComponent";


const FeatureDetailsComponent = () => {

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
                        <Button type="default" size="small" onClick={() => {
                        }}>
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
                    <Button type="primary" onClick={() => {
                        viewFeature(record)
                    }}> View</Button>
                </Space>
            ),
        },
    ];

    const [projectsList, updateProjectsList] = useState<Project[]>([]);
    const [childrenFeaturesList, updateChildrenFeaturesList] = useState<Task[]>([]);
    const [currentFeature, setCurrentFeature] = useState<Task>();

    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, updatePageSize] = useState(50);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, updateSearchQuery] = useState("");
    const [subscriptionStats, setStats] = useState<SubscriptionStats>();
    const [remindersStats, setRemindersStats] = useState<RemindersStats>();
    const [remindersModalOpen, setRemindersModalOpen] = useState<boolean>(false);

    const [selectedSubscription, setSelectedSubscription] = useState<Business | null>();
    const [isSubscriptionVisible, setSubscriptionsModalVisible] = useState(false);

    const [filter, setFilterGroup] = useState("all");
    const navigate = useNavigate();

    const [selectedProjectId, setSelectedProjectId] = useState<string>();
    const [featureFormOpen, setFeatureFormOpen] = useState(false)
    const [assignmentFormOpen, setAssignmentFormOpen] = useState(false)


    const [searchParams] = useSearchParams();
    const featureId = searchParams.get('featureId');
    const parentFeatureId = searchParams.get('projectId');

    //Fetch products
    useEffect(() => {
        fetchFeatureDetails();
    }, []);

    //Fetch products
    useEffect(() => {
        fetchSubFeatures();
        fetchFeatureDetails();
    }, [selectedProjectId, currentPageNo, pageSize, searchQuery, filter]);

    const fetchFeatureDetails = () => {
        const url = `/api/v1/projects/features/details?id=${featureId}`;
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                setCurrentFeature(response.data.respBody.feature);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const fetchSubFeatures = () => {
        const url = `/api/v1/projects/features/children?parenId=${featureId}`;
        console.log(`fetching children features... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                updateChildrenFeaturesList(response.data.respBody.data);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const onFeatureSaveCompleted = () => {
        setFeatureFormOpen(false)
        fetchSubFeatures();
    }

    const onPageChange = (page: number, pageSize: number) => {
        updateCurrentPageNo(page)
    }

    const onPageSizeChange = (current: number, size: number) => {
        updatePageSize(size)
    }

    const onProjectChanged = (value: any) => {
        setSelectedProjectId(value);
    }

    const viewFeature = (task: Task) => {
        navigate(`/projects/features/details?projectId=${task.id}`);
    }

    const showAssignmentForm = ()=> {
        setAssignmentFormOpen(true);
    }

    return <EyasiContentCard title={`FEAT${currentFeature?.id}`}
                             subTitle={`${currentFeature?.name}`}
                             iconImage={sectionIcon}
                             extraHeaderItems={[
                                 isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>,
                                 <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={() => {
                                     fetchSubFeatures();
                                 }} key="2"
                                         type="default">Refresh</Button>
                             ]}>

        <Row>
            <Col span={8}>
                <List
                    size="large"
                    header={<Space>
                        Feature Status <Tag>{currentFeature?.status}</Tag>
                    </Space>}
                    footer={<div> {currentFeature?.remark}</div>}
                    bordered>

                    {/*  Description */}
                    <List.Item>
                        {currentFeature?.description}
                    </List.Item>

                    {/* Assignee */}
                    <List.Item
                        actions={[<Space>
                            <UserOutlined/> {currentFeature?.assignee?.name??'No Assignee'}
                            <Button onClick={showAssignmentForm} icon={<PlusCircleOutlined/>}>Assign</Button>
                        </Space>]}>
                        Assignee
                    </List.Item>

                    {/*  Created By */}
                    <List.Item
                        actions={[<Space> <UserOutlined/> {currentFeature?.creator?.name}</Space>]}>
                        Created By
                    </List.Item>

                    {/*  Creation Date */}
                    <List.Item
                        actions={[<Space>{currentFeature?.created_at}</Space>]}>
                        Creation Date
                    </List.Item>

                    {/*  Last Update */}
                    <List.Item
                        actions={[<Space>{currentFeature?.updated_at}</Space>]}>
                        Last Update
                    </List.Item>
                </List>
            </Col>
        </Row>

        {/**---------------*
         /** Search
         *----------------*/}
        <Space style={{marginBottom: 24, marginTop: 48}} direction="horizontal">

            <Button onClick={() => {
                setFeatureFormOpen(true)
            }}
                    size="large"
                    icon={<PlusCircleOutlined/>}
                    key="1" type="primary">Add Sub Feature</Button>

            <div style={{padding: '8px 16px', border: '1px solid #00000000', borderRadius: '4px'}}>
                <Select
                    suffixIcon={<UserOutlined style={{color: 'rgba(0,0,0,.25)'}}/>}
                    value={selectedProjectId}
                    onChange={onProjectChanged}
                    placeholder="Filter Assignee"
                    style={{width: '100%', minWidth: '240px'}}
                    size="large"
                    options={projectsList.map((project) => ({label: project.name, value: project.id}))}
                />
            </div>

        </Space>


        {/**---------------------------*
         /** Orders Table
         *-----------------------------*/}
        <Table
            columns={columns}
            dataSource={childrenFeaturesList}
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

        <FeatureForm
            title="Sub Feature"
            isVisible={featureFormOpen}
            onSaveCompleted={onFeatureSaveCompleted}
            onCancelled={() => {
                setFeatureFormOpen(false)
            }}
            projectId={selectedProjectId ?? ''}
            parentFeatureId={parentFeatureId}
        />

        <AssignmentForm
            title="Assign Member"
            isVisible={assignmentFormOpen}
            projectId={currentFeature?.project_id ?? ''}
            featureId={featureId}
            onSaveCompleted={()=>{
                setAssignmentFormOpen(false)
                fetchFeatureDetails();
            }}
            onCancelled={() => {
                setAssignmentFormOpen(false)
            }}
        />

    </EyasiContentCard>;

}

export default FeatureDetailsComponent

