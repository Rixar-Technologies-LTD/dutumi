import {Button, Image, List, Modal, Pagination, Space, Spin, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import sectionIcon from "../../../assets/images/icons/notifications/messages.png"
import {getRequest} from "../../../services/http/RestClient";
import {notifyHttpError} from "../../../services/notification/notifications";
import EyasiContentCard from "../../templates/cards/EyasiContentCard";
import customerLoadingIcon from "../../templates/Loading";
import {NotificationHistory} from "../../../interfaces/MessagesInterfaces";
import {limitText} from "../../../utils/helpers";
import {MessageOutlined, UsergroupAddOutlined, WhatsAppOutlined} from "@ant-design/icons";

const MessagesComponent = () => {

    const columns: ColumnsType<NotificationHistory> = [
        {
            title: 'Time',
            dataIndex: 'created_at',
            width: '96px',
            render: (_, record) => (<> {record.createdDate} </>),
        },
        {
            title: 'S/N',
            dataIndex: 'id',
            render: (_, record) => (<> MSG{record.template?.id}
                <br/>Batch {record.pageNumber} of {record.totalPages}</>
            ),
        },
        {
            title: 'Count',
            dataIndex: 'count',
            width: '96px',
            render: (_, record) => (<div style={{width:96}}>
                <Tag style={{fontSize:'1.2em'}} color="blue">{record.receiversCount}</Tag>
            </div>),
        },
        {
            title: 'Audience',
            dataIndex: 'batches',
            render: (_, record) => (<div>
                <Button icon={<UsergroupAddOutlined/>} type="primary"
                        onClick={()=>{showEventBatches(record)}}>View Batch </Button> <br/>
            </div>),
        },
        {
            title: 'Topic',
            dataIndex: 'topic',
            width: '96px',
            render: (_, record) => (<div style={{width:96}}>
                <Tag > </Tag>
            </div>),
        },
        {
            title: 'Message Content',
            dataIndex: 'message',
            render: (_, record) => (<div style={{width:192}}>

                {/*WhatsApp*/}
                { record.channel === 'WhatsApp' &&
                    <Space><Image  style={{border: '2px solid green'}} width="32px" src={ record.template?.imageUrl??''}></Image>
                    <Tag style={{marginTop:'6px'}} icon={<WhatsAppOutlined/>} color="green">WhatsApp</Tag></Space>}

                {/*SMS Notification*/}
                { record.channel === 'SMS' && <Tag style={{marginTop:'6px'}} icon={<MessageOutlined/>} color="blue">SMS</Tag>} <br/>


                {limitText(record.content,72)}
            </div>),
        },
        {
            title: 'Schedule ',
            dataIndex: 'schedule',
            render: (_, record) => (<div style={{width:108}}>
                <Tag>Scheduled: {record.template?.sendAt??''}</Tag>
                <Tag>Sent At: {record.template?.deliveredAt??''}</Tag>
            </div>),
        },


    ];

    const [eventsList, updateItemsList] = useState<NotificationHistory[]>([]);
    const [totalRecords, updateTotalRecords] = useState(0);
    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [pageSize, updatePageSize] = useState(50);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, updateSearchQuery] = useState("");

    const [eventDetailsModalVisible, setEventDetailsModalVisible] = useState<boolean>(false);
    const [selectedBroadcastEvent, setSelectedBroadcastEvent] = useState<NotificationHistory>();

    //Fetch products
    useEffect(() => {
        fetchRecords();
    }, [searchQuery]);

    useEffect(() => {
    }, [eventsList]);

    const fetchRecords = () => {
        console.log("Fetching history...")
        setIsLoading(true)
        getRequest(`/api/v1/admin/notifications/history?query=${searchQuery}`).then((response) => {
            updateItemsList(response.data.items);
            updateTotalRecords(response.data.totalElements);
            updateCurrentPageNo(response.data.currentPageNo)
            updatePageSize(response.data.pageSize)
        }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
        }).finally(() => {
            setIsLoading(false)
        })
    }


    const onPageChange = (page: number, pageSize: number) => {
        updateCurrentPageNo(page)
    }
    const onPageSizeChange = (current: number, size: number) => {
        updatePageSize(size)
    }

    const showEventBatches = (event:  NotificationHistory) => {
        setSelectedBroadcastEvent(event)
        setEventDetailsModalVisible(true)
    }

    return <EyasiContentCard title="Sent Notifications"
                             iconImage={sectionIcon}
                             subTitle=""
                             extraHeaderItems={[
                                 isLoading && <Spin key="customerLoadingIcon" indicator={customerLoadingIcon}></Spin>,
                                 <Button key={2} onClick={fetchRecords}>Refresh</Button>
                             ]}>

        {/**---------------------------*
         /** Staff Table
         *-----------------------------*/}
        <Table
            columns={columns}
            dataSource={eventsList}
            loading={isLoading}
            pagination={false}
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
         /*  Audience
         ***------------------------------*/}
        <Modal title={`Broadcast Event ${selectedBroadcastEvent?.createdDate}`}
               open={eventDetailsModalVisible}
               footer={<></>}
               confirmLoading={isLoading}
               onCancel={() => {
                   setEventDetailsModalVisible(false)
                   setSelectedBroadcastEvent({} as NotificationHistory);
               }}>

            <h3 style={{padding: 0, margin: 0,marginTop: '24px'}}>
               <UsergroupAddOutlined/> Phones
            </h3>
            <List
                dataSource={selectedBroadcastEvent?.phones ?? []}
                renderItem={(phone: String,index) => (
                    <List.Item key={index}  style={{ padding: '0', margin: '0'}}>
                        <List.Item.Meta
                            style={{ padding: '0', margin: '0'}}
                            title={<span style={{fontWeight:'normal'}}>{phone} </span>}
                        />
                    </List.Item>
                )}
            />

        </Modal>


    </EyasiContentCard>;

}

export default MessagesComponent

