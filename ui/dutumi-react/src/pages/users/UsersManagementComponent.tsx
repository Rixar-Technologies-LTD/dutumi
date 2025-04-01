
import {
    Button, DatePicker, Form,
    Input, Modal, Pagination,
    Select, Space, Spin,
    Table, Tag, TimePicker,
    Upload, UploadFile,
    UploadProps
} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import sectionIcon from "assets/images/icons/people/people.png"

import {getRequest, postMultipart, postRequest} from "../../services/http/RestClient";
import {notifyError, notifyHttpError, notifySuccess} from "../../services/notification/notifications";
import EyasiContentCard from "components/cards/EyasiContentCard";
import customerLoadingIcon from "components/Loading";
import {AppVersion, BroadcastMessage} from "types/MessagesInterfaces";
import TextArea from "antd/es/input/TextArea";
import {
    EyeOutlined, FileImageOutlined,
    MessageOutlined, PlusCircleOutlined,
    UploadOutlined,
    UsergroupAddOutlined
} from "@ant-design/icons";

import {areEmpty, isEmpty, isNotEmpty} from "utils/helpers";
import Compact from "antd/es/space/Compact";
import moment from "moment";
import {User} from "types/system/AuthInterfaces";
import Search from "antd/es/input/Search";
import {useNavigate} from "react-router-dom";
import {Business} from "types/businesses/BusinessInterfaces";

