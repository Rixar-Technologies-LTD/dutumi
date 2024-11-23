
import React, {useEffect, useState} from "react";


import "../../../../css/components.css"
import {Button, Card, Pagination, Space, Table, Tag} from "antd";
import {getRequest} from "../../../../services/rest/RestService";
import {notifyHttpError} from "../../../../services/notification/notifications";
import {  Business,Staff} from "../../../../interfaces/businesses/BusinessInterfaces";
import type {ColumnsType} from "antd/es/table";
import {isEmpty} from "../../../../utils/helpers";
import {ProjectMember} from "../../../../interfaces/projects/ProjectsInterfaces";
import {PlusCircleOutlined} from "@ant-design/icons";

interface Props {
    projectId?: string
}

const ProjectMembersComponent = ({ projectId  } : Props) => {

    const [recordsList, updateRecordsList] = useState<ProjectMember[]>([]);
    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, updatePageSize] = useState(50);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, updateSearchQuery] = useState("");

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

    }

    const columns: ColumnsType<ProjectMember> = [
        {
            title: 'Business',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <span style={{fontWeight: 'normal', fontSize: '12px'}}>{record.id}. {record.user?.name}</span><br/>
                    <span style={{fontWeight: 'normal', fontSize: '12px'}}>{record?.user?.email} </span><br/>
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
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={()=>{}}> View</Button>
                </Space>
            ),
        },
    ];

    return <>
        <Card className="good-shadow"
              title={<Space>
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
        </Card>
    </>;

}

export default ProjectMembersComponent;
