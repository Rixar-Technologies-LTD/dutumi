import {Button, Checkbox, Col, Form, Input, Modal, Row, Space, Spin, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import EyasiContentCard from "ui/templates/cards/EyasiContentCard";
import sectionIcon from "assets/images/icons/admin.png"
import {getRequest, postRequest} from "services/http/RestClient";
import {notifyHttpError, notifySuccess} from "services/notification/notifications";
import {PermissionGroup, Staff, User} from "../../../../types/system/AuthInterfaces";
import customerLoadingIcon from "ui/templates/Loading";

const SystemUsersComponent = () => {

    const columns: ColumnsType<User> = [
        {
            title: 'S/N',
            key: 'serial',
            dataIndex: 'serial',
            render: (_,record) => ( <>
                MBD0{record.id}
            </>),
        },
        {
            title: 'Name',
            key: 'name',
            render: (_,record) => ( <>
                {record.fullName}<br/>
                {record.username}<br/>
            </>),
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (_,record) => ( <> <Tag>{record.status}</Tag> </>),
        },
        {
            title: 'Manage',
            key: 'manage',
            render: (_, record) => (
              <Space size="middle">
                <Button type="primary"
                        size="small"
                        onClick={()=>showUserPermissionsForm(record)}>Permissions ({record.permissionNames.length})</Button>
              </Space>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
              <Space size="middle">
                <a style={{ border: '1px solid #'}} onClick={()=>showResetPasswordForm(record)}>Reset Password</a>
              </Space>
            ),
        },
        {
            title: 'Created',
            key: 'created',
            dataIndex: 'createdDate',
            render: (_,record) => ( <> {record.createdDate} <br/>
                <span style={{fontSize:'10px'}}> {record.createdBy}</span>
            </>),
        },
    ];

    const [usersList, updateOrdersList] = useState<User[]>([]);
    const [permissionGroups, updatePermissionsList] = useState<PermissionGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userID, setUserID] = useState(0)

    const [userForm] = Form.useForm();
    const [shippingCategoryModalOpen, setUserModalVisibility] = useState(false)

    const [resetPasswordForm] = Form.useForm();
    const [permissionsForm] = Form.useForm();
    const [resetPasswordModalOpen, setPasswordModal] = useState(false)
    const [userPermissionsModal, setUserPermissionsModal] = useState(false)

    //Fetch products
    useEffect(() => {
       fetchStaff();
        fetchPermissions();
    }, []);

    useEffect(() => {
    }, [usersList]);

    const fetchStaff = () => {
        console.log("Fetching users...")
        setIsLoading(true)
        getRequest("/api/v1/admin/users/list").then((response) => {
            updateOrdersList(response.data.items);
        }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
        }).finally(()=>{
            setIsLoading(false)
        })
    }

    const fetchPermissions = () => {
        console.log("Fetching permissions...")
        setIsLoading(true)
        getRequest("/api/v1/admin/resources/permissions").then((response) => {
            updatePermissionsList(response.data.items);
        }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
        }).finally(()=>{
            setIsLoading(false)
        })
    }

    const showResetPasswordForm = (user : User) => {
        console.log(JSON.stringify(user))
        resetPasswordForm.resetFields();
        resetPasswordForm.setFieldValue("username",user.username);
        setPasswordModal(true);

    }

    const showUserForm = (user : any) => {
        setUserModalVisibility(true)
        userForm.resetFields();
        userForm.setFieldValue("username",user.username);
    }

    const handleSave = (staff : Staff) => {
        console.log(JSON.stringify(staff))
        setIsLoading(true)
        postRequest("/api/v1/admin/users/add", staff)
            .then((response) => {
                notifySuccess("User Created", "")
                fetchStaff();
            }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
        }).finally(()=>{
            setIsLoading(true)
            fetchStaff();
        })
        setUserModalVisibility(false)
    }

    const handleResetPasswordSave = (user : any) => {
        console.log(JSON.stringify(user))
        setIsLoading(true)
        postRequest("/api/v1/admin/users/password/update", {
            "username" :user.username,
            "password": user.password
        })
            .then((response) => {
                notifySuccess("Password Reset", "")
                fetchStaff();
            }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
        }).finally(()=>{
            setIsLoading(false)
        })
        setPasswordModal(false)
    }

    const showUserPermissionsForm = (staff :User) => {
        permissionsForm.resetFields();
        permissionsForm.setFieldValue("userId",staff.id)
        permissionsForm.setFieldValue("permissions",staff.permissionNames)
        setUserPermissionsModal(true);
    }

    const updatePermissions = (userWithPermissions : any) => {

        console.log(JSON.stringify(userWithPermissions))
        setIsLoading(true)
        postRequest("/api/v1/admin/users/permissions/update", {
            "userId": userWithPermissions.userId,
            "permissions": userWithPermissions.permissions
        })
            .then((response) => {
                notifySuccess("Permissions Updated", "Success");
                setUserPermissionsModal(false)
                fetchStaff();
            }).catch((errorObj) => {
               notifyHttpError('Operation Failed', errorObj)
             }).finally(()=>{
                setIsLoading(false)
            })
    }

    return <EyasiContentCard title="Users"
                             iconImage={sectionIcon}
                             subTitle="Manage Admins & Staff"
                             extraHeaderItems={[
                                  isLoading && <Spin key="1a" indicator={customerLoadingIcon}></Spin>,
                                  <Button style={{marginRight:'8px'}} key="2a" type="primary" onClick={fetchStaff} ghost>Refresh</Button>,
                                  <Button key="3a" type="primary" onClick={showUserForm} ghost>Add User</Button>
                              ]}>

        {/**---------------------------*
         /** Staff Table
         *-----------------------------*/}
        <Table columns={columns} dataSource={usersList}/>


        {/***------------------------------
         /*  Shipping Category Form
         ***------------------------------*/}
        <Modal title="User information"
               open={shippingCategoryModalOpen}
               onOk={() => {
                   userForm.submit()
               }}
               onCancel={() => {
                   setUserModalVisibility(false)
               }}>

            <Form
                form={userForm}
                layout="vertical"
                onFinish={handleSave}
            >

                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="fullName"
                    label="Name"
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="username"
                    label="Login Username"
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                >
                    <Input type="password"/>
                </Form.Item>


            </Form>

        </Modal>


        {/***------------------------------
         /*  Reset Password Form
         ***------------------------------*/}

        <Modal title="Reset Password"
               open={resetPasswordModalOpen}
               onOk={() => {
                resetPasswordForm.submit()
               }}
               onCancel={() => {
                   setPasswordModal(false)
               }}>

            <Form
                form={resetPasswordForm}
                layout="vertical"
                onFinish={handleResetPasswordSave} >

                <Form.Item
                    hidden={true}
                    name="username"
                    label="Username"  >
                    <Input type="text"/>
                </Form.Item>

                <Form.Item
                    name="password"
                    label="New Password"  >
                    <Input type="password"/>
                </Form.Item>

            </Form>

        </Modal>

        <Modal title="User Permissions"
               style={{minWidth:'1080px'}}
               open={userPermissionsModal}
               onOk={() => {
                   permissionsForm.submit()
               }}
               onCancel={() => {
                   setUserPermissionsModal(false)
               }}>

            <Form
                form={permissionsForm}
                layout="vertical"
                onFinish={updatePermissions} >

                <Form.Item
                    hidden={true}
                    name="userId"
                    label="User Id"  >
                    <Input type="text"/>
                </Form.Item>

                <Form.Item
                    name="permissions"
                    label="">
                    <Checkbox.Group children={
                        <div style={{ display: 'flex',flexWrap:'wrap'}}>
                               {permissionGroups.map((permGroup)=>{
                               return <div key={permGroup.groupName} style={{display: "inline-block", padding: "8px 16px", minWidth: '272px', border:'1px solid #f4f4f4'}} >
                                <h3>{permGroup.groupName}</h3>
                                {permGroup.permissions.map((perm)=> {
                                    return <Row key={perm.code}  >
                                        <Col span={24}><Checkbox value={perm.code}>{perm.description}</Checkbox> </Col>
                                    </Row>
                                })}
                            </div>
                         })}
                       </div>}
                    />
                </Form.Item>

            </Form>

        </Modal>


    </EyasiContentCard>;

}

export default SystemUsersComponent

