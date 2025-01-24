import {
    Form, Image, Input,
    Modal, Select, Space,
} from 'antd';
import React, {useEffect, useState} from 'react';


import sectionIcon from "../../../../assets/images/icons/users/owner.png"
import {getRequest, postRequest} from "../../../../services/http/RestClient";
import {notifyHttpError, notifySuccess} from "../../../../services/notification/notifications";
import {SystemUser} from "../../../../types/system/AuthInterfaces";
import {Member} from "../../../../types/projects/ProjectsInterfaces";


interface Props {
    isVisible: boolean;
    projectId: string;
    title: string ;
    onSaved: () => void;
    onCancelled: () => void;

}


const MemberAssignmentForm = (formProps:Props) => {

    const [systemUserList, setSystemUserList] = useState<SystemUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [featureForm] = Form.useForm();

    //Fetch products
    useEffect(() => {
        fetchAssignableUsers();
    }, []);

    const fetchAssignableUsers = () => {
        const url = `/api/v1/projects/users/assignable?projectId=${formProps.projectId}`;
        console.log(`fetching members... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                setSystemUserList(response.data.respBody.data)
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const addProjectMember = (item: any) => {

        const url:string ='/api/v1/projects/members/add';
        setIsLoading(true);
        postRequest(url,{
            "project_id" : formProps.projectId,
            ...item
        })
            .then((response) => {
                console.log(response.data.payload);
                notifySuccess("Record Saved")
                featureForm.resetFields();
                formProps.onSaved();
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
               setIsLoading(false);
         })
    }

    const modalTitle = (
        <Space>
            <div className="bg-light" style={{padding:'4px',borderRadius:'4px', border:'1px solid #8a8a8a'}}>
                <Image width={28} src={sectionIcon}></Image>
            </div>
            {formProps.title}
        </Space>
    );

    return <>

        {/***------------------------------
         /*  Feature
         ***------------------------------*/}
        <Modal title={modalTitle}
               open={formProps.isVisible}
               width="640px"
               onOk={() => {
                   featureForm.submit()
               }}
               confirmLoading={isLoading}
               okText="Save"
               onCancel={() => {
                   formProps.onCancelled();
               }}>

            <Form
                form={featureForm}
                layout="vertical"
                onFinish={addProjectMember}
            >

                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>

                <Form.Item
                    style={{ marginTop: '24px'}}
                    label="User"
                    name="user_id"
                >
                    <Select
                        style={{width: '100%'}}
                        options={systemUserList.map((user) => ({label: user.name, value: user.id}))}
                    />
                </Form.Item>


            </Form>
        </Modal>

    </>;

}

export default MemberAssignmentForm

