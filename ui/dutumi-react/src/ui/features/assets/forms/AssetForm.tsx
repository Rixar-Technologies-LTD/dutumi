import {
    DatePicker, Flex,
    Form, Image, Input,
    Modal, Select, Space,
} from 'antd';
import React, {useEffect, useState} from 'react';

import sectionIcon from "assets/images/icons/objects/objects.png"
import {getRequest, postRequest} from "../../../../services/http/RestClient";
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
               width="840px"
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
                                {'value':'DIGITAL','label':'Digital Asset'},
                                {'value':'PHYSICAL','label':'Physical Asset'}
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
                                {'value':'APPLICATION_SERVER','label':'Application Server'},
                                {'value':'WEBSITE_SERVER','label':'Website Server'},
                                {'value':'DATABASE_SERVER','label':'Database Server'},
                                {'value':'FILE_SERVER','label':'File Server'},
                                {'value':'GENERIC_SERVER','label':'Generic Server'},
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
                        label="Location"
                        name="location"
                    >
                        <Input type="text"/>
                    </Form.Item>

                </Space.Compact>


                <Space.Compact style={{width:'100%'}}>

                    <Form.Item
                        style={{ width: '50%' }}
                        label="Rent Price/Purchase Cost"
                        name="unit_price"
                    >
                        <Input type="number"/>
                    </Form.Item>

                    <Form.Item
                        style={{ width: '50%'}}
                        label="Payment Currency"
                        name="price_currency"
                    >
                        <Select
                            style={{minWidth: '180px'}}
                            options={[
                                {'value':'USD','label':'USD'},
                                {'value':'EURO','label':'EURO'},
                                {'value':'GBP','label':'GBP'},
                                {'value':'TZS','label':'TZS'}
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        style={{ width: '50%'}}
                        label="TZS Equivalent"
                        name="unit_price_in_default_currency"
                    >
                        <Input type="number"/>
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
                    label="Service Provider/Vendor"
                    name="vendor"
                >
                    <Input type="text"/>
                </Form.Item>

                <Form.Item
                    label="Control Panel URL"
                    name="url"
                >
                    <Input type="text"/>
                </Form.Item>


                <Form.Item
                    style={{ marginTop: '8px'}}
                    label="Asset Description"
                    name="description"
                >
                    <TextArea rows={6} />
                </Form.Item>

                <h2>Server Information</h2>

                <Space.Compact style={{width:'100%'}}>
                    <Form.Item
                        style={{ width: '30%'}}
                        label="IP Address"
                        name="ip_address"
                    >
                        <Input type="text"/>
                    </Form.Item>

                    <Form.Item
                        style={{ width: '35%'}}
                        label="Mac Address"
                        name="mac_address"
                    >
                        <Input type="text"/>
                    </Form.Item>

                    <Form.Item
                        style={{ width: '35%'}}
                        label="Host Name"
                        name="host_name"
                    >
                        <Input type="text"/>
                    </Form.Item>
                </Space.Compact>


                <Space.Compact style={{width:'100%'}} >
                    <Form.Item
                        style={{ width: '30%'}}
                        label="Operating System"
                        name="operating_system"
                    >
                        <Input type="text"/>
                    </Form.Item>

                    <Form.Item
                        style={{ width: '35%'}}
                        label="Processor Cores"
                        name="processor_cores_count"
                    >
                        <Input type="number"/>
                    </Form.Item>

                    <Form.Item
                        style={{ width: '35%'}}
                        label="Processor Type"
                        name="processor_type"
                    >
                        <Input type="text"/>
                    </Form.Item>

                </Space.Compact>



                <Space.Compact style={{width:'100%'}}>

                    <Form.Item
                        style={{ width: '25%'}}
                        label="Memory Size (GBs)"
                        name="memory_size"
                    >
                        <Input type="number"/>
                    </Form.Item>

                    <Form.Item
                        style={{ width: '25%'}}
                        label="Memory Type"
                        name="memory_type"
                    >
                        <Select
                            style={{minWidth: '164px'}}
                            options={[
                                {'value':'DDR2','label':'DDR2'},
                                {'value':'DDR3','label':'DDR3'},
                                {'value':'DDR4','label':'DDR4'},
                                {'value':'OTHER','label':'Other'}
                            ]}
                        />
                    </Form.Item>


                    <Form.Item
                        style={{ width: '25%'}}
                        label="Storage Size (GBs)"
                        name="storage_size"
                    >
                        <Input type="number"/>
                    </Form.Item>

                    <Form.Item
                        style={{ width: '25%'}}
                        label="Storage Type"
                        name="storage_type"
                    >
                        <Select
                            style={{minWidth: '164px'}}
                            options={[
                                {'value':'SSD','label':'SSD'},
                                {'value':'NVM','label':'NVM'},
                                {'value':'NVMe','label':'NVMe'},
                                {'value':'HDD','label':'HDD'},
                                {'value':'OTHER','label':'OTHER'},
                            ]}
                        />
                    </Form.Item>
                </Space.Compact>



            </Form>
        </Modal>

    </>;

}

export default AssetForm