// @ts-ignore
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const UsersManagementComponent = () => {

    const columns: ColumnsType<User> = [
        {
            title: 'S/N',
            render: (_, record) => (<> {record.id}</>),
        },
        {
            title: 'Name',
            render: (_, record) => (<> {record?.name ?? ''} </>),
        },
        {
            title: 'Email',
            render: (_, record) => (<> {record?.email ?? ''} </>),
        },
        {
            title: 'Status',
            render: (_, record) => (<>
                <Tag color={record.status=='ACTIVE'? 'green' :'grey'} > {record.status ?? 'UNKNOWN'}</Tag> <br/>
                <>{record.statusRemark}</>
            </>),
        },
        {
            title: 'Last Login',
            render: (_, record) => (<>
                {record?.last_login_at ?? ''}   <br/>
                <span style={{ fontWeight:'lighter'}}>{record?.logins_count ?? ''} Logins </span>
            </>),
        },
        {
            title: 'Created',
            dataIndex: 'created',
            render: (_, record) => (<>
                 {record.created_at ?? ''}
             </>),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, user) => (
                <Button icon={<EyeOutlined style={{}}/>}
                        onClick={() => viewUsers(user)}
                        type="primary">View
                </Button>
            ),
        }
    ];

    const [messagesList, updateMessageList] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [messageModalOpen, setMessageModal] = useState(false)
    const [audienceModalOpen, setAudienceModalOpen] = useState(false)
    const [topics, updateTeamTopicsList] = useState<AppVersion[]>([]);
    const [selectedTopic, setSecondCity] = useState<AppVersion>();

    const [searchQuery, updateSearchQuery] = useState("");
    const [messageContent, setMessageContent] = useState<string>('');
    const [audienceCount, setAudienceCount] = useState<number>(0);
    const [selectedMessage, setSelectedMessage] = useState<BroadcastMessage>();
    const [cancelModalOpen, setCancelModalOpen] = useState(false)
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [messageForm] = Form.useForm();
    const topicId = Form.useWatch('topicId', messageForm);
    const type = Form.useWatch('type', messageForm);

    const [totalRecords, updateTotalRecords] = useState(0);
    const [currentPageNo, updateCurrentPageNo] = useState(1);
    const [pageSize, updatePageSize] = useState(50);

    const navigate = useNavigate();

    //Fetch products
    useEffect(() => {
        fetchUsers();
    }, [
        pageSize,
        searchQuery
    ]);

    useEffect(() => {
        countSubscribers();
    }, [topicId,type]);

    const fetchUsers = () => {
        console.log("Fetching users...")
        setIsLoading(true)
        getRequest(`/api/v1/admin/users?query=${searchQuery}&pageNo=${pageSize}`)
            .then((response) => {
            setIsLoading(false);
            updateMessageList(response.data.items);
            updateTotalRecords(response.data.totalElements);
            updateCurrentPageNo(response.data.currentPageNo)
            updatePageSize(response.data.pageSize)
        }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const countSubscribers = () => {

        if(isEmpty(topicId) || isEmpty(type) ){
            console.log("skipping subscribers count")
            return ;
        }

        const url = `/api/v1/admin/subscriptions/reports/subscribers/topic?topicId=${topicId}&targetTemplate=${type}`;
        console.log('countSubscribers: ',url);
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data.respBody)
                setAudienceCount(response.data.respBody);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const saveMessage = (message: any) => {


        if(areEmpty(message.send_at_date, message.send_at_time)){
            notifyError("Invalid Input","Please specify valid send date and time");
            return;
        }

        const formData = new FormData();
        let url = "/api/v1/admin/templates/news/add";
        if (isNotEmpty(message.id)) {
            formData.set('id', message.id);
            url = "/api/v1/admin/templates/news/update";
        }

        formData.set('topicId', message.topicId);
        formData.set('content', message.content);
        formData.set('type', message.type);
        formData.set('sendAt', formatSendDate(message.send_at_date, message.send_at_time));

        if (fileList.length > 0) {
            // @ts-ignore
            formData.append('image', fileList[0]);
        }

        // @ts-ignore
        console.log(JSON.stringify([...formData.entries()]));
        console.log("entries", JSON.stringify(formData.entries()))

        setIsLoading(true);
        postMultipart(url, formData)
            .then((response) => {
                notifySuccess("Success", "Message Saved")
                fetchUsers();
                setIsLoading(false);
                setMessageModal(false)
            }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
            setIsLoading(false);
        }).finally(() => {
            setFileList([])
        })
    }

    const deleteSelectedMessage = () => {
        const payload = {"id": selectedMessage?.id}
        console.log(JSON.stringify(payload));
        setIsLoading(true);
        const url = "/api/v1/admin/templates/news/delete";
        postRequest(url, payload)
            .then((response) => {
                notifySuccess("Success", "Message Deleted")
                fetchUsers();
                setIsLoading(false);
                setMessageModal(false)
            }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
            setIsLoading(false);
        })
    }

    const broadCastSelectedMessage = () => {
        console.log("Broadcast the message audience...")
        setIsLoading(true)
        getRequest(`/api/v1/admin/broadcast/single?messageId=${selectedMessage?.id}`)
            .then((response) => {
                setAudienceModalOpen(false);
            }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const showMessageForm = (user: User | null) => {
        setMessageModal(true)
        messageForm.resetFields();
        messageForm.setFieldsValue(user);
        if (user != null) {
            messageForm.setFieldValue('id', user.id);
            messageForm.setFieldValue('send_at_date', '');
            messageForm.setFieldValue('send_at_time', '');
        }
    }

    const onSecondCityChange = (value: any) => {
        setSecondCity(value);
    };

    const formatSendDate = (send_at_date: any, send_at_time: any) => {
        const sendAtDate = moment(send_at_date.toString());
        const sendAtTime = moment(send_at_time.toString());
        const combinedDateTime = sendAtDate.set({
            hour: sendAtTime.hour(),
            minute: sendAtTime.minute()
        });
        return combinedDateTime.format("DD-MM-YYYY HH:mm");
    }

    const onPageChange = (page: number, pageSize: number) => {
        updateCurrentPageNo(page)
    }

    const onPageSizeChange = (current: number, size: number) => {
        updatePageSize(size)
    }

    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    const onSearch = (value: string) => {
        if(value===searchQuery){
            fetchUsers()
        }
        updateSearchQuery(value)
    }

    const viewUsers = (user:User) => {
        navigate(`/users/${user.id}`);
    }

    const viewBusiness = (business: Business) => {
        navigate(`/businesses/${business?.id}`);
    }

    return <EyasiContentCard title="Users"
                             iconImage={sectionIcon}
                             subTitle="Management"
                             extraHeaderItems={[
                                 isLoading && <Spin key="1" indicator={customerLoadingIcon}></Spin>
                             ]}>


        {/**---------------*
         /** Search
         *----------------*/}
        <Space style={{marginBottom: 24}} direction="horizontal">
            <Search size="large"
                    placeholder="Find Users"
                    onSearch={onSearch}
                    allowClear/>

            <Button
                style={{marginRight: '8px'}}
                size="large"
                type="primary" onClick={() => {
                showMessageForm(null)
            }}>
                <PlusCircleOutlined/>
                Create User</Button>
        </Space>

        {/**---------------------------*
         /** Staff Table
         *-----------------------------*/}
        <Table
            columns={columns}
            dataSource={messagesList}
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
         /*  Message
         ***------------------------------*/}
        <Modal title="Message"
               open={messageModalOpen}
               width="640px"
               onOk={() => {
                   messageForm.submit()
               }}
               confirmLoading={isLoading}
               okText="Save"
               onCancel={() => {
                   setMessageModal(false)
               }}>

            <Form
                form={messageForm}
                layout="vertical"
                onFinish={saveMessage}
            >


                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Topic/Team"
                    name="topicId"
                >
                    <Select
                        value={selectedTopic}
                        onChange={onSecondCityChange}
                        style={{width: '100%'}}
                        options={topics.map((topic) => ({label: topic.buildNumber, value: topic.id}))}
                    />
                </Form.Item>

                <Form.Item
                    label="Channel"
                    name="type"
                >
                    <Select
                        value={selectedTopic}
                        onChange={onSecondCityChange}
                        style={{width: '100%'}}
                        options={[
                            {"label": "SMS", "value": "SMS_NEWS"},
                            {"label": "WhatsApp", "value": "WHATSAPP_NEWS"},
                        ].map((channel) => ({label: channel.label, value: channel.value}))}
                    />
                </Form.Item>


                <Form.Item>
                    <Upload maxCount={1} {...props} style={{marginBottom: '16px', width: '100%'}}>
                        <Button icon={<UploadOutlined/>}>
                            Select Attachment Image
                            <FileImageOutlined style={{fontSize: '18px', color: '#118ab2'}}/>
                        </Button>
                    </Upload>
                </Form.Item>


                <Form.Item
                    style={{marginBottom: 48, marginTop: '16px'}}
                    label="Message Content"
                    name="content"
                >
                    <TextArea showCount/>
                </Form.Item>

                <Compact>
                    <Form.Item
                        name="send_at_date"
                        label="Send On (Date)">
                        <DatePicker/>
                    </Form.Item>

                    <Form.Item
                        name="send_at_time"
                        label="Send At (Time)">
                        <TimePicker/>
                    </Form.Item>

                    <p style={{
                        height: '1.4em',
                        padding: '8px 16px ',
                        margin: '8px 16px ',
                        marginTop: '28px ',
                        backgroundColor: '#eaf9e7',
                        borderRadius: '8px',
                        border: '1px solid #69d259'
                    }}>
                        Audience
                        <span style={{fontWeight: 'bold'}}> {audienceCount} </span>
                     </p>
                </Compact>


            </Form>
        </Modal>


        {/***------------------------------
         /*  OnDemand Broadcast Audience
         ***------------------------------*/}
        <Modal title="Broadcast Message"
               open={audienceModalOpen}
               footer={<></>}
               confirmLoading={isLoading}
               onCancel={() => {
                   setAudienceModalOpen(false)
                   setSelectedMessage({} as BroadcastMessage);
                   setAudienceCount(0);
               }}>

            <h3 style={{padding: 0, margin: 0}}>
                Audience Count
            </h3>
            <p style={{padding: 0, margin: 0}}>
                <UsergroupAddOutlined style={{marginRight: '8px'}}/>
                {audienceCount}
            </p>


            <h3 style={{padding: 0, margin: 0, marginTop: '12px'}}>Message Content</h3>
            <p style={{padding: 0, margin: 0}}>
                {selectedMessage?.content ?? 'N/A'}
            </p>

            <Button style={{marginTop: '24px'}} type="primary" loading={isLoading} onClick={broadCastSelectedMessage}>
                <MessageOutlined/>
                BROADCAST NOW!
            </Button>

        </Modal>


        {/***------------------------------
         /*  Cancellation
         ***------------------------------*/}
        <Modal title="Confirm"
               open={cancelModalOpen}
               footer={<></>}
               confirmLoading={isLoading}
               onCancel={() => {
                   setCancelModalOpen(false)
                   setSelectedMessage({} as BroadcastMessage);
               }}>

            <h3 style={{padding: 0, margin: 0, marginTop: '16px', marginBottom: '8px'}}>Are you sure you want to
                cancel?</h3>
            <p style={{padding: 0, margin: 0}}>
                {selectedMessage?.content ?? 'N/A'}
            </p>

            <Button style={{marginTop: '24px', backgroundColor: "#d62828"}}
                    type="primary" loading={isLoading}
                    onClick={deleteSelectedMessage}>
                Cancel Message
            </Button>

        </Modal>


    </EyasiContentCard>;

}

export default UsersManagementComponent
