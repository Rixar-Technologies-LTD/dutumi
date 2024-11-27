
import React, {useEffect, useState} from "react";

import "../../../../css/components.css"

import {Button, Card, Form, Input, Modal, Pagination, Radio, RadioChangeEvent, Select, Space, Table, Tag} from "antd";
import {getRequest, postRequest} from "../../../../services/http/RestClient";
import {notifyHttpError} from "../../../../services/notification/notifications";
import type {ColumnsType} from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
import {User} from "../../../../interfaces/system/AuthInterfaces";
import {UserActivity} from "../../../../interfaces/system/EventsInterfaces";

interface GoodProps {
    user?: User
}

const UserActivitiesComponent = ({ user  } : GoodProps) => {

    const columns: ColumnsType<UserActivity> = [
        {
            title: 'S/N',
            dataIndex: 'reference',
            key: 'reference',
            render: (_, record) => (
                <>
                    <span style={{ fontWeight: 'lighter', fontSize: '12px'}}>{record.date}</span>
                </>
            ),
        },
        {
            title: 'Channel',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <div>
                        {record.appPlatform} {record.appVersion} <br/>
                        ({record.appBuildNumber})
                    </div>
                </>
            ),
        },
        {
            title: 'Narration',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <div>
                        {record.module} <br/>
                        {record.narration}
                    </div>
                </>
            ),
        },
        {
            title: 'Duration (ms)',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <div><span style={{ color:'green'}}>{record.duration}</span>
                    </div>
                </>
            ),
        },
        {
            title: 'IP Address',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <div><span style={{ color:'green'}}>{record.sourceIp}</span>
                    </div>
                </>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, licence) => (
                <>
                    <Tag>{licence.status ?? ''}</Tag><br/>
                </>
            ),
        }
    ];


    const [userActivities, updateBranchesList] = useState<UserActivity[]>([]);

    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, updatePageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, updateSearchQuery] = useState("");

    const [filter, setFilterGroup] = useState("all");
    const [activationModalOpen, setActivationModalOpen] = useState<boolean>(false);
    const [deactivationModelOpen, setDeactivationModalOpen] = useState<boolean>(false);

    const [activationForm] = Form.useForm();

    useEffect(() => {
        fetchUserActivities();
    }, [user,currentPageNo,pageSize]);


    const fetchUserActivities = () => {

        if(user==null){
            return ;
        }

        const url = `/api/v1/manage/users/activities?userId=${user?.id}&pageSize=${pageSize}&pageNo=${currentPageNo-1}`;
        console.log(`fetching activities... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                updateBranchesList(response.data.items);
                updateCurrentPageNo(response.data.currentPageNo);
                setTotalItems(response.data.totalElements);
                setTotalElements(response.data.totalElements);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const activateSubscription = (payload:any) => {
        const url = `/api/v1/manage/business/subscriptions/activate`;
        console.log(`activating subscription... ${url} ${JSON.stringify(payload)}`)
        setIsLoading(true);
        postRequest(url,payload)
            .then((response) => {
                console.log(response.data);
                setActivationModalOpen(false)
                fetchUserActivities();
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const deactivateSubscription = (payload:any) => {
        const url = `/api/v1/manage/business/subscriptions/deactivate`;
        console.log(`de-activating subscription... ${url} ${JSON.stringify(payload)}`)
        setIsLoading(true);
        postRequest(url,payload)
            .then((response) => {
                console.log(response.data);
                setDeactivationModalOpen(false)
                fetchUserActivities();
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
            fetchUserActivities()
        }
        updateSearchQuery(value)
    }


    return <>
        <Card className="good-shadow" title={<>
            User Activities ({totalElements})
         </>}>

            {/**---------------------------*
             /** Branches Table
             *-----------------------------*/}
            <Table
                columns={columns}
                dataSource={userActivities}
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



            {/***------------------------------
             /*  Activate
             ***------------------------------*/}
            <Modal title="Activate Subscription"
                   open={activationModalOpen}
                   width="640px"
                   onOk={() => {
                       activationForm.submit()
                   }}
                   confirmLoading={isLoading}
                   okText="Save"
                   onCancel={() => {
                       setActivationModalOpen(false)
                   }}>

                <Form
                    form={activationForm}
                    layout="vertical"
                    onFinish={activateSubscription}
                >

                    <Form.Item name="subscriptionId" hidden>
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        style={{}}
                        label="Paid"
                        name="paidAmount"
                        rules={[{required: true}]}
                    >
                        <Input type="number"/>
                    </Form.Item>

                    <Form.Item
                        style={{}}
                        label="Remark"
                        name="remark"
                        rules={[{required: true}]}
                    >
                        <TextArea showCount/>
                    </Form.Item>
                </Form>
            </Modal>


            {/***------------------------------
             /*  De-activation Subscription
             ***------------------------------*/}
            <Modal title="Deactivate Subscription"
                   open={deactivationModelOpen}
                   width="640px"
                   onOk={() => {
                       activationForm.submit()
                   }}
                   confirmLoading={isLoading}
                   okText="Save"
                   onCancel={() => {
                       setActivationModalOpen(false)
                   }}>

                <Form
                    form={activationForm}
                    layout="vertical"
                    onFinish={deactivateSubscription}
                >

                    <Form.Item name="subscriptionId" hidden>
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        style={{}}
                        label="Remark"
                        name="remark"
                        rules={[{required: true}]}
                    >
                        <TextArea showCount/>
                    </Form.Item>
                </Form>
            </Modal>


        </Card>
    </>;

}

export default UserActivitiesComponent;
