import {Button, Form, Input, Modal, Pagination, Space, Spin, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import sectionIcon from "../../../../assets/images/icons/agents.png"
import {getRequest, postRequest} from "../../../../services/rest/RestService";
import {notifyHttpError, notifySuccess} from "../../../../services/notification/notifications";
import EyasiContentCard from "../../../templates/cards/EyasiContentCard";
import customerLoadingIcon from "../../../templates/Loading"; 
import {ReferralAgent} from "../../../../interfaces/referrals/ReferralsInterfaces";
import Search from "antd/es/input/Search";
import {CalendarOutlined, CheckCircleOutlined, GiftOutlined, ReloadOutlined} from "@ant-design/icons";


const AgentsListComponent = () => {

    const columns: ColumnsType<ReferralAgent> = [
        {
            title: 'Name',
            dataIndex: 'first_name',
            render: (_, record) => (<> {record.fullName}</>),
        },
        {
            title: 'Phone',
            dataIndex: 'phone_number',
            render: (_, record) => (<> {record.phoneNumber} </>),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (_, record) => (<> <Tag color="green">{record.status}</Tag> </>),
        },
        {
            title: 'Commissions (TZS)',
            dataIndex: 'commissions',
            render: (_, record) => (<>
                <GiftOutlined style={{ marginRight:'4px'}}/> Total: {record.totalCommissions??0} <br/>
                <CheckCircleOutlined style={{ marginRight:'4px', color:'green'}}/> Issued: {record.issuedCommissions??0} <br/>
                <CalendarOutlined style={{ marginRight:'4px'}} color="blue"/> Unclaimed: {record.unIssuedCommissions??0} <br/>
            </>),
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            render: (_, record) => (<> {record.createdDate} </>),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => showResetPasswordForm(record)}><ReloadOutlined style={{marginRight:'0.8em'}}/>Password</a>
                </Space>
            )
        }
    ];

    const [referralsList, updateReferralsList] = useState<ReferralAgent[]>([]);
    const [antdForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [messageModalOpen, setMessageModal] = useState(false)
    const [passwordModalOpen, setPasswordModal] = useState(false)
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
        console.log("fetching agents...")
        setIsLoading(true)
        getRequest(`/api/v1/admin/agents?query=${searchQuery}`).then((response) => {
            updateReferralsList(response.data.items);
            updateTotalRecords(response.data.totalElements);
            updateCurrentPageNo(response.data.currentPageNo)
            updatePageSize(response.data.pageSize)
            setIsLoading(false);
        }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const showEditForm = (record = {}) => {
        setMessageModal(true)
        antdForm.resetFields();
        antdForm.setFieldsValue(record);
    }

    const showResetPasswordForm = (record = {}) => {
        setPasswordModal(true)
        passwordForm.resetFields();
        passwordForm.setFieldsValue(record);
    }

    const handleSave = (item: ReferralAgent) => {
        console.log(JSON.stringify(item))
        setIsLoading(true);
        postRequest(  "/api/v1/admin/agents/add", item)
            .then((response) => {
                notifySuccess("Success", "Agent Added")
                fetchRecords();
                setMessageModal(false)
            }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
            setIsLoading(false);
        })
    }

    const resetPassword = (item: ReferralAgent) => {
        console.log(JSON.stringify(item))
        setIsLoading(true);
        postRequest(  "/api/v1/admin/agents/reset", item)
            .then((response) => {
                notifySuccess("Success", "Agent Updated")
                fetchRecords();
                setPasswordModal(false)
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

    return <EyasiContentCard title="Agents"
                             iconImage={sectionIcon}
                             subTitle=""
                             extraHeaderItems={[
                                 isLoading && <Spin key="customerLoadingIcon" indicator={customerLoadingIcon}></Spin>,
                                 <Button icon={<ReloadOutlined/>} key="agnt-refresh"  type="default" onClick={fetchRecords} style={{ marginRight:'12px'}}>Refresh</Button>,
                                 <Button key="agnt-btn" type="primary" onClick={showEditForm} ghost>Create  Agent</Button>
                             ]}>

        {/**---------------*
         /** Search
         *----------------*/}
        <Space style={{marginBottom: 24}} direction="vertical" size="middle">
            <Space.Compact>
                <Search placeholder="Search Agents"
                        onSearch={onSearch}
                        allowClear/>

                {/*<h3 style={{ width: "420px", marginTop:0, paddingTop:0, marginLeft:24 }}>*/}
                {/*    Total Active Subscribers: {activeSubscribers}*/}
                {/*</h3>*/}
            </Space.Compact>
        </Space>

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
         /*  User Form
         ***------------------------------*/}
        <Modal title="NBC Agent"
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
                    label="Full Name"
                    name="fullName"
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                >
                    <Input type="password"/>
                </Form.Item>

            </Form>
        </Modal>


        {/***------------------------------
         /*  Password Form
         ***------------------------------*/}
        <Modal title="Reset Password"
               open={passwordModalOpen}
               onOk={() => {
                   passwordForm.submit()
               }}
               confirmLoading={isLoading}
               onCancel={() => {
                   setPasswordModal(false)
               }}>

            <Form
                form={passwordForm}
                layout="vertical"
                onFinish={resetPassword}
            >

                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>


                <Form.Item
                    label="Agent"
                    name="fullName"
                >
                    <Input disabled={true}/>
                </Form.Item>


                <Form.Item
                    label="Password"
                    name="password"

                >
                    <Input type="password"/>
                </Form.Item>

            </Form>
        </Modal>


    </EyasiContentCard>;

}

export default AgentsListComponent

