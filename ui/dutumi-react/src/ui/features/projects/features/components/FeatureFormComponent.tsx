import {
    DatePicker,
    Form, Image, Input,
    Modal, Space,
} from 'antd';
import React, {useEffect, useState} from 'react';

import TextArea from "antd/es/input/TextArea";
import Compact from "antd/es/space/Compact";
import {getRequest, postRequest} from "../../../../../services/rest/RestService";
import {notifyHttpError, notifySuccess} from "../../../../../services/notification/notifications";
import {isEmpty} from "../../../../../utils/helpers";

import sectionIcon from "../../../../../assets/images/pages/feature.png"


interface Props {
    isVisible: boolean;
    projectId: string;
    title: string ;
    parentFeatureId?: string | null;
    onSaveCompleted: () => void;
    onCancelled: () => void;

}


const FeatureForm = (formProps:Props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [featureForm] = Form.useForm();

    //Fetch products
    useEffect(() => {
    }, []);


    const saveFeature = (item: any) => {

        const url:string = isEmpty(item.id)? '/api/v1/projects/features/add' : `/api/v1/projects/features/update`;
        setIsLoading(true);
        postRequest(url,{
            "parent_id" : formProps.parentFeatureId,
            "project_id" : formProps.projectId,
            ...item
        })
            .then((response) => {
                console.log(response.data.payload);
                featureForm.resetFields();
                notifySuccess("Record Saved")
                formProps.onSaveCompleted();
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
                onFinish={saveFeature}
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

export default FeatureForm

