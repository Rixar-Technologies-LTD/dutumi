import {
    Button, Image,
    Pagination,
    Space,
    Spin,
    Table,
    Tag
} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {EyeOutlined} from "@ant-design/icons";
import {UndoOutlined} from "@ant-design/icons";

import {notifyHttpError} from "../../services/notification/notifications";
import {getRequest} from "../../services/http/RestClient";
import EyasiContentCard from "components/cards/EyasiContentCard";
import customerLoadingIcon from "components/Loading";
import sectionIcon from "assets/images/icons/objects/servers.png"

import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Asset} from "types/assets/AssetsInterfaces";
import AssetForm from "pages/assets/forms/AssetForm";
import {countRemainingDay, isNotEmpty} from "utils/helpers";
import object from "assets/images/icons/objects/cube.png";
import server from "assets/images/icons/servers/server.png";
import databaseServer from "assets/images/icons/servers/database.png";


const toAssetIcon = (type: string) => {
    switch (type) {
        case 'APPLICATION_SERVER':
            return server;
        case 'DATABASE_SERVER':
            return databaseServer;
        case 'FILE_SERVER':
            return server;
        case 'GENERIC_SERVER':
            return server;
        case 'IP':
            return object;
        case 'SMARTPHONE':
            return object;
        case 'LAPTOP':
            return object;
        case 'OTHER':
            return object;
        default :
            return object;
    }
}


const FinanceBillingComponent = () => {

    const columns: ColumnsType<Asset> = [
        {
            title: '',
            dataIndex: 'reference',
            key: 'reference',
            width: '36px',
            render: (_, record) => (
                <>
                    <Space>
                        <Image width={32} src={toAssetIcon(record.category)}/>
                    </Space>
                </>
            ),
        },
        {
            title: 'Reference',
            dataIndex: 'reference',
            key: 'reference',
            render: (_, record) => (
                <>
                    <span>ASST{record.id}</span> <br/>
                    {isNotEmpty(record.vendor) && <>{record.vendor} <br/></>}
                    {isNotEmpty(record.ip_address) && <Tag>{record.ip_address}</Tag>} <br/>
                </>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <a href={`/assets/groups/${record.id}`}> {record.name}</a><br/>
                    <Tag color='blue' style={{fontSize:'14px'}}>{record.project?.name}</Tag>
                </>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'name',
            width: '228px',
            key: 'name',
            render: (_, record) => (
                <>
                    <Tag>{(record.category??'').replaceAll('_',' ')}</Tag><br/>
                    {isNotEmpty(record.memory_size) && <div style={{marginTop: '4px'}}>
                        <Image style={{marginRight: '6px'}} width={20} src={sectionIcon}/> RAM: {record.memory_size}GB
                    </div>}
                    {isNotEmpty(record.storage_size) && <div style={{marginTop: '4px'}}>
                        <Image style={{marginRight: '6px'}} width={20}
                               src={sectionIcon}/> Storage: {record.storage_size}GB</div>}

                </>
            ),
        },
        {
            title: 'Unit Price',
            dataIndex: 'unit_price',
            key: 'unit_price',
            width: '194px',
            render: (_, record) => (
                <>
                    <span>{record.unit_price} {record.price_currency}</span><br/>
                    <span>{(record.unit_price_in_default_currency ?? 0).toLocaleString()} TZS</span>
                </>
            ),
        },
        {
            title: 'Next Payment',
            dataIndex: 'next_payment_date',
            key: 'next_payment_date',
            width: '208px',
            render: (_, record) => (
                <>
                    <div>
                        <span style={{color: '#5a5a5a'}}>{record.next_payment_date}</span> <br/>
                        {isNotEmpty(record.next_payment_date) &&
                            <Tag color={countRemainingDay(record.next_payment_date)<=31? 'red' : ''} style={{fontSize:'14px'}}>
                                {countRemainingDay(record.next_payment_date)} Days
                            </Tag>}
                    </div>
                </>
            ),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button icon={<EyeOutlined/>} type="default" onClick={() => {
                        showEditForm(record)
                    }}>View</Button>
                </>
            ),
        }
    ];

    const [assetList, updateRecordsList] = useState<Asset[]>([]);
    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, updatePageSize] = useState(50);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, updateSearchQuery] = useState("");
    const [filter, setFilterGroup] = useState("all");
    const navigate = useNavigate();

    const [isAssetGroupFormOpen, setAssetGroupFormOpen] = useState(false)
    const [selectedAsset, setSelectedAsset] = useState<Asset>()

    const {groupId} = useParams();
    const [searchParams] = useSearchParams();

    const groupName = searchParams.get('groupName');

    //Fetch products
    useEffect(() => {
        fetchRecords();
    }, [currentPageNo, pageSize, searchQuery, filter]);

    const fetchRecords = () => {
        const url = `/api/v1/assets/billing/schedule`;
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                updateRecordsList(response.data.respBody.data);
                setTotalItems(response.data.respBody.total);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const showEditForm = (asset: Asset) => {
        setSelectedAsset(asset);
        setAssetGroupFormOpen(true);
    }

    const onPageChange = (page: number, pageSize: number) => {
        updateCurrentPageNo(page)
    }

    const onPageSizeChange = (current: number, size: number) => {
        updatePageSize(size)
    }


    return <EyasiContentCard title="Billing "
                             subTitle="List"
                             iconImage={sectionIcon}
                             extraHeaderItems={[
                                 isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>
                             ]}>

        {/**---------------*
         /** Search
         *----------------*/}
        <h2 style={{color: '#818181'}}>{groupName}</h2>
        <Space style={{marginBottom: 24, marginTop: 8}} direction="horizontal">
            <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={fetchRecords} key="2"
                    type="default">Refresh</Button>
        </Space>

        {/**---------------------------*
         /** Orders Table
         *-----------------------------*/}
        <Table
            columns={columns}
            dataSource={assetList}
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


        {/***------------------------------
         /*  Project
         ***------------------------------*/}
        <AssetForm isVisible={isAssetGroupFormOpen}
                   title="Asset Information"
                   groupId={groupId ?? ''}
                   oldAsset={selectedAsset}
                   onSaved={() => {
                       setAssetGroupFormOpen(false)
                       fetchRecords();
                   }}
                   onCancelled={() => {
                       setAssetGroupFormOpen(false)
                   }}/>

    </EyasiContentCard>;

}

export default FinanceBillingComponent

