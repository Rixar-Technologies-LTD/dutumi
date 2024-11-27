
import React, {useEffect, useState} from "react";

import "../../../../css/components.css"

import {Button, Card, Form, Input, Modal, Pagination, Radio, RadioChangeEvent, Select, Space, Table, Tag} from "antd";
import {getRequest, postRequest} from "../../../../services/http/RestService";
import {notifyHttpError} from "../../../../services/notification/notifications";
import {
    Business, LicenseSubscription, SubscriptionPlan
} from "../../../../interfaces/businesses/BusinessInterfaces";
import type {ColumnsType} from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
import GoodVisibility from "../../../templates/GoodVisibility";
import Compact from "antd/es/space/Compact";
import {MoneyCollectOutlined, PauseCircleOutlined, PlusCircleFilled, PlusCircleOutlined} from "@ant-design/icons";
import {Project} from "../../../../interfaces/projects/ProjectsInterfaces";

interface BranchesProps {
    project?: Project
}

const ProjectIssuesComponent = ({ project  } : BranchesProps) => {

    const columns: ColumnsType<LicenseSubscription> = [
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
            title: 'Business',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <div>
                        <span style={{ color:'#5555ff'}}>{record.name}</span> <br/>
                        {record.amountDue ?? 'UNKNOWN'} TZS
                    </div>
                </>
            ),
        },
        {
            title: 'Payment (TZS)',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <div>
                        Paid. <span style={{ color:'green'}}>{record.amountPaid}</span> <br/>
                        Rem. <span style={{ color:'amber'}}>{record.amountDue - record.amountPaid}</span> <br/>
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
                    <Tag color={licence.status=='ACTIVE'?'green' : 'red'}>{licence.status ?? 'UNKNOWN'}</Tag><br/>
                    <span>EndDate: {licence.endDate}</span><br/>
                    <span>Days: {licence.remainingDays}</span><br/>
                </>
            ),
        },
        {
            title: 'Transactions',
            dataIndex: 'transactions',
            key: 'status',
            render: (_, licence) => (
                <>
                    <Button style={{marginBottom:'8px'}} className="green-border" type="default" onClick={()=>{showPaymentModal(licence)}} icon={<PlusCircleOutlined/>} >Add Payment </Button> <br/>
                </>
            ),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, licence) => (
                <>

                    {licence.status=='ACTIVE'?
                        <Button className="red-border" type="default" onClick={()=>{showDeactivationModal(licence)}} icon={<PauseCircleOutlined/>} > Stop </Button>:
                        <Button type="primary" onClick={()=>{showActivationForm(licence)}}> Activate </Button>
                    }
                </>
            ),
        }
    ];

    const [licenceSubscriptions, updateBranchesList] = useState<LicenseSubscription[]>([]);
    const [subscriptionPlans, setSubscriptionPlansList] = useState<SubscriptionPlan[]>([]);

    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, updatePageSize] = useState(4);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, updateSearchQuery] = useState("");

    const [filter, setFilterGroup] = useState("all");
    const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
    const [activationModalOpen, setActivationModalOpen] = useState<boolean>(false);
    const [deactivationModelOpen, setDeactivationModalOpen] = useState<boolean>(false);
    const [subscriptionModalOpen, setSubscriptionModalOpen] = useState<boolean>(false);
    const [subscriptionPlanType, setSubscriptionPlanType] = useState("GENERIC");

    const [paymentForm] = Form.useForm();
    const [activationForm] = Form.useForm();
    const [subscriptionForm] = Form.useForm();

    useEffect(() => {
        // fetchSubscriptionHistory();
    }, [project,currentPageNo,pageSize]);

    const fetchSubscriptionHistory = () => {

        if(project==null){
            return ;
        }

        const url = `/api/v1/manage/business/subscriptions/history?businessId=${project?.id}&pageSize=${pageSize}&pageNo=${currentPageNo-1}`;
        console.log(`fetching branches... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                updateBranchesList(response.data.items);
                setTotalItems(response.data.totalElements);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const receivePayment = (payload:any) => {
        const url = `/api/v1/manage/payments/manual/receive`;
        console.log(`receiving payment... ${url} ${JSON.stringify(payload)}`)
        setIsLoading(true);
        postRequest(url,payload)
            .then((response) => {
                console.log(response.data);
                setPaymentModalOpen(false)
                fetchSubscriptionHistory();
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const addSubscription = (subscription:any) => {

        const payload = {
            "businessId" : project?.id,
            "activate" : false,
            "discount" : "0",
            "supportLevel": "Phone",
            ...subscription,
        }

        const url:string = isCustom()?  `/api/v1/manage/business/subscriptions/add/custom` : `/api/v1/manage/business/subscriptions/add`;
        console.log(`adding subscriptions... ${url} ${JSON.stringify(payload)}`)
        setIsLoading(true);
        postRequest(url,payload)
            .then((response) => {
                console.log(response.data.payload);
                setIsLoading(false);
                setSubscriptionModalOpen(false);
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
                fetchSubscriptionHistory();
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
                fetchSubscriptionHistory();
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
            fetchSubscriptionHistory()
        }
        updateSearchQuery(value)
    }

    const showActivationForm = (licenceSubscription : LicenseSubscription) => {
        setActivationModalOpen(true);
        activationForm.setFieldValue('subscriptionId',licenceSubscription.id)
        activationForm.setFieldValue('paidAmount','')
    }

    const showDeactivationModal = (licenceSubscription : LicenseSubscription) => {
        setDeactivationModalOpen(true);
        activationForm.setFieldValue('subscriptionId',licenceSubscription.id)
    }

    const showPaymentModal = (licenceSubscription : LicenseSubscription) => {
        setPaymentModalOpen(true);
        paymentForm.setFieldValue('subscriptionId',licenceSubscription.id)
    }

    const showNewSubscriptionForm = ()=>{
        setSubscriptionModalOpen(true)
    }

    const onSubscriptionPlanTypeChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setSubscriptionPlanType(e.target.value);
    };

    const  isCustom = ()=>{
        return subscriptionPlanType == 'CUSTOM';
    }


    return <>
        <Card className="good-shadow" title={<>
            Open Issues
            <Button icon={<PlusCircleFilled/>} style={{ margin:'0px 24px'}} onClick={showNewSubscriptionForm} type="primary">Add Issue</Button>
        </>}>

            {/**---------------------------*
             /** Branches Table
             *-----------------------------*/}
            <Table
                columns={columns}
                dataSource={licenceSubscriptions}
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
             /*  Receive Payment
             ***------------------------------*/}
            <Modal title="Receive Payment"
                   open={paymentModalOpen}
                   width="640px"
                   onOk={() => {
                       paymentForm.submit()
                   }}
                   confirmLoading={isLoading}
                   okText="Save"
                   onCancel={() => {
                       setPaymentModalOpen(false)
                   }}>

                <Form
                    form={paymentForm}
                    layout="vertical"
                    onFinish={receivePayment}
                >

                    <Form.Item
                        name="subscriptionId" hidden>
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        style={{ marginTop:'24px'}}
                        label="Paid Amount"
                        name="paidAmount"
                        rules={[{required: true}]}
                    >
                        <Input type="number"/>
                    </Form.Item>

                    <Form.Item
                        label="Rixar Account"
                        name="paymentMethod">
                        <Select
                            style={{width: '100%'}}
                            options={[
                                {'label':'Cash', value: 'CASH'},
                                {'label':'Rixar NBC', value: 'NBC'},
                                {'label':'Rixar M-Pesa', value: 'MPESA'},
                                {'label':'Rixar CRDB', value: 'CRDB'},
                            ]
                                .map((plan) => ({label: plan.label, value: plan.value}))
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        style={{ marginTop:'24px'}}
                        label="Payment Method"
                        name="channel"
                        rules={[{required: true}]}
                    >
                        <Input type="text"/>
                    </Form.Item>

                    <Form.Item
                        style={{ marginTop:'24px'}}
                        label="Payer Phone"
                        name="payerPhone"
                        rules={[{required: true}]}
                    >
                        <Input type="text"/>
                    </Form.Item>

                    <Form.Item
                        style={{ marginTop:'24px'}}
                        label="Payer Name"
                        name="payerName"
                        rules={[{required: true}]}
                    >
                        <Input type="text"/>
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
                       setPaymentModalOpen(false)
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


            {/***------------------------------
             /*  Message
             ***------------------------------*/}
            <Modal title="Subscription"
                   open={subscriptionModalOpen}
                   width="640px"
                   onOk={() => {
                       subscriptionForm.submit()
                   }}
                   confirmLoading={isLoading}
                   okText="Save"
                   onCancel={() => {
                       setSubscriptionModalOpen(false)
                   }}>

                <Form
                    form={subscriptionForm}
                    layout="vertical"
                    onFinish={addSubscription}
                >

                    <Form.Item name="id" hidden>
                        <Input/>
                    </Form.Item>


                    <span>Plan Type</span> <br/>
                    <Radio.Group onChange={onSubscriptionPlanTypeChange} value={subscriptionPlanType} style={{ marginBottom: '24px'}}>
                        <Radio value="GENERIC">Generic</Radio>
                        <Radio value="CUSTOM">Customized</Radio>
                    </Radio.Group>

                    <Form.Item
                        hidden={subscriptionPlanType == 'CUSTOM'}
                        label="Subscription Plan"
                        name="subscriptionPlanId">
                        <Select
                            style={{width: '100%'}}
                            options={subscriptionPlans
                                .map((plan) => ({label: `${plan.planName} TZS ${plan.price} (${plan.numberOfUsers}-Users ${plan.numberOfBranches}-Branches)`, value: plan.id}))
                            }
                        />
                    </Form.Item>

                    <GoodVisibility visible={subscriptionPlanType == 'CUSTOM'}>
                        <div style={{
                            padding: '16px',
                            margin: '16px 0px',
                            border: '1px solid #bde0fe',
                            backgroundColor: '#f2f9ff'
                        }}>

                            <Compact>
                                <Form.Item
                                    style={{}}
                                    label="Plan Name"
                                    name="planName"
                                    rules={[{required: true}]}
                                >
                                    <Input type="text"/>
                                </Form.Item>
                                <Form.Item
                                    style={{}}
                                    label="Price per Month"
                                    name="price"
                                    rules={[{required: true}]}
                                >
                                    <Input type="number"/>
                                </Form.Item>
                            </Compact>

                            <Compact>
                                <Form.Item
                                    style={{}}
                                    label="Number Of User"
                                    name="numberOfUsers"
                                    rules={[{required: true}]}
                                >
                                    <Input type="number"/>
                                </Form.Item>

                                <Form.Item
                                    style={{}}
                                    label="Number Of Branches"
                                    name="numberOfBranches"
                                    rules={[{required: true}]}
                                >
                                    <Input type="number"/>
                                </Form.Item>`
                            </Compact>



                        </div>
                    </GoodVisibility>

                    <Form.Item
                        style={{}}
                        rules={[{required: true}]}
                        label="Number Of Months"
                        name="numberOfMonths"
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


        </Card>
    </>;

}

export default ProjectIssuesComponent;
