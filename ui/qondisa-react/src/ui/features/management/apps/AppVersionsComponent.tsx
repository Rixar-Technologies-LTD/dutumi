import {Button, Form, Input, Modal, Pagination, Space, Spin, Switch, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import sectionIcon from "../../../../assets/images/icons/topic.png"
import {getRequest, postRequest} from "../../../../services/rest/RestService";
import {notifyHttpError, notifySuccess} from "../../../../services/notification/notifications";
import EyasiContentCard from "../../../templates/cards/EyasiContentCard";
import customerLoadingIcon from "../../../templates/Loading";
import {EditOutlined} from "@ant-design/icons";
import {AppVersion} from "../../../../interfaces/MessagesInterfaces";
import {is} from "cheerio/lib/api/traversing";


const AppVersionComponent = () => {

    const columns: ColumnsType<AppVersion> = [
        {
            title: 'S/N',
            dataIndex: 'name',
            render: (_, record) => (<>
                <Tag>{record.id}</Tag> {record.createdDate}
            </>),
        },
        {
            title: 'Version Name',
            dataIndex: 'code',
            render: (_, record) => (<> {record.version} </>),
        },
        {
            title: 'Build Number',
            dataIndex: 'name',
            render: (_, record) => (<> {record.buildNumber} </>),
        },

        {
            title: 'Android',
            dataIndex: 'created_at',
            render: (_, record) => (<>
                {<Tag color={record.androidActive?'green':'brown'}>{record.androidActive?'Active':'Expired'}</Tag>}
            </>),
        },
        {
            title: 'iOS',
            dataIndex: 'created_at',
            render: (_, record) => (<>
                {<Tag color={record.iosActive?'green':'brown'}>{record.iosActive?'Active':'Expired'}</Tag>}
            </>),
        },
        {
            title: 'Web',
            dataIndex: 'created_at',
            render: (_, record) => (<>
                {<Tag color={record.webActive?'green':'brown'}>{record.webActive?'Active':'Expired'}</Tag>}
            </>),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => showEditForm(record)}><EditOutlined style={{marginRight:'0.8em'}}/>Edit</a>
                </Space>
            )
        }
    ];

    const [referralsList, updateAppVersionsList] = useState<AppVersion[]>([]);
    const [antdForm] = Form.useForm();
    const [messageModalOpen, setMessageModal] = useState(false)
    const [totalRecords, updateTotalRecords] = useState(0);
    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [pageSize, updatePageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, updateSearchQuery] = useState("");

    //Fetch products
    useEffect(() => {
        fetchRecords();
    }, [searchQuery]);

    useEffect(() => {
    }, [referralsList]);

    const fetchRecords = () => {
        console.log("Fetching apps...")
        setIsLoading(true)
        getRequest(`/api/v1/manage/system/apps/versions/list?query=${searchQuery}`)
            .then((response) => {
            updateAppVersionsList(response.data.items);
            setIsLoading(false);
        }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const showEditForm = (record: AppVersion ) => {
        setMessageModal(true)
        antdForm.resetFields();
        antdForm.setFieldsValue(record);

    }

    const handleSave = (item: AppVersion) => {
        setIsLoading(true);
        postRequest(item.id? "/api/v1/manage/system/apps/versions/update" : "/api/v1/manage/system/apps/versions/add", item)
            .then((response) => {
                notifySuccess("Success", "Saved!")
                fetchRecords();
                setIsLoading(false);
                setMessageModal(false)
            }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
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

    return <EyasiContentCard title="App Versions"
                             iconImage={sectionIcon}
                             subTitle=""
                             extraHeaderItems={[
                                 isLoading && <Spin key="customerLoadingIcon" indicator={customerLoadingIcon}></Spin>,
                                 <Button key="refresh" type="primary" onClick={fetchRecords} ghost>Refresh</Button>,
                                 <Button key="addStaffButton" type="primary" onClick={()=>{
                                     showEditForm({} as AppVersion);
                                 }} ghost>Add Version</Button>
                             ]}>


        {/**---------------------------*
         /** Staff Table
         *-----------------------------*/}
        <Table
            columns={columns}
            dataSource={referralsList}
            loading={isLoading}
            rowKey="id"
        />

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


        {/***------------------------------
         /*  Shipping Category Form
         ***------------------------------*/}
        <Modal title="App Version"
               open={messageModalOpen}
               onOk={() => {
                   antdForm.submit()
               }}
               confirmLoading={isLoading}
               onCancel={() => {
                   setMessageModal(false)
               }}>

            <Form
                form={antdForm}
                layout="vertical"
                onFinish={handleSave}
            >

                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Version"
                    name="version"
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Build Number"
                    name="buildNumber"
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Android"
                    name="androidActive"
                >
                    <Switch checkedChildren="Active" unCheckedChildren="Expired"  />
                </Form.Item>


                <Form.Item
                    label="iOS"
                    name="iosActive"
                >
                    <Switch checkedChildren="Active" unCheckedChildren="Expired"  />
                </Form.Item>

                <Form.Item
                    label="Web"
                    name="webActive"
                >
                    <Switch checkedChildren="Active" unCheckedChildren="Expired"  />
                </Form.Item>

            </Form>
        </Modal>


    </EyasiContentCard>;

}

export default AppVersionComponent

