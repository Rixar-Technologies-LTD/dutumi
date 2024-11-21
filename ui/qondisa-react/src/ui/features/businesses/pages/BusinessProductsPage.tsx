import {
    Button, Image,  Pagination,
    Spin, Table
} from 'antd';

import '../../../../css/business.css';
import React, {useEffect, useState} from 'react';
import {UndoOutlined} from "@ant-design/icons";
import {notifyHttpError} from "../../../../services/notification/notifications";
import {getRequest} from "../../../../services/rest/RestService";
import customerLoadingIcon from "../../../templates/Loading";
import { useParams, useSearchParams} from "react-router-dom";
import GoodContentCardPlain from "../../../templates/cards/GoodContentCardPlain";
import type {ColumnsType} from "antd/es/table";
import GoodMdiIcon from "../../../templates/icons/GoodMdiIcon";
import {mdiPackageVariant} from "@mdi/js";
import {Product} from "../../../../interfaces/businesses/OperationsInterfaces";

const BusinessProductsPage = () => {

    const {businessId} = useParams();
    const [searchParams] = useSearchParams();

    const columns: ColumnsType<Product> = [
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
                        <span style={{ color:'#5555ff'}}>{record.name}</span> <br/>
                        {record.cachedMinPrice ?? 'UNKNOWN'} TZS
                    </div>
                </>
            ),
        },
        {
            title: 'Min Price',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <div>
                        <span style={{ color:'green'}}>{record.cachedMinPrice}</span> <br/>
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
                    {record.productVariantList.map((variant, index)=>{
                        return <p key={variant.id}> <Image width={24} src={variant.thumbnailUrl} style={{ marginBottom:'4px', marginRight:'8px'}}/>
                            {variant.variantName} <br/>
                        </p>
                    })}
                </>
            ),
        }
    ];

    const [records, updateRecords] = useState<Product[]>([]);
 
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
        const url = `/api/v1/manage/business/products/list?businessId=${businessId}&schema=${searchParams.get('sc')}&pageNo=${currentPageNo-1}`;
        console.log(`fetching products... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                updateRecords(response.data.items);
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


    return <GoodContentCardPlain title="Business Products"
                                 iconImage={<GoodMdiIcon iconPath={mdiPackageVariant} />}
                                 extraHeaderItems={[
                                     isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>,
                                     <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={() => {
                                         fetchRecords();
                                     }} key="2" type="default">Refresh</Button>,
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

export default BusinessProductsPage

