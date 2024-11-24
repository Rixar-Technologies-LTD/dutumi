import {
    DatePicker,
    Form, Image, Input,
    Modal, Select, Space,
} from 'antd';
import React, {useEffect, useState} from 'react';

import TextArea from "antd/es/input/TextArea";
import Compact from "antd/es/space/Compact";
import {getRequest, postRequest} from "../../../../../services/rest/RestService";
import {notifyHttpError, notifySuccess} from "../../../../../services/notification/notifications";
import {isEmpty} from "../../../../../utils/helpers";

import sectionIcon from "../../../../../assets/images/pages/feature.png"
import {Member, Task} from "../../../../../interfaces/projects/ProjectsInterfaces";
import dayjs from "dayjs";


interface Props {
    title: string ;
    isVisible: boolean;
    editMode?: boolean | null;
    projectId: string;
    selectedFeature?: Task | null;
    parentFeatureId?: string | null;
    onSaveCompleted: () => void;
    onCancelled: () => void;
}

const FeatureForm = ({   isVisible,
                         editMode=false,
                         title,
                         projectId,
                         selectedFeature,
                         parentFeatureId,
                         onSaveCompleted,
                         onCancelled
                         }:Props) => {

    const [membersList, setMembersList] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [featureForm] = Form.useForm();


    useEffect(() => {
        fetchProjectMembers();
    }, []);

    //Fetch products
    useEffect(() => {
        if(editMode){
            setInitialValues();
        }
    }, [isVisible]);

    const fetchProjectMembers = () => {
        if(isEmpty(projectId)){
            console.log("empty project id. not fetching project members")
            return ;
        }
        const url = `/api/v1/projects/members?projectId=${projectId}`;
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


    const setInitialValues = ()=>{
        featureForm.setFieldValue('id',selectedFeature?.id);
        featureForm.setFieldValue('name',selectedFeature?.name);
        featureForm.setFieldValue('description',selectedFeature?.description);
        featureForm.setFieldValue('start_date',dayjs(selectedFeature?.start_date, 'DD-MM-YYYY'));
        featureForm.setFieldValue('end_date',dayjs(selectedFeature?.end_date, 'DD-MM-YYYY'));
    }

    const saveFeature = (item: any) => {

        console.log(`selectedFeature?.id ${selectedFeature?.id}`)

        const url:string = editMode? `/api/v1/projects/features/update` : '/api/v1/projects/features/add';
        setIsLoading(true);
        postRequest(url,{
            "parent_id" : parentFeatureId,
            "project_id" : projectId,
            ...item
        })
            .then((response) => {
                console.log(response.data.payload);
                featureForm.resetFields();
                notifySuccess("Record Saved")
                onSaveCompleted();
                featureForm.resetFields();
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
            {title}
        </Space>
    );


    return <>

        {/***------------------------------
         /*  Feature
         ***------------------------------*/}
        <Modal title={modalTitle}
               open={isVisible}
               width="640px"
               onOk={() => {
                   featureForm.submit()
               }}
               confirmLoading={isLoading}
               okText="Save"
               onCancel={() => {
                   onCancelled();
               }}>

            <Form
                form={featureForm}
                layout="vertical"
                onFinish={saveFeature}
            >

                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>

                <p>{selectedFeature?.id}</p>

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

                <Form.Item
                    style={{ marginTop: '24px'}}
                    label="Champion/Lead/Coordinator"
                    name="champion_id"
                >
                    <Select
                        style={{width: '100%'}}
                        options={membersList.map((member) => ({label: member.user?.name, value: member.user.id}))}
                    />
                </Form.Item>

                <Compact   style={{marginTop:'16px'}}>
                    <Form.Item
                        name="start_date"
                        label="Start Date">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        name="end_date"
                        label="Completion Date">
                        <DatePicker/>
                    </Form.Item>
                </Compact>


            </Form>
        </Modal>

    </>;

}

export default FeatureForm

