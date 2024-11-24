
import {Button, Card, Pagination, Space, Spin, Table, Tag} from 'antd';
import React, {useEffect, useState} from 'react';


import {PlusCircleOutlined, UndoOutlined} from "@ant-design/icons";
import {notifyHttpError} from "../../../../services/notification/notifications";
import {getRequest} from "../../../../services/rest/RestService";
import customerLoadingIcon from "../../../templates/Loading";
import {Business} from "../../../../interfaces/businesses/BusinessInterfaces";
import projectIcon from "../../../../assets/images/icons/users/group.png"

import {useNavigate, useParams} from "react-router-dom";
import GoodContentCardPlain from "../../../templates/cards/GoodContentCardPlain";
import {Project, ProjectMember} from "../../../../interfaces/projects/ProjectsInterfaces";
import GoodImageIcon from "../../../templates/icons/GoodImageIcon";
import peopleIcon from "../../../../assets/images/icons/users/group.png";
import MemberAssignementForm from "./MemberAssignementForm";
import {isEmpty} from "../../../../utils/helpers";
import type {ColumnsType} from "antd/es/table";


const ProjectMembersHolderComponent = () => {

    const columns: ColumnsType<ProjectMember> = [
        {
            title: 'Member',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <span style={{fontWeight: 'normal'}}>{record.id}. {record.user?.name}</span>
                </>
            ),
        },
        {
            title: 'Contact',
            dataIndex: 'contact',
            key: 'contact',
            render: (_, record) => (
                <>
                    <span style={{fontWeight: 'normal', fontSize: '14px'}}>{record.id}. {record.user?.email}</span>
                </>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <>
                    <Tag color="processing">{record.status ?? 'UNKNOWN'}</Tag>
                </>
            ),
        },
        {
            title: 'Created On',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <>
                    {record.created_at}
                </>
            ),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={()=>{}}> View</Button>
                </Space>
            ),
        },
    ];

    const {projectId} = useParams();

    const [project, setProject] = useState<Project>();
    const [businessSchema, setBusinessSchema] = useState<String>();

    const [selectedSubscription, setSelectedSubscription] = useState<Business | null>();
    const [isSubscriptionVisible, setSubscriptionsModalVisible] = useState(false);
    const navigate = useNavigate();

    const [recordsList, updateRecordsList] = useState<ProjectMember[]>([]);
    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, updatePageSize] = useState(50);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, updateSearchQuery] = useState("");

    const [isMemberFormOpen, setMemberAssignmentFormOpen] = useState<boolean>(false);



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
    //Fetch products
    useEffect(() => {
        fetchRecords();
    }, [projectId]);

    const fetchRecords = () => {

        if(isEmpty(projectId)){
            console.log("business is null")
            return ;
        }

        const url = `/api/v1/projects/members?projectId=${projectId}`;
        console.log(`fetching members... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                updateRecordsList(response.data.respBody.data);
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
            fetchRecords()
        }
        updateSearchQuery(value)
    }

    const showAddMemberForm = () => {
        setMemberAssignmentFormOpen(true);
    }

    const onMemberAdded = () => {
        setMemberAssignmentFormOpen(false);
        fetchRecords();
    }




    return <GoodContentCardPlain title="Project Members"
                                 iconImage={projectIcon}
                                 extraHeaderItems={[
                                     isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>,
                                     <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={() => {
                                         fetchProjectDetails();
                                     }} key="2" type="default">Refresh</Button>,
                                     //  <Button href="/products/instance/new" key="1" type="primary">Add Order</Button>
                                 ]}>

        {/***---------------------------
         /* Members
         **-----------------------------*/}
        <div style={{height: '48px'}}></div>
        <Card className="good-shadow"
              title={<Space>
                  <GoodImageIcon iconPath={peopleIcon} iconSizeEm={32} padding={3} />
                  <span>Project Members</span>
                  <Button icon={<PlusCircleOutlined/>}
                          onClick={showAddMemberForm}
                          style={{ marginLeft:'16px'}}
                          variant="outlined">
                      Add Member
                  </Button>
              </Space>}
              style={{marginRight:'24px'}}>

            <Table
                columns={columns}
                dataSource={recordsList}
                pagination={false}
                loading={isLoading}
                rowKey="id"
                style={{ marginTop:'24px'}}
            />

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

            <MemberAssignementForm isVisible={isMemberFormOpen}
                                   projectId={projectId??''} title="Assign Members"
                                   onSaved={onMemberAdded}
                                   onCancelled={()=>{
                                       setMemberAssignmentFormOpen(false)
                                   }}/>
        </Card>

    </GoodContentCardPlain>;

}

export default ProjectMembersHolderComponent

