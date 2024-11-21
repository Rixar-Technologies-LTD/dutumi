import {Button, Pagination, Space, Spin, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import EyasiContentCard from "../../templates/cards/EyasiContentCard";
import ordersIcon from "../../../assets/images/icons/currency.png"
import {getRequest} from "../../../services/rest/RestService";
import {notifyHttpError} from "../../../services/notification/notifications";
import {ExportOutlined, LinkOutlined, ReloadOutlined, UndoOutlined, UserOutlined} from "@ant-design/icons";
import customerLoadingIcon from "../../templates/Loading";
import Search from "antd/es/input/Search";
import moment from 'moment';
import {PaymentTransaction} from "../../../interfaces/PaymentTransactions";
import {useNavigate} from "react-router-dom";
import {SMSHistory} from "../../../interfaces/operations/OperationsInterfaces";
import {Business} from "../../../interfaces/businesses/BusinessInterfaces";
import {User} from "../../../interfaces/system/AuthInterfaces";
import GoodVisibility from "../../templates/GoodVisibility";
import {isNotEmpty} from "../../../utils/helpers";
import GoodMdiIcon from "../../templates/icons/GoodMdiIcon";
import {mdiEmailBox, mdiMessageText} from "@mdi/js";

const SmsHistoryComponent = () => {

    const columns: ColumnsType<SMSHistory> = [
        {
            title: 'Date',
            dataIndex: 'id',
            key: 'id',
            render: (_, record) => (
                <>
                    <span style={{fontWeight: 'lighter'}}>
                        {record.createdAt}
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
                    {record.mno} <br/>
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


    const [recordsList, updateRecordsList] = useState<SMSHistory[]>([]);
    const [totalRecords, updateTotalRecords] = useState(0);
    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [pageSize, updatePageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, updateSearchQuery] = useState("");
    const navigate = useNavigate();

    //Fetch products
    useEffect(() => {
        fetchTransactions();
    }, [currentPageNo, pageSize, searchQuery]);


    const fetchTransactions = () => {
        setIsLoading(true);
        const url = `/api/v1/manage/operations/sms/history?query=${searchQuery ?? ''}&page=${currentPageNo ?? 0}&perPage=${pageSize}`;
        console.log(`fetching transactions... ${url}`)
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

    const isSuccess = (smsHistory: SMSHistory) => {
        return smsHistory.status == 'SUCCESS';
    }


    return <EyasiContentCard title="SMS History"
                             iconImage={<GoodMdiIcon iconPath={mdiMessageText}/>}
                             subTitle="history"
                             extraHeaderItems={[
                                 isLoading && <Spin key="spin" indicator={customerLoadingIcon}></Spin>,
                                 <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={fetchTransactions}
                                         key="2"
                                         type="default">Refresh</Button>,
                                 <Button href="/products/instance/new" key="test" type="primary">Send Test SMS</Button>
                             ]}>

        {/**---------------*
         /** Search
         *----------------*/}
        <Space style={{marginBottom: 24}} direction="vertical" size="middle">
            <Space.Compact>
                <Search placeholder="Search sms"
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

export default SmsHistoryComponent

