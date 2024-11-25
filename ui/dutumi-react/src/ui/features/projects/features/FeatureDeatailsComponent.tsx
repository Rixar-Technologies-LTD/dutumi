import {
    Breadcrumb,
    Button, Card, Col, Flex, Image, List,
    Pagination, Row, Select,
    Space,
    Spin,
    Table,
    Tag
} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {
    CalendarOutlined,
    CheckCircleOutlined,
    EditOutlined,
    PlusCircleOutlined,
    UserOutlined
} from "@ant-design/icons";
import {
    UndoOutlined
} from "@ant-design/icons";
import sectionIcon from "../../../../assets/images/icons/sections/feature2.png"
import subFeatureIcon from "../../../../assets/images/icons/sections/sub-features.png"
import progressIcon from "../../../../assets/images/icons/sections/progress.png"

import {useSearchParams} from "react-router-dom";
import {Project, Task} from "../../../../interfaces/projects/ProjectsInterfaces";
import {getRequest, postRequest} from "../../../../services/rest/RestService";
import {notifyHttpError, notifySuccess} from "../../../../services/notification/notifications";
import EyasiContentCard from "../../../templates/cards/EyasiContentCard";
import customerLoadingIcon from "../../../templates/Loading";
import FeatureForm from "./components/FeatureFormComponent";
import {limitText} from "../../../../utils/helpers";
import FeatureProgressComponent from "./components/FeatureProgressComponent";
import GoodImageIcon from "../../../templates/icons/GoodImageIcon";
import GoodVisibility from "../../../templates/GoodVisibility";
import ActivitiesListComponent from "./activities/ActivitiesListComponent";

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
            title: 'Summary',
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
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        target="_blank"
                        href={`/projects/features/details?featureId=${record.id}`}
                        variant="outlined"> View</Button>
                </Space>
            ),
        },
    ];

    const [projectsList, updateProjectsList] = useState<Project[]>([]);
    const [childrenFeaturesList, updateChildrenFeaturesList] = useState<Task[]>([]);
    const [parents, setParentsList] = useState<Task[]>([]);
    const [currentFeature, setCurrentFeature] = useState<Task>();

    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, updatePageSize] = useState(50);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, updateSearchQuery] = useState("");

    const [filter, setFilterGroup] = useState("all");

    const [selectedProjectId, setSelectedProjectId] = useState<string>();
    const [featureFormOpen, setFeatureFormOpen] = useState(false)
    const [featureFormEditMode, setFeatureFormEditMode] = useState(false)

    const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);

    const [searchParams] = useSearchParams();
    const featureId = searchParams.get('featureId');

    //Fetch products
    useEffect(() => {
        fetchFeatureDetails();
        fetchSubFeatures();
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
                setCurrentFeature(response.data.respBody.feature);
                setParentsList(response.data.respBody.parents);
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
        fetchFeatureDetails();
        fetchSubFeatures();
    }

    const onPageChange = (page: number, pageSize: number) => {
        updateCurrentPageNo(page)
    }

    const onPageSizeChange = (current: number, size: number) => {
        updatePageSize(size)
    }

    const showEditForm = () => {
        setFeatureFormEditMode(true);
        setFeatureFormOpen(true);
    }

    const closeFeatureForm = () => {
        setFeatureFormEditMode(false);
        setFeatureFormOpen(false);
    }


    return <EyasiContentCard title={`FEAT${currentFeature?.id}`}
                             subTitle={`  ${currentFeature?.name}`}
                             iconImage={sectionIcon}
                             extraHeaderItems={[
                                 isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>,
                                 <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={() => {
                                     fetchFeatureDetails();
                                     fetchSubFeatures();
                                 }} key="2" type="default">Refresh</Button>
                             ]}>

        {/*Bread Crumbs*/}
        <div>
            <GoodVisibility visible={parents.length > 1}>
                <Card style={{marginBottom: '16px'}}>
                    <Breadcrumb
                        separator=">"
                        items={parents.map((feature) => {
                            return {
                                title: <a style={{color: '#00a6fb'}}
                                          href={`/projects/features/details?featureId=${feature.id}`}>
                                    FEAT{feature.id}
                                </a>,
                            }
                        })}
                    />
                </Card>
            </GoodVisibility>
        </div>


        <Row>

            {/*** ------------------------
             /* Feature Details Overview
             ---------------------------*/}
            <Col span={8}>

                <List className="dtm-elevated"
                      style={{marginRight: '32px'}}
                      size="large"
                      header={<Flex justify="space-between">
                          <h3 className="dtm-text" style={{padding: 0, margin: 0}}> {currentFeature?.name}</h3>
                          <Button variant="outlined"
                                  onClick={showEditForm}
                                  icon={<EditOutlined/>}
                          >Edit</Button>
                      </Flex>}
                      bordered>


                    {/*  Description */}
                    <List.Item>
                        {limitText(currentFeature?.description, 164)}
                    </List.Item>


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

                    {/*  Created By */}
                    <List.Item
                        actions={[<Space>  {currentFeature?.champion?.name}</Space>]}>
                        <UserOutlined style={{marginRight: '12px'}}/>
                        Champion/Lead
                    </List.Item>

                    {/*  Creation Date */}
                    <List.Item
                        actions={[<Space>{currentFeature?.start_date}</Space>]}>
                        <CalendarOutlined style={{marginRight: '12px'}}/>
                        Start Date
                    </List.Item>

                    {/*  Creation Date */}
                    <List.Item
                        actions={[<Space>{currentFeature?.end_date}</Space>]}>
                        <CheckCircleOutlined style={{marginRight: '12px'}}/>
                        Completion Date
                    </List.Item>

                    {/*  Created By */}
                    <List.Item
                        actions={[<Space>  {currentFeature?.creator?.name}</Space>]}>
                        <UserOutlined style={{marginRight: '12px'}}/>
                        Created By
                    </List.Item>

                    {/*  Creation Date */}
                    <List.Item
                        actions={[<Space>{currentFeature?.created_at}</Space>]}>
                        <CalendarOutlined style={{marginRight: '12px'}}/>
                        Creation Date
                    </List.Item>


                </List>


                <ActivitiesListComponent  featureId={currentFeature?.id ?? ''}/>
            </Col>

            <Col span={16}>


                {/*** --------------------
                 /* Progress & Assignees
                 -----------------------*/}
                <Card
                    className="dtm-elevated"
                    title={<Flex justify="space-between">
                        <h3 className="dtm-text" style={{padding: 0, margin: 0}}>Progress</h3>
                        <Image width={32} preview={false} src={progressIcon}/>
                    </Flex>}
                    style={{padding: '12px 8px', border: '1px solid #e1e1e1'}}>

                    <FeatureProgressComponent
                        feature={currentFeature}
                        isVisible={false}
                        onChanged={() => {
                            fetchFeatureDetails();
                        }}
                    />
                </Card>


                {/*** --------------------
                 /* Sub Features
                 -----------------------*/}
                <Card className="dtm-elevated" style={{marginTop: '32px'}}>
                    <Space direction="horizontal" style={{marginBottom: 24}}>
                        <GoodImageIcon iconPath={subFeatureIcon}/>
                        <h2 style={{color: '#758bfd', padding: 0, margin: 0, marginRight: '48px'}}>Sub Features</h2>
                        <Button onClick={() => {
                            setFeatureFormOpen(true)
                        }}
                                size="large"
                                icon={<PlusCircleOutlined/>}
                                key="1" type="primary">Add Sub Feature</Button>
                    </Space>

                    {/**---------------------------*
                     /** Child Features Table
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


        {/*** --------------------
         /* Feature Edit Form
         -----------------------*/}
        <FeatureForm
            title="Sub Feature"
            isVisible={featureFormOpen}
            editMode={featureFormEditMode}
            selectedFeature={currentFeature}
            onSaveCompleted={onSubFeatureSaved}
            onCancelled={() => {
                closeFeatureForm();
            }}
            projectId={currentFeature?.project_id ?? ''}
            parentFeatureId={currentFeature?.id}
        />



    </EyasiContentCard>;

}

export default FeatureDetailsComponent

