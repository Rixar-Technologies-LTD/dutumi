import {
    Button, Card, Col, List,
    Pagination, Row, Select,
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
import {Project, Task} from "../../../../interfaces/projects/ProjectsInterfaces";
import {SubscriptionStats} from "../../../../interfaces/MessagesInterfaces";
import {getRequest, postRequest} from "../../../../services/rest/RestService";
import {notifyHttpError, notifySuccess} from "../../../../services/notification/notifications";
import EyasiContentCard from "../../../templates/cards/EyasiContentCard";
import customerLoadingIcon from "../../../templates/Loading";
import FeatureForm from "./components/FeatureFormComponent";
import AssignmentForm from "./components/AssignementFormComponent";
import {limitText} from "../../../../utils/helpers";
import FeatureProgressComponent from "./components/FeatureProgressComponent";

const featureStatuses = [
    {"label": 'In Design', "value": 'DESIGN'},
    {"label": 'In Development', "value": 'DEVELOPMENT'},
    {"label": 'Testing', "value": 'TESTING'},
    {"label": 'Live', "value": 'LIVE'},
    {"label": 'Retired', "value": 'RETIRED'}
]

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
    }, [featureId]);

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
        const url = `/api/v1/projects/features/children?parentId=${featureId}`;
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

    const updateFeatureStatus = (newStatus: any) => {
        console.log(newStatus)
        setIsLoading(true);
        postRequest(`/api/v1/projects/features/status/update`, {
            'id': featureId,
            'status': newStatus
        })
            .then((response) => {
                console.log(response.data);
                notifySuccess("Feature Status Updated")
                fetchFeatureDetails();
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const onSubFeatureSaved = () => {
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
        navigate(`/projects/features/details?featureId=${task.id}`);
    }

    const showAssignmentForm = () => {
        setAssignmentFormOpen(true);
    }

    return <EyasiContentCard title={`FEAT${currentFeature?.id}`}
                             subTitle={``}
                             iconImage={sectionIcon}
                             extraHeaderItems={[
                                 isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>,
                                 <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={() => {
                                     fetchFeatureDetails();
                                     fetchSubFeatures();
                                 }} key="2"
                                         type="default">Refresh</Button>
                             ]}>

        <Row>

            <Col span={8}>
                <List
                    style={{marginRight: '32px'}}
                    size="large"
                    header={<h3 style={{color: '#5e548e', padding: 0, margin: 0}}> {currentFeature?.name}</h3>}
                    bordered>

                    {/*  Feature Status */}
                    <List.Item
                        actions={[<Space>
                            <Select
                                value={currentFeature?.status}
                                onChange={updateFeatureStatus}
                                placeholder="Select Status"
                                style={{
                                    width: '100%',
                                    minWidth: '148px',
                                    border: '1px solid #f7b801',
                                    borderRadius: '8px'
                                }}
                                size="large"
                                options={featureStatuses}
                                labelRender={(labelInValueType) => {
                                    return <span style={{color: '#f7b801'}}>{labelInValueType.label}</span>
                                }}
                            /></Space>]}>
                        Feature Status
                    </List.Item>

                    {/*  Description */}
                    <List.Item>
                        {limitText(currentFeature?.description, 164)}
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

            {/* Stats */}
            <Col span={16}>
                <Card title={<h3 style={{color: '#5e548e', padding: 0, margin: 0}}>Feature Progress</h3>}
                      style={{padding: '12px 8px', border: '1px solid #e1e1e1'}}>

                    <FeatureProgressComponent
                        feature={currentFeature}
                        isVisible={false}
                        onChanged={()=>{
                            fetchFeatureDetails();
                        }}
                    />
                </Card>
            </Col>
        </Row>


        <Row style={{marginBottom: 24, marginTop: 48}}>
            <Col span={24}>

                <Card style={{border: '1px solid #d9bbf9'}}>
                    <Space direction="horizontal" style={{marginBottom: 24}}>

                        <h3 style={{color: '#5e548e', padding: 0, margin: 0}}>Sub Feature</h3>

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
                     /** Child Features
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
                </Card>

            </Col>
        </Row>


        <List
            style={{marginLeft: '32px'}}
            size="large"
            header={<Space>Assignees <Button onClick={showAssignmentForm}
                                             icon={<PlusCircleOutlined/>}>Assign</Button></Space>}
            footer={<div> {currentFeature?.remark}</div>}
            bordered>

            {/* Lead */}
            <List.Item
                actions={[<Space> {currentFeature?.owner?.name ?? 'No Assignee'} <UserOutlined/> </Space>]}>
                Lead
            </List.Item>

            {/* Designer */}
            <List.Item
                actions={[<Space> {currentFeature?.designer?.name ?? 'No Assignee'} <UserOutlined/></Space>]}>
                Designer
            </List.Item>

            {/* Designer */}
            <List.Item
                actions={[<Space> {currentFeature?.implementor?.name ?? 'No Assignee'}
                    <UserOutlined/></Space>]}>
                Implementor/Developer
            </List.Item>

            {/* Tester */}
            <List.Item
                actions={[<Space> {currentFeature?.tester?.name ?? 'No Assignee'}<UserOutlined/></Space>]}>
                Tester
            </List.Item>

            {/* Approve */}
            <List.Item
                actions={[<Space>  {currentFeature?.approver?.name ?? 'No Assignee'}<UserOutlined/></Space>]}>
                Approve
            </List.Item>

            {/* Tester */}
            <List.Item
                actions={[<Space>{currentFeature?.deployer?.name ?? 'No Assignee'}<UserOutlined/></Space>]}>
                Deployer
            </List.Item>

        </List>

        <FeatureForm
            title="Sub Feature"
            isVisible={featureFormOpen}
            onSaveCompleted={onSubFeatureSaved}
            onCancelled={() => {
                setFeatureFormOpen(false)
            }}
            projectId={currentFeature?.project_id ?? ''}
            parentFeatureId={currentFeature?.id}
        />

        <AssignmentForm
            title="Assign Member"
            isVisible={assignmentFormOpen}
            projectId={currentFeature?.project_id ?? ''}
            featureId={featureId}
            onSaveCompleted={() => {
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

