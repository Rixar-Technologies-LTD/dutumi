import {
    Form, Image, Input,
    Modal, Select, Space,
} from 'antd';
import React, {useEffect, useState} from 'react';

import sectionIcon from "assets/images/icons/people/profile-2.png"
import {notifyHttpError, notifySuccess} from "services/notification/notifications";
import {isEmpty, isNotEmpty} from "utils/helpers";

import {CheckCircleOutlined, ClockCircleOutlined} from "@ant-design/icons";
import {postRequest} from "services/http/RestClient";
import GoodVisibility from "components/GoodVisibility";
import Password from "antd/es/input/Password";
import {User} from "types/system/AuthInterfaces";

interface Props {
    isVisible: boolean;
    title: string;
    oldRecord?: User | null;
    onSaved: () => void;
    onClose: () => void;
}

const PasswordResetForm = (formProps: Props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [antdForm] = Form.useForm();

    //Fetch products
    useEffect(() => {

    }, []);

    useEffect(() => {
        setValues();
    }, [formProps]);

    const save = (antdFormData: any) => {
        const url: string = '/api/v1/admin/users/password/reset';
        setIsLoading(true);
        postRequest(url, {
            ...antdFormData
        })
            .then((response) => {
                notifySuccess(response.message, response.data.message)
                antdForm.resetFields();
                formProps.onSaved();
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const setValues = () => {
        antdForm.setFieldsValue(formProps?.oldRecord ?? {});
    }

    const modalTitle = (
        <Space>
            <div className="bg-light" style={{padding: '4px', borderRadius: '4px', border: '1px solid #8a8a8a'}}>
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
               width="540px"
               onOk={() => {
                   antdForm.submit()
               }}
               confirmLoading={isLoading}
               okText="Save"
               onCancel={() => {
                   formProps.onClose();
               }}>

            <Form
                style={{padding: '12px 24px', borderRadius: '12px'}}
                form={antdForm}
                layout="vertical"
                onFinish={save}>

                <div style={{marginTop: '32px'}}/>

                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>


                <Form.Item
                    style={{width: '100%'}}
                    label="New Password"
                    name="newPassword">
                    <Password size="large" type="text"/>
                </Form.Item>

            </Form>
        </Modal>

    </>;

}

export default PasswordResetForm

