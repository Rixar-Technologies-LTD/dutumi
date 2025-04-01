import {
    App,
    Button,
    Pagination, Space, Spin,
    Table, Tag,
    UploadProps
} from 'antd';


import 'css/colors.css';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import sectionIcon from "assets/images/icons/people/people.png"
import userIcon from "assets/images/icons/people/profile-2.png"

import {getRequest} from "services/http/RestClient";
import {notifyHttpError} from "services/notification/notifications";
import EyasiContentCard from "components/cards/EyasiContentCard";
import customerLoadingIcon from "components/Loading";


import {
    AppstoreOutlined,
    EyeOutlined, PlusCircleOutlined, ReloadOutlined,
} from "@ant-design/icons";


import {User} from "types/system/AuthInterfaces";
import Search from "antd/es/input/Search";
import {useNavigate} from "react-router-dom";
import {Business} from "types/businesses/BusinessInterfaces";
import UserForm from "pages/users/forms/UserForm";
import PasswordResetForm from "pages/users/forms/PasswordResetForm";

// @ts-ignore
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const UsersManagementComponent = () => {

    const columns: ColumnsType<User> = [
        {
            title: 'Name',
            render: (_, record) => (<>
                <Space>
                    <img alt="user" src={userIcon} width={24}/>
                    <span>
                        {record?.name ?? ''} <br/>
                        {record?.email ?? ''}
                    </span>
                </Space>

            </>),
        },
        {
            title: 'Workspace',
            render: (_, record) => (<>
                 <span className="color-primary">
                     <AppstoreOutlined/>
                     {record?.workspace?.name ?? ''}
                </span>
            </>),
        },
        {
            title: 'Status',
            render: (_, record) => (<>
                <Tag color={record.status == 'ACTIVE' ? 'green' : 'grey'}> {record.status ?? 'UNKNOWN'}</Tag> <br/>
                <>{record.statusRemark}</>
            </>),
        },
        {
            title: 'Last Login',
            render: (_, record) => (<>
                {record?.last_login_at ?? ''} <br/>
                <span style={{fontWeight: 'lighter'}}>{record?.logins_count ?? ''} Logins </span>
            </>),
        },
        {
            title: 'Created',
            dataIndex: 'created',
            render: (_, record) => (<>
                {record.created_at ?? ''} <br/>
                <span style={{fontWeight: 'lighter'}}>By {record.creator_name}</span>
            </>),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, user) => (<>
                    <Space direction="vertical">
                        <Button
                            size="small"
                            icon={<EyeOutlined style={{}}/>}
                            onClick={() => showUserForm(user)}
                            type="default">Update</Button>

                        <Button
                            size="small"
                            className="btn-default"
                            icon={<ReloadOutlined style={{}}/>}
                            onClick={() => showPasswordForm(user)}
                            type="default">Reset Password</Button>
                    </Space>
                </>
            ),
        }
    ];

    const [messagesList, updateMessageList] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, updateSearchQuery] = useState("");

    const [userFormVisible, setUserFormVisible] = useState<boolean>(false);
    const [isPasswordFormVisible, setPasswordFormVisible] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User>();

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

    const showUserForm = (user: User) => {
        setUserFormVisible(true)
        setSelectedUser(user);
    }

    const showPasswordForm = (user: User) => {
        setPasswordFormVisible(true)
        setSelectedUser(user);
    }

    const onPageChange = (page: number, pageSize: number) => {
        updateCurrentPageNo(page)
    }

    const onPageSizeChange = (current: number, size: number) => {
        updatePageSize(size)
    }

    const onSearch = (value: string) => {
        if (value === searchQuery) {
            fetchUsers()
        }
        updateSearchQuery(value)
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
                showUserForm({} as User)
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
                    onShowSizeChange={onPageSizeChange}/>

        <UserForm isVisible={userFormVisible}
                  title={`User`}
                  oldRecord={selectedUser}
                  onSaved={() => {
                      setUserFormVisible(false)
                      fetchUsers();
                  }}
                  onClose={() => {
                      setUserFormVisible(false)
                  }}/>

        <PasswordResetForm isVisible={isPasswordFormVisible}
                  title={`Reset "${selectedUser?.name}" Password`}
                  oldRecord={selectedUser}
                  onSaved={() => {
                      setPasswordFormVisible(false)
                      fetchUsers();
                  }}
                  onClose={() => {
                      setPasswordFormVisible(false)
                  }}/>

    </EyasiContentCard>;

}

export default UsersManagementComponent
