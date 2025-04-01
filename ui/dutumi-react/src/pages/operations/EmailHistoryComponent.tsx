import {Button, Pagination, Space, Spin, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import EyasiContentCard from "components/cards/EyasiContentCard";
import ordersIcon from "assets/images/icons/currency.png"
import {getRequest} from "../../services/http/RestClient";
import {notifyHttpError} from "../../services/notification/notifications";
import {ExportOutlined, LinkOutlined, ReloadOutlined, UndoOutlined, UserOutlined} from "@ant-design/icons";
import customerLoadingIcon from "components/Loading";
import Search from "antd/es/input/Search";
import moment from 'moment';
import {PaymentTransaction} from "types/PaymentTransactions";
import {useNavigate} from "react-router-dom";
import {EmailHistory, SMSHistory} from "types/operations/OperationsInterfaces";
import {Business} from "types/businesses/BusinessInterfaces";
import {User} from "types/system/AuthInterfaces";
import GoodVisibility from "components/GoodVisibility";
import {isNotEmpty} from "utils/helpers";
import GoodMdiIcon from "components/icons/GoodMdiIcon";
import {mdiEmailBox, mdiMailbox} from "@mdi/js";

const EmailHistoryComponent = () => {

    const columns: ColumnsType<EmailHistory> = [
        {
            title: 'Date',
            dataIndex: 'id',
            key: 'id',
            render: (_, record) => (
                <>
                    <span style={{fontWeight: 'lighter'}}>
                        {record.createdDate}
                    </span>
                </>
            ),
        },
        {
            title: 'Receiver ',
            dataIndex: 'amount',
            key: 'key',
            render: (_, record) => (
                <>
                    <span style={{color: `${isSuccess(record) ? 'green' : 'red'}`}}>{record.recipient} </span> <br/>
                    <GoodVisibility visible={isNotEmpty(record.userId)}>
                        <Button
                            size="small"
                            type="primary" onClick={() => {
                            viewUser(record.userId)
                        }}
                            icon={<UserOutlined/>}>View User <ExportOutlined/></Button>
                    </GoodVisibility>
                </>
            ),
        },
        {
            title: 'Gateway ',
            dataIndex: 'amount',
            key: 'key',
            render: (_, record) => (
                <>
                    <Space size="middle">
                        {record.gateway}
                    </Space>
                </>
            ),
        },
        {
            title: 'Message',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <>
                    <Space size="middle">
                        {record.message}
                    </Space>
                </>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <>
                    <Tag style={{color: `${isSuccess(record) ? 'green' : 'red'}`}}>{record.status}</Tag> <br/>
                    {record.remark}
                </>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'payer',
            key: 'payer',
            render: (_, record) => (
                <>
                    <Button
                        size="small"
                        type="primary" onClick={() => {
                        // viewBusiness(record.id)
                    }}
                        icon={<ReloadOutlined/>}>Retry</Button>
                </>
            )
        },
    ];


    const [recordsList, updateRecordsList] = useState<EmailHistory[]>([]);
    const [totalRecords, updateTotalRecords] = useState(0);
    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [pageSize, updatePageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, updateSearchQuery] = useState("");
    const navigate = useNavigate();

    //Fetch products
    useEffect(() => {
        fetchRecords();
    }, [currentPageNo, pageSize, searchQuery]);


    const fetchRecords = () => {
        setIsLoading(true);
        const url = `/api/v1/manage/operations/emails/history?query=${searchQuery ?? ''}&page=${currentPageNo ?? 0}&perPage=${pageSize}`;
        console.log(`fetching emails history... ${url}`)
        getRequest(url)
            .then((response) => {
                updateRecordsList(response.data.items);
                updateTotalRecords(response.data.totalElements);
                updateCurrentPageNo(response.data.currentPageNo)
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
        updateSearchQuery(value)
    }

    const viewBusiness = (id: String) => {
        navigate(`/users/${id}`);
    }

    const viewUser = (userId:string) => {
        navigate(`/users/${userId}`);
    }

    const isSuccess = (smsHistory: EmailHistory) => {
        return smsHistory.status == 'SUCCESS';
    }


    return <EyasiContentCard title="Email History"
                             iconImage={<GoodMdiIcon iconPath={mdiEmailBox}/>}
                             subTitle="history"
                             extraHeaderItems={[
                                 isLoading && <Spin key="spin" indicator={customerLoadingIcon}></Spin>,
                                 <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={fetchRecords}
                                         key="2"
                                         type="default">Refresh</Button>,
                                  <Button href="/products/instance/new" key="test" type="primary">Send Test Email</Button>
                             ]}>

        {/**---------------*
         /** Search
         *----------------*/}
        <Space style={{marginBottom: 24}} direction="vertical" size="middle">
            <Space.Compact>
                <Search placeholder="Search Emails"
                        onSearch={onSearch}
                        allowClear/>
            </Space.Compact>
        </Space>


        {/**---------------------------*
         /** Orders Table
         *-----------------------------*/}
        <Table
            columns={columns}
            dataSource={recordsList}
            loading={isLoading}
            rowKey="id"
            pagination={false}/>

        {/**---------------------------*
         /** Pagination
         *-----------------------------*/}
        <Pagination style={{marginTop: 32, marginBottom: 32}}
                    pageSize={pageSize}
                    current={currentPageNo}
                    total={totalRecords}
                    simple={false}
                    showSizeChanger={true}
                    onChange={onPageChange}
                    showQuickJumper={true}
                    onShowSizeChange={onPageSizeChange}
        />

    </EyasiContentCard>;

}

export default EmailHistoryComponent

