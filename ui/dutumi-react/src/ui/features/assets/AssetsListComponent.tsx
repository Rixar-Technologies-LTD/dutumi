import {
    Button,
    Pagination,
    Space,
    Spin,
    Table,
    Tag
} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {EditOutlined, EyeOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {UndoOutlined} from "@ant-design/icons";

import {notifyHttpError} from "services/notification/notifications";
import {getRequest} from "services/rest/RestService";
import EyasiContentCard from "ui/templates/cards/EyasiContentCard";
import customerLoadingIcon from "ui/templates/Loading";
import sectionIcon from "assets/images/icons/generic/assets.png"

import {useNavigate, useParams} from "react-router-dom";
import {Asset, AssetGroup} from "interfaces/assets/AssetsInterfaces";
import AssetForm from "ui/features/assets/forms/AssetForm";

const AssetsListComponent = () => {

    const columns: ColumnsType<Asset> = [
        {
            title: 'Reference',
            dataIndex: 'reference',
            key: 'reference',
            render: (_, record) => (
                <>
                    ASST-{record.id}
                </>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <a href={`/assets/groups/${record.id}`}> {record.name}</a>
                </>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    {record.description}
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
                    {record.unit_price}
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
                    }}>Update</Button>
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

    const {groupId} = useParams();

    //Fetch products
    useEffect(() => {
        fetchRecords();
    }, [currentPageNo, pageSize, searchQuery, filter]);

    const fetchRecords = () => {
        const url = `/api/v1/assets?groupId=${groupId}`;
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


    const showEditForm = (project: AssetGroup) => {
        // projectForm.setFieldValue('id',project.id);
        // projectForm.setFieldValue('name',project.name);
        setAssetGroupFormOpen(true)
    }

    const onPageChange = (page: number, pageSize: number) => {
        updateCurrentPageNo(page)
    }

    const onPageSizeChange = (current: number, size: number) => {
        updatePageSize(size)
    }


    return <EyasiContentCard title="Asset "
                             subTitle="Groups"
                             iconImage={sectionIcon}
                             extraHeaderItems={[
                                 isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>
                             ]}>

        {/**---------------*
         /** Search
         *----------------*/}
        <Space style={{marginBottom: 24, marginTop: 8}} direction="horizontal">
            <Button icon={<PlusCircleOutlined/>}
                    onClick={() => {
                        setAssetGroupFormOpen(true)
                    }}
                    type="primary">Add Asset</Button>
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
                   groupId={groupId??''}
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

