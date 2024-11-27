import {
    Button, Image,  Pagination,
    Spin, Table
} from 'antd';

import '../../../../css/business.css';
import React, {useEffect, useState} from 'react';
import {UndoOutlined} from "@ant-design/icons";
import {notifyHttpError} from "../../../../services/notification/notifications";
import {getRequest, postRequest} from "../../../../services/http/RestClient";
import customerLoadingIcon from "../../../templates/Loading";
import { useParams, useSearchParams} from "react-router-dom";
import GoodContentCardPlain from "../../../templates/cards/GoodContentCardPlain";
import type {ColumnsType} from "antd/es/table";
import GoodMdiIcon from "../../../templates/icons/GoodMdiIcon";
import {mdiCartOutline} from "@mdi/js";
import {Order, Product} from "../../../../interfaces/businesses/OperationsInterfaces";

const BusinessOrdersPage = () => {

    const columns: ColumnsType<Order> = [
        {
            title: 'S/N',
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <div>
                        <span style={{ color:'#5555ff'}}>{record.productNames}</span> <br/>
                    </div>
                </>
            ),
        },
        {
            title: 'Due',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <div>
                        <span style={{ color:'green'}}>{record.amountDue}</span> <br/>
                    </div>
                </>
            ),
        },
        {
            title: 'Delivery',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <div>
                        <span style={{ color:'green'}}>{record.deliveryStatus}</span> <br/>
                    </div>
                </>
            ),
        },
        {
            title: 'Variants',
            dataIndex: 'variants',
            key: 'status',
            render: (_, record) => (
                <>
                    {record.orderProducts.map((orderProduct, index)=>{
                        return <p key={orderProduct.id}> <Image width={24} src={orderProduct.thumbnailUrl} style={{ marginBottom:'4px', marginRight:'8px'}}/>
                            {orderProduct.productName} <br/>
                        </p>
                    })}
                </>
            ),
        }
    ];


    const {businessId} = useParams();
    const [searchParams] = useSearchParams();


    const [records, updateRecordsList] = useState<Order[]>([]);
    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, updatePageSize] = useState(50);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, updateSearchQuery] = useState("");


    useEffect(() => {
        fetchRecords();
    }, [currentPageNo,pageSize]);


    const fetchRecords = () => {

        if(businessId==null){
            return ;
        }
        const url = `/api/v1/manage/business/orders/list?businessId=${businessId}&schema=${searchParams.get('sc')}&pageNo=${currentPageNo-1}`;
        console.log(`fetching orders... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                updateRecordsList(response.data.items);
                setTotalItems(response.data.totalElements);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }


    const onPageChange = (page: number, pageSize: number) => {
        console.log(`page: ${page}`)
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


    return <GoodContentCardPlain title="Business Orders"
                                 iconImage={<GoodMdiIcon iconPath={mdiCartOutline} />}
                                 extraHeaderItems={[
                                     isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>,
                                     <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={() => {
                                         fetchRecords();}} key="refresh" type="default">Refresh</Button>,
                                 ]}>

        {/**---------------------------*
         /** Products Table
         *-----------------------------*/}
        <Table
            columns={columns}
            dataSource={records}
            pagination={false}
            loading={isLoading}
            rowKey="id"
            style={{ marginTop:'24px', border:'1px solid #fdfaf7'}}
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
                    showQuickJumper={false}
                    onShowSizeChange={onPageSizeChange}
        />





    </GoodContentCardPlain>;

}

export default BusinessOrdersPage

