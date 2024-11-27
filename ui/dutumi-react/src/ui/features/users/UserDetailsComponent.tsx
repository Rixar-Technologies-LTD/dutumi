import {
    Button, Card,
    Col,
   Form, Input,
    Modal,
    Row,
    Spin,
} from 'antd';

import '../../../css/business.css';
import React, {useEffect, useState} from 'react';
import {
    KeyOutlined,
    LinkOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    UserOutlined
} from "@ant-design/icons";
import {
    UndoOutlined
} from "@ant-design/icons";
import {notifyHttpError} from "../../../services/notification/notifications";
import {getRequest, postRequest} from "../../../services/http/RestClient";
import customerLoadingIcon from "../../templates/Loading";
import sectionIcon from "../../../assets/images/icons/subscription.png"
import {useNavigate, useParams} from "react-router-dom";
import GoodLabelValueWidget from "../../templates/GoodLabelValueWidget";
import {BsBuilding} from "react-icons/bs";
import GoodContentCardPlain from "../../templates/cards/GoodContentCardPlain";
import {User} from "../../../interfaces/system/AuthInterfaces";
import TextArea from "antd/es/input/TextArea";
import UserActivitiesComponent from "./components/UserActivitiesComponent";


const UserDetailsComponent = () => {

    const {userId} = useParams();

    const [user, setUser] = useState<User>();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [activationModalOpen, setActivationModalOpen] = useState<boolean>(false);
    const [activationForm] = Form.useForm();

    //Fetch products
    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = () => {
        const url = `/api/v1/manage/users/details?id=${userId}`;
        console.log(`fetching user details... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                setUser(response.data.respBody);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const activateUser = (payload:any) => {
        const url = payload.action == 'block'?  `/api/v1/manage/users/block` :  `/api/v1/manage/users/unblock`;
        console.log(`block user... ${url} ${JSON.stringify(payload)}`)
        setIsLoading(true);
        postRequest(url,payload)
            .then((response) => {
                console.log(response.data);
                setActivationModalOpen(false)
                fetchUserDetails();
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const showActivationForm = (action: string) => {
        setActivationModalOpen(true);
        activationForm.setFieldValue('id',userId)
        activationForm.setFieldValue('action',action)
    }

    const isActive = ()=>{
        return user?.status=='ACTIVE';
    }

    const viewBusiness = () => {
        navigate(`/businesses/${user?.businessIdentifier}`);
    }

    return <GoodContentCardPlain title="Business Details"
                             iconImage={sectionIcon}
                             extraHeaderItems={[
                                 isLoading && <Spin key="spin" indicator={customerLoadingIcon}></Spin>,
                                 <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={()=>{
                                     fetchUserDetails();
                                 }} key="2"
                                         type="default">Refresh</Button>,
                                 //  <Button href="/products/instance/new" key="1" type="primary">Add Order</Button>
                             ]}>
        <Row>
            <Col span={8}>
                <Card className="good-shadow"
                      title={<> <UserOutlined style={{marginRight:'12px'}}></UserOutlined> User</>}
                      style={{ marginRight: '18px', backgroundColor: '#f6fff8'}}>
                    <GoodLabelValueWidget label="Name" value={`${user?.firstName} ${user?.lastName}`} />
                    <GoodLabelValueWidget label="Phone" value={user?.phoneNumber} />
                    <GoodLabelValueWidget label="Email" value={user?.email} />
                    <GoodLabelValueWidget label="Created" value={user?.createdDate} />
                    <GoodLabelValueWidget label="Status" value={user?.status} isTag={true} tagColor={`${user?.status=='ACTIVE'?'green':'red'}`} />
                </Card>
            </Col>

            <Col span={8} >
                <Card className="good-shadow"
                      title={<><BsBuilding style={{marginRight:'18px'}}></BsBuilding> Business</>}
                      style={{ marginRight: '12px', backgroundColor: '#ffffff'}}>
                    <GoodLabelValueWidget label="Name" value={user?.business?.name} />
                    <GoodLabelValueWidget label="Email" value={user?.business?.email} />
                    <GoodLabelValueWidget label="Phone" value={user?.business?.phoneNumber} />
                    <GoodLabelValueWidget label="Joined" value={user?.business?.createdDate} />
                    <GoodLabelValueWidget label="Status" value={user?.business?.status} isTag={true} tagColor={`${user?.business?.status=='ACTIVE_LICENCE'?'green':'red'}`} />
                    <Button icon={<LinkOutlined/>} style={{ margin:'0px 0px'}} onClick={viewBusiness} type="link">View Business</Button>
                </Card>
            </Col>

            <Col span={8} >
                <Card className="good-shadow"
                      title={<><KeyOutlined style={{marginRight:'18px'}}/> Auth</>}
                      style={{ marginRight: '12px', backgroundColor: '#ffffff'}}>
                    <GoodLabelValueWidget label="Recovery" value={user?.plainRecoveryToken} />
                    <GoodLabelValueWidget label="Activation" value={user?.plainActivationToken} />
                    <GoodLabelValueWidget label="Last Login" value={user?.lastLoginDate} />
                    { isActive()?
                        <Button icon={<PauseCircleOutlined/>} style={{ margin:'0px 0px', backgroundColor:'#ff595e'}} onClick={()=>{showActivationForm("block")}} type="primary">Deactivate User</Button>:
                        <Button icon={<PlayCircleOutlined/>} style={{ margin:'0px 0px', backgroundColor:'#57cc99'}} onClick={()=>{showActivationForm("activate")}} type="primary">Activate User</Button>
                    }
                </Card>
            </Col>

        </Row>


        {/***------------------------------
         /*  Activities
         ***------------------------------*/}
        <Row style={{ marginTop:'64px'}}>
            <Col span={24}>
                <UserActivitiesComponent user={user}></UserActivitiesComponent>
            </Col>
        </Row>



        <Modal title="Some Form"
               open={activationModalOpen}
               width="640px"
               onOk={() => {
                   activationForm.submit()
               }}
               confirmLoading={isLoading}
               okText="Save"
               onCancel={() => {
                   setActivationModalOpen(false)
               }}>

            <Form
                form={activationForm}
                layout="vertical"
                onFinish={activateUser}
            >

                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>

                <Form.Item
                    style={{}}
                    label="Remark"
                    name="remark"
                    rules={[{required: true}]}
                >
                    <TextArea showCount/>
                </Form.Item>
            </Form>
        </Modal>


    </GoodContentCardPlain>;

}

export default UserDetailsComponent

