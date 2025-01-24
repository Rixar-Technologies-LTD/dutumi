import {Button, Pagination, Space, Spin, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import EyasiContentCard from "../../templates/cards/EyasiContentCard";
import ordersIcon from "../../../assets/images/icons/currency.png"
import {getRequest} from "../../../services/http/RestClient";
import {notifyHttpError} from "../../../services/notification/notifications";
import {LinkOutlined, UndoOutlined} from "@ant-design/icons";
import customerLoadingIcon from "../../templates/Loading";
import Search from "antd/es/input/Search";
import moment from 'moment';
import {PaymentTransaction} from "../../../types/PaymentTransactions";
import {useNavigate} from "react-router-dom";

const TransactionsListComponent = () => {

    const columns: ColumnsType<PaymentTransaction> = [
        {
            title: 'Date',
            dataIndex: 'id',
            key: 'id',
            render: (_, record) => (
                <>
                    <span style={{fontWeight:'lighter'}}>
                        {record.createdDate}
                    </span>
                </>
            ),
        },
        {
            title: 'Payer',
            dataIndex: 'payer',
            key: 'payer',
            render: (_, record) => (
                <>
                    <Button
                        size="small"
                        type="primary" onClick={()=>{viewBusiness(record.id)}}
                        icon={<LinkOutlined/>}>{record?.business?.name}</Button> <br/>
                    {record.payerName} <br/>
                    {record.payerPhone} <br/>
                </>
            )
        },
        {
            title: 'Channel',
            dataIndex: 'channel',
            key: 'channel',
            render: (_, record) => (
                <>
                    {record.channel}<br/>
                    <Tag>{record.financialServiceProvider}</Tag>
                    {record.referenceNumber}<br/>
                </>
            ),
        },

        {
            title: 'Amount ',
            dataIndex: 'amount',
            key: 'key',
            render: (_, record) => (
                <>
                    <Space size="middle">
                        {record.amount}
                    </Space>
                </>
            ),
        },
        {
            title: 'Narration',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <>
                    <Space size="middle">
                        {record.narration}
                    </Space>
                </>
            ),
        }
    ];


    const [transactionsList, updateTransactionsList] = useState<PaymentTransaction[]>([]);
    const [totalRecords, updateTotalRecords] = useState(0);
    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [pageSize, updatePageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, updateSearchQuery] = useState("");
    const navigate = useNavigate();

    //Fetch products
    useEffect(() => {
        fetchTransactions();
    }, [currentPageNo, pageSize,searchQuery]);


    const fetchTransactions = () => {
        setIsLoading(true);
        const url = `/api/v1/manage/payments/transactions/list?query=${searchQuery}&page=${currentPageNo}&perPage=${pageSize}`;
        console.log(`fetching transactions... ${url}`)
        getRequest(url)
            .then((response) => {
                updateTransactionsList(response.data.items);
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


    const viewBusiness = (id:String) => {
        navigate(`/users/${id}`);
    }

    return <EyasiContentCard title="Transactions"
                             iconImage={ordersIcon}
                             subTitle="history"
                             extraHeaderItems={[
                                 isLoading && <Spin key="spin" indicator={customerLoadingIcon}></Spin>,
                                 <Button style={{marginRight:16}} icon={<UndoOutlined/>} onClick={fetchTransactions} key="2"
                                         type="default">Refresh</Button>,
                                //  <Button href="/products/instance/new" key="1" type="primary">Add Order</Button>
                             ]}>

        {/**---------------*
         /** Search
         *----------------*/}
        <Space style={{marginBottom: 24}} direction="vertical" size="middle">
            <Space.Compact>
                <Search placeholder="Search Transaction"
                        onSearch={onSearch}
                        allowClear/>
            </Space.Compact>
        </Space>


        {/**---------------------------*
         /** Orders Table
         *-----------------------------*/}
        <Table
            columns={columns}
            dataSource={transactionsList}
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

export default TransactionsListComponent

