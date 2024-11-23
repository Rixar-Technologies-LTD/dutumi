import {
    Button, DatePicker,
     Form, Input,
    Modal,
    Spin,
} from 'antd';
import React, {useEffect, useState} from 'react';

import {useNavigate, useSearchParams} from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import Compact from "antd/es/space/Compact";
import {getRequest, postRequest} from "../../../../../services/rest/RestService";
import {notifyHttpError, notifySuccess} from "../../../../../services/notification/notifications";
import {isEmpty} from "../../../../../utils/helpers";


interface Props {
    isVisible: boolean;
    projectId: string;
    parentFeatureId?: string | null;
    onSaveCompleted: () => void;
    onCancelled: () => void;

}

const FeatureForm = (featureFormProps:Props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [featureForm] = Form.useForm();

    //Fetch products
    useEffect(() => {
    }, []);

    const fetchFeatures = () => {
        if(isEmpty(featureFormProps.projectId)){
            console.log("no project selected")
            return ;
        }
        const url = `/api/v1/projects/features?projectId=${featureFormProps.projectId}`;
        console.log(`fetching features... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const saveFeature = (item: any) => {

        const url:string = isEmpty(item.id)? '/api/v1/projects/features/add' : `/api/v1/projects/features/update`;
        setIsLoading(true);
        postRequest(url,{
            "project_id" : featureFormProps.projectId,
            ...item
        })
            .then((response) => {
                console.log(response.data.payload);
                notifySuccess("Record Saved")
                featureFormProps.onSaveCompleted();
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
               setIsLoading(false);
         })
    }

    return <>

        {/***------------------------------
         /*  Feature
         ***------------------------------*/}
        <Modal title="Feature"
               open={featureFormProps.isVisible}
               width="640px"
               onOk={() => {
                   featureForm.submit()
               }}
               confirmLoading={isLoading}
               okText="Save"
               onCancel={() => {
                   featureFormProps.onCancelled();
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

