import {
    Button, Flex, Form, Image,
    Pagination, Select,
    Space,
    Spin,
    Table,
    Tag
} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {CheckCircleOutlined, EyeOutlined, FolderOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {UndoOutlined} from "@ant-design/icons";

import {notifyHttpError} from "services/notification/notifications";
import {getRequest} from "services/http/RestClient";
import EyasiContentCard from "ui/templates/cards/EyasiContentCard";
import customerLoadingIcon from "ui/templates/Loading";
import sectionIcon from "assets/images/icons/objects/servers.png"

import {useNavigate, useSearchParams} from "react-router-dom";
import {Asset, AssetGroup} from "types/assets/AssetsInterfaces";
import AssetForm from "ui/features/assets/forms/AssetForm";
import {isNotEmpty} from "utils/helpers";
import {FaMapMarker} from "react-icons/fa";
import GoodImageIcon from "ui/templates/icons/GoodImageIcon";
import object from "assets/images/icons/objects/cube.png";
import server from "assets/images/icons/servers/server.png";
import databaseServer from "assets/images/icons/servers/database.png";
import Search from "antd/es/input/Search";


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


const AssetsListComponent = () => {

    const columns: ColumnsType<Asset> = [
        {
            title: '',
            dataIndex: 'reference',
            key: 'reference',
            width: '36px',
            render: (_, record) => (
                <>
                    <Space>
                        <GoodImageIcon padding={4} iconSizeEm={32} iconPath={toAssetIcon(record.category)}/>
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
                    {isNotEmpty(record.ip_address) && <Tag>{record.ip_address}</Tag>} <br/>
                    {isNotEmpty(record.location) && <><FaMapMarker style={{marginTop: '6px'}}
                                                                   color="green"/>{record.location}</>}
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
                    <Tag>{record.type}</Tag>
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
                    {record.description}
                    <Tag>{record.category}</Tag><br/>
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
                        <span style={{color: '#5a5a5a'}}>{record.next_payment_date}</span>
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

    const [assetGroups, setAssetGroups] = useState<AssetGroup[]>([]);
    const [selectedAssetGroupId, setSelectedAssetGroupId] = useState<string|null>()

    const [isAssetGroupFormOpen, setAssetGroupFormOpen] = useState(false)
    const [selectedAsset, setSelectedAsset] = useState<Asset>()

    const [searchParams] = useSearchParams();
    const groupName = searchParams.get('groupName');

    //Fetch products
    useEffect(() => {
        fetchRecords();
    }, [currentPageNo, pageSize, searchQuery, filter, selectedAssetGroupId]);

    useEffect(() => {
        fetchAssetGroups();
    }, []);

    const setPassedSelectedAssetGroup =  () => {
        setSelectedAssetGroupId(searchParams.get('groupId'))
    }

    const fetchRecords = () => {
        const url = `/api/v1/assets?groupId=${selectedAssetGroupId}&searchQuery=${searchQuery}`;
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

    const fetchAssetGroups = () => {
        const url = `/api/v1/assets/groups`;
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                setAssetGroups(response.data.respBody.data);
                setPassedSelectedAssetGroup();
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


    const onSearch = (value: string) => {
        updateSearchQuery(value)
    }

    return <EyasiContentCard title="Assets "
                             subTitle="List"
                             iconImage={sectionIcon}
                             extraHeaderItems={[
                                 isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>
                             ]}>


        {/**---------------*
         /** Search
         *----------------*/}
        <h2 style={{color: '#818181'}}>{groupName}</h2>
        <Flex
            justify="space-between"
            style={{marginBottom: 24, marginTop: 8}}>

            <Space direction="horizontal">
                <Button
                    size="large"
                    icon={<PlusCircleOutlined/>}
                    onClick={() => {
                        setAssetGroupFormOpen(true)
                    }}
                    type="primary">Add Asset</Button>

                <Select
                    allowClear={true}
                    menuItemSelectedIcon={<CheckCircleOutlined/>}
                    suffixIcon={<FolderOutlined/>}
                    placeholder="Asset Group"
                    size="large"
                    value={selectedAssetGroupId}
                    onChange={(value)=>{
                      setSelectedAssetGroupId(value)
                    }}
                    style={{width: '240px'}}
                    options={assetGroups.map((assetGroup) => ({label: assetGroup.name, value: assetGroup.id}))}
                />

                <Search
                    size="large"
                    placeholder="Find assets"
                    onSearch={onSearch}
                    allowClear/>
            </Space>

            <Space direction="horizontal">

                <Button
                    size="large"
                    style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={fetchRecords} key="2"
                    type="default">Refresh</Button>
            </Space>

        </Flex>


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
                   groupId={selectedAssetGroupId ?? ''}
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

export default AssetsListComponent

