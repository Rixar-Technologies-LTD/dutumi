
import React, {useEffect, useState} from "react";


import "../../../../css/components.css"
import {Card, Pagination, Space, Table, Tag} from "antd";
import {getRequest} from "../../../../services/http/RestService";
import {notifyHttpError} from "../../../../services/notification/notifications";
import {useParams} from "react-router-dom";
import {
    Branch,
    Business,
    RemindersStats,
    SubscriptionStats
} from "../../../../interfaces/businesses/BusinessInterfaces";
import {User} from "../../../../interfaces/system/AuthInterfaces";
import type {ColumnsType} from "antd/es/table";

interface BranchesProps {
    business?: Business
}

const BranchesComponent = ({ business  } : BranchesProps) => {

    const {businessId} = useParams();

    const [businessSchema, setBusinessSchema] = useState<String>();
    const [branchesList, updateBranchesList] = useState<Branch[]>([]);
    const [usersList, updateUserList] = useState<User[]>([]);
    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, updatePageSize] = useState(50);
    const [subscribersCount, updateSubscribersCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, updateSearchQuery] = useState("");
    const [filter, setFilterGroup] = useState("all");

    //Fetch products
    useEffect(() => {
        fetchBusinessesBranches();
    }, [business]);


    const fetchBusinessesBranches = () => {

        if(business==null){
            return ;
        }

        const url = `/api/v1/manage/business/branches/list?businessId=${business?.id}&schema=${business?.schemaName}`;
        console.log(`fetching branches... ${url}`)
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

    const columns: ColumnsType<Branch> = [
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
                        {record.physicalAddress ?? 'UNKNOWN'}

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
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {/*<Button type="primary" onClick={()=>{updateSubscription(record)}}> {record.include?'Exclude':'Include'} </Button>*/}
                </Space>
            ),
        },
    ];


    return <>
        <Card title="Branches" className="good-shadow" style={{marginRight:'24px'}}>

            {/**---------------------------*
             /** Branches Table
             *-----------------------------*/}
            <Table
                columns={columns}
                dataSource={branchesList}
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

export default BranchesComponent;
