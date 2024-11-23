import {
    Button,
    DatePicker,
    Form, Input,
    Modal, Select, Space, Table, Tag,
} from 'antd';
import React, {useEffect, useState} from 'react';

import TextArea from "antd/es/input/TextArea";
import Compact from "antd/es/space/Compact";
import {getRequest, postRequest} from "../../../../../services/rest/RestService";
import {notifyHttpError, notifySuccess} from "../../../../../services/notification/notifications";
import {isEmpty} from "../../../../../utils/helpers";
import type {ColumnsType} from "antd/es/table";
import {SystemUser} from "../../../../../interfaces/system/AuthInterfaces";
import {Member, Task} from "../../../../../interfaces/projects/ProjectsInterfaces";
import {EyeOutlined} from "@ant-design/icons";

interface Props {
    isVisible: boolean;
    onChanged: ()=>void;
    feature?: Task | null ;
}

interface Todo {
    code: string;
    taskName: string;
    status: string;
    assignee?: SystemUser | null;
}

const TodoType = {
    DESIGN: "DESIGN",
    DEVELOPMENT: "DEVELOPMENT",
    TESTING: "TESTING",
    APPROVAL: "APPROVAL",
    DEPLOYMENT: "DEPLOYMENT" // or whichever term you prefer
};

const TodoStatus = [
     'Pending',
     'In Progress',
     'Completed',
     'Skipped'
];

