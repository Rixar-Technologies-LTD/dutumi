import {
    Button,
    Divider,
    List,
    Modal,
    Pagination,
    Radio,
    RadioChangeEvent,
    Space,
    Spin,
    Table,
    Tag
} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {FileDoneOutlined} from "@ant-design/icons";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    MessageOutlined,
    UndoOutlined,
    UsergroupAddOutlined
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import {notifyHttpError, notifySuccess} from "../../../services/notification/notifications";
import {getRequest, postRequest} from "../../../services/rest/RestService";
import EyasiContentCard from "../../templates/cards/EyasiContentCard";
import customerLoadingIcon from "../../templates/Loading";
import {
    RemindersStats,
    Business,
    SubscriptionStats
} from "../../../interfaces/businesses/BusinessInterfaces";
import sectionIcon from "../../../assets/images/icons/subscription.png"
import {useNavigate} from "react-router-dom";


const BusinessesListComponent = () => {

    const [subscribersList, updateSubscribersList] = useState<Business[]>([]);
    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, updatePageSize] = useState(50);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, updateSearchQuery] = useState("");
    const [subscriptionStats, setStats] = useState<SubscriptionStats>();
    const [remindersStats, setRemindersStats] = useState<RemindersStats>();
    const [remindersModalOpen, setRemindersModalOpen] = useState<boolean>(false);

    const [selectedSubscription, setSelectedSubscription] = useState<Business|null>();
    const [isSubscriptionVisible, setSubscriptionsModalVisible] = useState(false);

    const [filter, setFilterGroup] = useState("all");
    const navigate = useNavigate();

    //Fetch products
    useEffect(() => {
        fetchBusinessesList();
    }, [currentPageNo, pageSize, searchQuery,filter]);

    const fetchBusinessesList = () => {
        const url = `/api/v1/manage/businesses/get?query=${searchQuery}&filterGroup=${filter}&pageSize=${pageSize}&pageNo=${currentPageNo-1}`;
        console.log(`Fetching businesses... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                updateSubscribersList(response.data.items);
                setTotalItems(response.data.totalElements);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const viewBusiness = (business:Business) => {
        navigate(`/businesses/${business.id}`);
    }

    const fetchRemindersStats= () => {
        setIsLoading(true);
        const url = `/api/v1/reports/subscriptions/expired/reminders`;
        console.log(`fetching reminders stats... ${url}`)
        getRequest(url)
            .then((response) => {
                console.log(response.data.payload);
                setRemindersStats(response.data.payload);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const remindExpiredSubscribers = () => {

        const url:string = `/api/v1/messages/broadcast/reminders`;
        console.log(`Sending subscriptions reminders... ${url}`)

        setIsLoading(true);
        postRequest(url,{ })
            .then((response) => {
                console.log(response.data.payload);
                fetchRemindersStats();
                notifySuccess("Reminders Sent")
                setRemindersModalOpen(false)
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
            setRemindersModalOpen(false)
        })
    }

    const onPageChange = (page: number, pageSize: number) => {
        updateCurrentPageNo(page)
    }

    const onPageSizeChange = (current: number, size: number) => {
        updatePageSize(size)
    }

    const onSearch = (value: string) => {
        if(value===searchQuery){
            fetchBusinessesList()
        }
        updateSearchQuery(value)
    }

    const onFilterGroupChange = (e: RadioChangeEvent) => {
        setFilterGroup(e.target.value);
    };

    const showReminders = ()=>{
        setRemindersModalOpen(true)
        fetchRemindersStats();
    }

    const showTransactions = (subscription: Business)=>{
        setSelectedSubscription(subscription);
        setSubscriptionsModalVisible(true);
    }

    const columns: ColumnsType<Business> = [
        {
            title: 'REF',
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
                        {record.phoneNumber} <br/>
                        {record.email} <br/>
                    </div>
                </>
            ),
        },
        {
            title: 'Licence Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, business) => (
                <>
                    <Tag color="processing">{business.status ?? 'UNKNOWN'}</Tag><br/>
                    Starts: {business?.subscription?.startDate}<br/>
                    Ends: <span style={{ }}>{business?.subscription?.endDate}</span><br/>
                </>
            ),
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: (_, record) => (
                <>
                   {record.physicalAddress ?? 'UNKNOWN'}
                </>
            ),
        },
        {
            title: 'Payments',
            dataIndex: 'transactions',
            key: 'transactions',
            render: (_, record) => (
                <>
                    <Space size="middle">
                        <Button type="default" size="small" onClick={()=>{showTransactions(record)}} >
                            <FileDoneOutlined/>
                            Transactions ({record.transactions?.length})
                        </Button>
                    </Space>
                </>
            ),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={()=>{viewBusiness(record)}}> View</Button>
                </Space>
            ),
        },
    ];


    return <EyasiContentCard title="Businesses"
                             subTitle="history"
                             iconImage={sectionIcon}
                             extraHeaderItems={[
                                 isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>,
                                 <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={()=>{
                                     fetchBusinessesList();
                                 }} key="2"
                                         type="default">Refresh</Button>,
                                 //  <Button href="/products/instance/new" key="1" type="primary">Add Order</Button>
                             ]}>

        {/**---------------*
         /** Search
         *----------------*/}
        <Space style={{marginBottom: 24, marginTop: 48}} direction="horizontal">
            <Search size="large"
                    placeholder="Search Businesses"
                    onSearch={onSearch}
                    allowClear/>

            <div style={{padding: '8px 16px', border: '1px solid #a9a9a9', borderRadius:'4px'}}>
                <Radio.Group onChange={onFilterGroupChange} defaultValue="all">
                    <Radio value="all">All</Radio>
                    <Radio value="week">Week</Radio>
                    <Radio value="month">Month</Radio>
                    <Radio value="expired">
                        <span style={{color:'#d62828'}}>Expired</span>
                    </Radio>
                </Radio.Group>
            </div>

            <div style={{padding: '8px 16px'}}>
                { filter !== 'all' && <Tag style={{ fontSize: '18px', color: 'blue', padding:'4px 8px'}} >{totalItems}</Tag>}
            </div>
        </Space>


        {/**---------------------------*
         /** Orders Table
         *-----------------------------*/}
        <Table
            columns={columns}
            dataSource={subscribersList}
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
         /*  Audience
         ***------------------------------*/}
        <Modal title="Subscription Reminders"
               open={remindersModalOpen}
               footer={<></>}
               confirmLoading={isLoading}
               onCancel={() => {
                   setRemindersModalOpen(false)
               }}>


            <p style={{padding: 0, margin: 0}}>
                <UsergroupAddOutlined style={{marginRight: '8px',color:'orange'}}/>
                Expired Subscriptions: {remindersStats?.expiredSubscriptions}
            </p>
            <p style={{padding: 0, margin: 0}}>
                <CheckCircleOutlined style={{marginRight: '8px',color:'green'}}/>
                Reminded: {remindersStats?.sentReminders}
            </p>
            <p style={{padding: 0, margin: 0}}>
                <ClockCircleOutlined style={{marginRight: '8px',color:'blue'}}/>
                Not Reminded: {remindersStats?.pendingReminders}
            </p>

            <h3 style={{padding: 0, margin: 0, marginTop: '12px'}}>
                <MessageOutlined style={{marginRight:'8px'}}></MessageOutlined>
                Reminder Message</h3>
            <p style={{padding: '8px', margin: 0,
                border:'1px solid #a9a9a9',
                backgroundColor: '#f5f5f5',
                borderRadius:'4px'}}>
                {remindersStats?.reminderMessage}
            </p>

            <Button style={{marginTop: '24px'}} type="primary" loading={isLoading} onClick={remindExpiredSubscribers}>
                <MessageOutlined/>
                Send Reminders to {remindersStats?.pendingReminders} Subscribers
            </Button>

        </Modal>


        {/***------------------------------
         /*  Subscription Details
         ***------------------------------*/}
        <Modal title="Subscription Details"
               open={isSubscriptionVisible}
               footer={<></>}
               onCancel={() => {
                   setSubscriptionsModalVisible(false)
               }}>

            <List>
                <List.Item key="1">
                    <List.Item.Meta
                        title={<p style={{fontWeight: 'lighter', padding: '0px', margin: '0px'}}>Phone</p>}
                    />
                    <div>
                        {selectedSubscription?.phoneNumber}
                    </div>
                </List.Item>
                <List.Item key="2" style={{margin: '0px', padding: '0px'}}>
                    <List.Item.Meta title={<p style={{fontWeight: 'lighter', padding: '0px', margin: '0px'}}>Topic</p>}/>
                    <div>{selectedSubscription?.name??''}</div>
                </List.Item>
                <List.Item key="2" style={{margin: '0px', padding: '0px'}}>
                    <List.Item.Meta title={<p style={{fontWeight: 'lighter', padding: '0px', margin: '0px'}}>Start Date</p>}/>
                    <div>{selectedSubscription?.startDate?? 'Unknown'}</div>
                </List.Item>
                <List.Item key="2" style={{margin: '0px', padding: '0px'}}>
                    <List.Item.Meta title={<p style={{fontWeight: 'lighter', padding: '0px', margin: '0px'}}>End Date</p>}/>
                    <div>{selectedSubscription?.endDate?? 'Unknown'}</div>
                </List.Item>
            </List>
            <Divider/>

            <h3 style={{marginTop:'48px'}}>Transactions</h3>
            <div style={{ border: '1px solid #f1f1f1', padding:'8px 16px'}}>
                <List
                    dataSource={selectedSubscription?.transactions}
                    renderItem={(transaction) => (
                        <List.Item key={transaction.id} style={{margin:'0px', padding:'0px'}}>
                            <List.Item.Meta
                                title={<p>{transaction?.amount} TZS</p>}
                                description={`${transaction.channel} ${transaction.channel}`}
                            />
                            <div>{transaction?.createdDate}</div>
                        </List.Item>
                    )}
                />
            </div>

        </Modal>

    </EyasiContentCard>;

}

export default BusinessesListComponent

