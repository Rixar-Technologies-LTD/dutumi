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
import {
    UndoOutlined
} from "@ant-design/icons";

import {notifyHttpError} from "../../services/notification/notifications";
import {getRequest} from "../../services/http/RestClient";
import EyasiContentCard from "components/cards/EyasiContentCard";
import customerLoadingIcon from "components/Loading";
import sectionIcon from "assets/images/icons/objects/folders.png"
import folder from "assets/images/icons/objects/folder.png"

import {useNavigate} from "react-router-dom";
import AssetGroupForm from "pages/assets/forms/AssetGroupForm";
import {AssetGroup} from "types/assets/AssetsInterfaces";
import GoodImageIcon from "components/icons/GoodImageIcon";

const AssetGroupsListComponent = () => {

    const columns: ColumnsType<AssetGroup> = [
        {
            title: 'Group',
            dataIndex: 'reference',
            key: 'reference',
            render: (_, record) => (
                <>
                    <Space>
                        <GoodImageIcon padding={6} iconSizeEm={48} iconPath={folder}/>
                        <a href={`/assets?groupId=${record.id}`}> {record.name}</a>
                    </Space>
                </>
            ),
        },
        {
            title: 'Project',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <a href={`/projects/${record.project?.id}`}>
                        <Tag color="processing">{record.project?.name}</Tag>
                    </a>
                </>

            ),
        },
        {
            title: 'Assets',
            dataIndex: 'assets',
            key: 'assets',
            width: '194px',
            render: (_, record) => (
                <>
                    <Tag style={{color: '#5a5a5a', fontWeight: 'bold', fontSize: '18px'}}>{record.assets_count}</Tag>
                </>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'description',
            key: 'created_at',
            width: '208px',
            render: (_, record) => (
                <>
                    <div>
                        <span style={{color: '#5a5a5a'}}>{record.created_at}</span>
                    </div>
                </>
            ),
        },
        {
            title: 'Open',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button
                        href={`/assets?groupId=${record.id}?groupName=${record.name}`}
                        icon={<EyeOutlined/>}
                        type="primary">
                        Open
                    </Button>
                </>
            )
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button icon={<EditOutlined/>} type="default" onClick={() => {
                        showEditForm(record)
                    }}>Edit</Button>
                </>
            ),
        }
    ];

    const [assetGroupsList, updateRecordsList] = useState<AssetGroup[]>([]);
    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, updatePageSize] = useState(50);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, updateSearchQuery] = useState("");
    const [filter, setFilterGroup] = useState("all");
    const navigate = useNavigate();

    const [isAssetGroupFormOpen, setAssetGroupFormOpen] = useState(false)
    const [selectedAssetGroup, setSelectedAssetGroup] = useState<AssetGroup>()

    //Fetch products
    useEffect(() => {
        fetchRecords();
    }, [currentPageNo, pageSize, searchQuery, filter]);


    const fetchRecords = () => {
        const url = `/api/v1/assets/groups`;
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

    const showEditForm = (assetGroup: AssetGroup) => {
        setSelectedAssetGroup(assetGroup)
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
                    type="primary">Create Asset Groups</Button>
            <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={fetchRecords} key="2"
                    type="default">Refresh</Button>
        </Space>

        {/**---------------------------*
         /** Orders Table
         *-----------------------------*/}
        <Table
            columns={columns}
            dataSource={assetGroupsList}
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
        <AssetGroupForm isVisible={isAssetGroupFormOpen}
                        title="Add Asset Group"
                        oldGroup={selectedAssetGroup}
                        onSaved={() => {
                            setAssetGroupFormOpen(false)
                            fetchRecords();
                        }}
                        onCancelled={() => {
                            setAssetGroupFormOpen(false)
                        }}/>

    </EyasiContentCard>;

}

export default AssetGroupsListComponent