const FeatureProgressComponent = ({isVisible,feature,onChanged}:Props) => {

    const columns: ColumnsType<Todo> = [

        {
            title: 'Task',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    <div>
                        {record.taskName}
                    </div>
                </>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <>
                    <Select
                        value={record.status}
                        onChange={(value, option)=>{
                            onAssigneeChange(record.code,value);
                        }}
                        placeholder="Select Status"
                        style={{ minWidth: '140px'}}
                        size="large"
                        options={TodoStatus.map((status)=>{return {'value':status,'label':status}})}
                        labelRender={(labelInValueType)=>{
                            return <span style={{ color:'#4895ef', fontSize: '0.9em'}}>{labelInValueType.label}</span>
                        }}
                    />

                    {/*<Tag color="processing">{record.status ?? 'UNKNOWN'}</Tag><br/>*/}
                </>
            )
        },
        {
            title: 'Assignee',
            dataIndex: 'assignee',
            key: 'assignee',
            render: (_, record) => (
                <>
                    <Select
                        value={record.assignee?.id}
                        onChange={(value, option)=>{
                            onAssigneeChange(record.code,value);
                        }}
                        placeholder="Select Status"
                        style={{ minWidth: '140px'}}
                        size="large"
                        options={membersList.map((member)=>{return {'value':member.user?.id,'label':member?.user?.name}})}
                        labelRender={(labelInValueType)=>{
                            return <span style={{ color:'#4895ef', fontSize: '0.9em'}}>{labelInValueType.label}</span>
                        }}
                    />
                </>
            )
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EyeOutlined/>} variant="outlined" onClick={() => {
                    }}>View</Button>
                </Space>
            )
        }
    ];

    const [isLoading, setIsLoading] = useState(false);
    const [todoList, setTodoList] = useState<Todo[]>([]);
    const [membersList, setMembersList] = useState<Member[]>([]);

    const [featureForm] = Form.useForm();

    //Fetch products
    useEffect(() => {
        fetchProjectMembers();
        buildTodoList();
    }, [feature]);


    const fetchProjectMembers = () => {
        if(isEmpty(feature?.project_id)){
            console.log("empty project id. not fetching project members")
            return ;
        }
        const url = `/api/v1/projects/members?projectId=${feature?.project_id}`;
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                setMembersList(response.data.respBody.data)
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const updateStatus = (item: any) => {

        const url:string = isEmpty(item.id)? '/api/v1/projects/features/add' : `/api/v1/projects/features/update`;
        setIsLoading(true);
        postRequest(url,{
            "feature_id" : feature?.id,
            ...item
        })
            .then((response) => {
                console.log(response.data.payload);
                featureForm.resetFields();
                notifySuccess("Record Saved")
                featureForm.resetFields();
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
               setIsLoading(false);
         })
    }

    const onAssigneeChange = (taskType: any,newAssigneeId: any) => {
        console.log(`${taskType} ${newAssigneeId}`)
        const newAssignments = {
            "featureId": feature?.id,
            "owner_id": feature?.owner?.id,
            "designer_id": feature?.designer?.id,
            "implementor_id": feature?.implementor?.id,
            "tester_id": feature?.tester?.id,
            "approver_id": feature?.approver?.id,
            "deployer_id": feature?.deployer?.id
        }

        switch (taskType){
            case TodoType.DESIGN: {
                newAssignments.designer_id = newAssigneeId;
                break;
            }
            case TodoType.DEVELOPMENT: {
                newAssignments.implementor_id = newAssigneeId;
                break;
            }
            case TodoType.TESTING: {
                newAssignments.tester_id = newAssigneeId;
                break;
            }
            case TodoType.APPROVAL: {
                newAssignments.approver_id = newAssigneeId;
                break;
            }
            case TodoType.DEPLOYMENT: {
                newAssignments.deployer_id = newAssigneeId;
                break;
            }
        }

        saveAssignments(newAssignments);
    }

    const saveAssignments = (assignments: any) => {
        const url:string ='/api/v1/projects/features/assign';
        setIsLoading(true);
        postRequest(url,assignments)
            .then((response) => {
                console.log(response.data.payload);
                notifySuccess("Assignment Updated")
                onChanged();
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }


    const onStatusChange = (taskType: any,newStatus: any) => {

        console.log(`${taskType} ${newStatus}`)
        const newStatusProgress = {
            "featureId": feature?.id,
            "design_status": feature?.design_status,
            "dev_status": feature?.dev_status,
            "test_status": feature?.test_status,
            "approval_status": feature?.approval_status,
            "deployment_status": feature?.deployment_status
        }

        switch (taskType){
            case TodoType.DESIGN: {
                newStatusProgress.design_status = newStatus;
                break;
            }
            case TodoType.DEVELOPMENT: {
                newStatusProgress.dev_status = newStatus;
                break;
            }
            case TodoType.TESTING: {
                newStatusProgress.test_status = newStatus;
                break;
            }
            case TodoType.APPROVAL: {
                newStatusProgress.approval_status = newStatus;
                break;
            }
            case TodoType.DEPLOYMENT: {
                newStatusProgress.deployment_status = newStatus;
                break;
            }
        }

        saveStatus(newStatusProgress);
    }

    const saveStatus = (newStatusProgress: any) => {
        const url:string ='/api/v1/projects/features/assign';
        setIsLoading(true);
        postRequest(url,newStatusProgress)
            .then((response) => {
                console.log(response.data.payload);
                notifySuccess("Assignment Updated")
                onChanged();
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }



    const buildTodoList = ()=>{
        const newList: Todo[] = [];
        newList.push({
            code: TodoType.DESIGN,
            taskName: "Design",
            status: "Completed",
            assignee: feature?.designer
        })
        newList.push({
            code: TodoType.DEVELOPMENT,
            taskName: "Implementation",
            status: "In Progress",
            assignee: feature?.implementor
        })
        newList.push({
            code: TodoType.TESTING,
            taskName: "Testing",
            status: "Pending",
            assignee: feature?.tester
        })
        newList.push({
            code: TodoType.APPROVAL,
            taskName: "Approval",
            status: "Pending",
            assignee: feature?.approver
        })
        newList.push({
            code: TodoType.DEPLOYMENT,
            taskName: "Deployment",
            status: "Pending",
            assignee: feature?.deployer
        })
        setTodoList(newList)
    }

    return <>

        <Table
            columns={columns}
            dataSource={todoList}
            pagination={false}
            loading={isLoading}
            rowKey="id"
        />

        {/***------------------------------
         /*  Feature
         ***------------------------------*/}
        <Modal title="Update"
               open={isVisible}
               width="640px"
               onOk={() => {
                   featureForm.submit()
               }}
               confirmLoading={isLoading}
               okText="Save"
               onCancel={() => {
                   // formProps.onCancelled();
               }}>

            <Form
                form={featureForm}
                layout="vertical"
                onFinish={updateStatus}
            >

                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>

                <Form.Item
                    style={{marginBottom: 16, marginTop: '16px'}}
                    label="Feature Name"
                    name="name"
                >
                    <Input type={"text"}/>
                </Form.Item>

                <Form.Item
                    style={{marginBottom: 16, marginTop: '16px'}}
                    label="Feature Description"
                    name="description"
                >
                    <TextArea showCount/>
                </Form.Item>

                <Compact>
                    <Form.Item
                        name="start_date"
                        label="Start Date">
                        <DatePicker/>
                    </Form.Item>
                    <Form.Item
                        name="end_date"
                        label="End Date">
                        <DatePicker/>
                    </Form.Item>
                </Compact>


            </Form>
        </Modal>

    </>;

}

export default FeatureProgressComponent
