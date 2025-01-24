import {
    Form, Image, Input,
    Modal, Select, Space,
} from 'antd';
import React, {useEffect, useState} from 'react';


import sectionIcon from "assets/images/icons/users/owner.png"
import {getRequest, postRequest} from "../../../../services/http/RestClient";
import {notifyHttpError, notifySuccess} from "services/notification/notifications";
import {Project} from "../../../../types/projects/ProjectsInterfaces";
import {AssetGroup} from "../../../../types/assets/AssetsInterfaces";
import {isNotEmpty} from "utils/helpers";

interface Props {
    isVisible: boolean;
    title: string ;
    oldGroup?: AssetGroup ;
    onSaved: () => void;
    onCancelled: () => void;
}


const AssetGroupForm = (formProps:Props) => {

    const [projectList, setProjectList] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [antdForm] = Form.useForm();

    //Fetch products
    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        setValues();
    }, [formProps]);

    const fetchProjects = () => {
        setIsLoading(true);
        getRequest('/api/v1/projects/list')
            .then((response) => {
                console.log(response.data);
                setProjectList(response.data.respBody.data)
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const addAssetGroup = (antdFormData: any) => {

        const url:string =  isNotEmpty(antdFormData.id)?  '/api/v1/assets/groups/update' : '/api/v1/assets/groups/add';
        setIsLoading(true);
        postRequest(url,{
            ...antdFormData
        })
            .then((response) => {
                console.log(response.data.payload);
                notifySuccess("Record Saved")
                antdForm.resetFields();
                formProps.onSaved();
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
               setIsLoading(false);
         })
    }

    const setValues = ()=>{
        antdForm.setFieldsValue(formProps?.oldGroup??{})
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
                   antdForm.submit()
               }}
               confirmLoading={isLoading}
               okText="Save"
               onCancel={() => {
                   formProps.onCancelled();
               }}>

            <Form
                form={antdForm}
                layout="vertical"
                onFinish={addAssetGroup}
            >

                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>

                <Form.Item
                    style={{ marginTop: '24px'}}
                    label="Project"
                    name="project_id"
                >
                    <Select
                        style={{width: '100%'}}
                        options={projectList.map((project) => ({label: project.name, value: project.id}))}
                    />
                </Form.Item>

                <Form.Item
                    style={{ marginTop: '24px'}}
                    label="Asset Group"
                    name="name"
                >
                    <Input type="text"/>
                </Form.Item>


            </Form>
        </Modal>

    </>;

}

export default AssetGroupForm

