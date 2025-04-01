import {
    Form, Image, Input,
    Modal, Select, Space,
} from 'antd';
import React, {useEffect, useState} from 'react';

import { postRequest} from "../../../../services/http/RestClient";
import {notifyHttpError, notifySuccess} from "../../../../services/notification/notifications";

import sectionIcon from "assets/images/icons/generic/note.png"
import TextArea from "antd/es/input/TextArea";


interface Props {
    isVisible: boolean;
    title: string ;
    featureId: string;
    onSaveCompleted: () => void;
    onCancelled: () => void;
}


const ActivityFormComponent = (formProps:Props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [featureForm] = Form.useForm();

    const postUpdate = (formData: any) => {

        const url:string ='/api/v1/projects/features/activities/post';
        setIsLoading(true);
        postRequest(url,{
            "task_id" : formProps.featureId,
            ...formData
        })
            .then((response) => {
                console.log(response.data.payload);
                notifySuccess("Record Saved")
                featureForm.resetFields();
                formProps.onSaveCompleted();
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
               setIsLoading(false);
         })
    }

    const modalTitle = (
        <Space>
            <Image width={32} src={sectionIcon}></Image>
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
                onFinish={postUpdate}
            >

                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>

                <Form.Item
                    style={{marginBottom: 48, marginTop: '16px'}}
                    label="Message"
                    name="message"
                >
                    <TextArea showCount maxLength={512}/>
                </Form.Item>

            </Form>
        </Modal>

    </>;

}

export default ActivityFormComponent

