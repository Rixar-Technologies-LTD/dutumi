
import React, {useEffect, useState} from "react";


import "../../../../css/components.css"
import {Button, Card, Pagination, Space, Table, Tag} from "antd";
import {getRequest} from "../../../../services/rest/RestService";
import {notifyHttpError} from "../../../../services/notification/notifications";
import {  Business,Staff,
} from "../../../../interfaces/businesses/BusinessInterfaces";
import type {ColumnsType} from "antd/es/table";

interface BranchesProps {
    business?: Business
}

const BusinessStaffComponent = ({ business  } : BranchesProps) => {

    const [staffList, updateBranchesList] = useState<Staff[]>([]);
    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, updatePageSize] = useState(50);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, updateSearchQuery] = useState("");

    //Fetch products
    useEffect(() => {
        fetchBusinessesBranches();
    }, [business]);


    const fetchBusinessesBranches = () => {

        if(business==null){
            return ;
        }

        const url = `/api/v1/manage/business/staff/list?businessId=${business?.id}&schema=${business?.schemaName}`;
        console.log(`fetching staff... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                updateBranchesList(response.data.items);
                updateCurrentPageNo(response.data.currentPageNo);
                setTotalItems(response.data.totalElements);
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
            fetchBusinessesBranches()
        }
        updateSearchQuery(value)
    }

    const columns: ColumnsType<Staff> = [
        {
            title: 'Business',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <span style={{fontWeight: 'lighter', fontSize: '12px'}}>{record.id}. {record.firstName} {record.lastName}</span><br/>
                    <span style={{fontWeight: 'lighter', fontSize: '12px'}}>{record.phoneNumber} </span><br/>
                    <span style={{fontWeight: 'lighter', fontSize: '12px'}}>{record.email} </span><br/>
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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, staff) => (
                <>
                    {staff.isOwner && <Tag color="teal">Admin</Tag>}
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
        <Card className="good-shadow" title="Staff List" style={{marginRight:'24px'}}>
            {/**---------------------------*
             /** Branches Table
             *-----------------------------*/}
            <Table
                columns={columns}
                dataSource={staffList}
                pagination={false}
                loading={isLoading}
                rowKey="id"
                style={{ marginTop:'24px'}}
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
    </>;

}

export default BusinessStaffComponent;
