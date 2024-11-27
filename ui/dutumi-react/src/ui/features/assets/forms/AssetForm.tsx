import {
    DatePicker, Flex,
    Form, Image, Input,
    Modal, Select, Space,
} from 'antd';
import React, {useEffect, useState} from 'react';

import sectionIcon from "assets/images/icons/objects/objects.png"
import {getRequest, postRequest} from "../../../../services/http/RestService";
import {notifyHttpError, notifySuccess} from "services/notification/notifications";
import {Project} from "interfaces/projects/ProjectsInterfaces";
import TextArea from "antd/es/input/TextArea";
import {Asset} from "interfaces/assets/AssetsInterfaces";
import dayjs from "dayjs";
import {isNotEmpty} from "utils/helpers";

interface Props {
    isVisible: boolean;
    title: string ;
    groupId: string ;
    oldAsset?: Asset ;
    onSaved: () => void;
    onCancelled: () => void;
}


const AssetForm = (formProps:Props) => {

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

    const saveAsset = (antdFormData: any) => {

        const url:string = isNotEmpty(antdFormData.id) ? '/api/v1/assets/update':  '/api/v1/assets/add';
        setIsLoading(true);
        postRequest(url,{
             "asset_group_id": formProps.groupId,
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

    const setValues = () => {
        antdForm.setFieldsValue(formProps?.oldAsset??{});
        if(isNotEmpty(formProps?.oldAsset?.next_payment_date??'')){
            antdForm.setFieldValue('next_payment_date',dayjs(formProps?.oldAsset?.next_payment_date??'', 'DD-MM-YYYY'));
        }
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
                style={{ backgroundColor:'#f1f3ff', padding:'12px 24px', borderRadius:'12px'}}
                form={antdForm}
                layout="vertical"
                onFinish={saveAsset}
            >

                <div style={{marginTop:'32px'}}/>

                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>

                <Space.Compact style={{ width:'100%'}}>

                    <Form.Item
                        style={{ width: '33%' }}
                        label="Ownership"
                        name="ownership"
                    >
                        <Select
                            style={{minWidth: '180px'}}
                            options={[
                                {'value':'OWNED','label':'Owned'},
                                {'value':'RENTED','label':'Rented'}
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        style={{ width: '35%' }}
                        label="Asset Type"
                        name="type"
                    >
                        <Select
                            style={{minWidth: '180px'}}
                            options={[
                                {'value':'PHYSICAL','label':'Physical Asset'},
                                {'value':'DIGITAL','label':'Digital Asset'}
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        style={{ width: '35%' }}
                        label="Asset Category"
                        name="category"
                    >
                        <Select
                            style={{minWidth: '180px'}}
                            options={[
                                {'value':'CLOUD_SERVER','label':'Cloud Server'},
                                {'value':'PHYSICAL_SERVER','label':'Physical Server'},
                                {'value':'IP','label':'IP'},
                                {'value':'SMARTPHONE','label':'Smartphone'},
                                {'value':'LAPTOP','label':'Laptop'},
                                {'value':'OTHER','label':'Other'},
                            ]}
                        />
                    </Form.Item>
                </Space.Compact>

                <Space.Compact  style={{ width:'100%'}}>
                    <Form.Item
                        style={{ width: '50%' }}
                        label="Asset Name"
                        name="name"
                    >
                        <Input type="text"/>
                    </Form.Item>
                    <Form.Item
                        style={{ width: '50%' }}
                        label="Rent Price/Purchase Cost"
                        name="unit_price"
                    >
                        <Input type="text"/>
                    </Form.Item>
                </Space.Compact>

                <Space.Compact  style={{ width: '100%' }}>
                    <Form.Item
                        style={{ width: '50%' }}
                        label="Usage Status"
                        name="usage_status"
                    >
                        <Select
                            style={{minWidth: '164px'}}
                            options={[
                                {'value':'IN_USE','label':'In Use'},
                                {'value':'FREE','label':'Free'},
                            ]}
                        />
                    </Form.Item>


                    <Form.Item
                        style={{ width: '50%' }}
                        label="Next Payment (For Rentals)"
                        name="next_payment_date"
                    >
                        <DatePicker style={{width: '100%'}} />
                    </Form.Item>
                </Space.Compact>

                <Form.Item
                    style={{ marginTop: '8px'}}
                    label="Asset Description"
                    name="description"
                >
                    <TextArea/>
                </Form.Item>


                <Form.Item
                    label="Service Provider/Vendor"
                    name="vendor"
                >
                    <Input type="text"/>
                </Form.Item>

                <Form.Item
                    label="URL"
                    name="url"
                >
                    <Input type="text"/>
                </Form.Item>



            </Form>
        </Modal>

    </>;

}

export default AssetForm
