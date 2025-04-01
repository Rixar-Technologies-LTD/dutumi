import {Button, Card, Form, Input, Layout, Row, Image, Col, type MenuProps, Flex, Tag} from "antd";
import React, {useState} from "react";
import {Content} from "antd/es/layout/layout";
import {
    AppstoreOutlined, ExportOutlined,
    LockFilled, MailOutlined,
    UserOutlined
} from "@ant-design/icons";
import logo from "assets/images/icons/objects/binoculars.png"
import loginBackground from "assets/images/auth/login_background.jpg"

import {useSelector, useDispatch} from "react-redux";
import {postRequest} from "../../services/http/RestClient";
import {setName, setPermissions, setToken, setWorkspaceName} from "state/auth/authStore";
import {useNavigate} from "react-router-dom";
import {notifyHttpError} from "../../services/notification/notifications";


const RegistrationPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    useSelector((state: any) => state.serverConfig);
    const [isLoading, setIsLoading] = useState(false);

    const attemptLogin = async (formData: any) => {
        setIsLoading(true);
        postRequest("/api/v1/auth/register", formData)
            .then((response) => {
                console.log(JSON.stringify(response.data))
                onLoginSuccessful(response.data.respBody);
            })
            .catch((errorObj) => {
                console.error(JSON.stringify(errorObj));
                notifyHttpError("Registration Failed", errorObj);
                setIsLoading(false);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const onLoginSuccessful = (response: any) => {
        console.log('on-login successful');
        dispatch(setToken(response.accessToken));
        dispatch(setPermissions([...(response.permissions??[]),""]));
        dispatch(setName(response.user?.email));
        dispatch(setWorkspaceName(response.workspace?.name));
        navigate("/");
    };

    const onValidationFailed = (values: any) => {
        console.log(`values ${JSON.stringify(values)}`);
    };

    return (
        <Layout style={{
            minHeight: "100vh",
            background: `url(${loginBackground})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>

            <Content>
                <Row justify="start" align="middle">
                    <Card
                        size="small"
                        style={{
                            width: 540,
                            marginTop: 64,
                            marginLeft: '3em',
                            paddingLeft: 64,
                            paddingRight: 64
                        }}>

                        <Flex justify="center">
                            <div style={{
                                width: '240px',
                                textAlign: 'center',
                                borderRadius: '16px'
                            }}>
                                <Flex justify="center">
                                    <Image preview={false} src={logo} style={{width: 64, marginTop: 10}}/>
                                </Flex>

                            </div>
                        </Flex>


                        <h2 style={{
                            color: '#758bfd',
                            padding: '0px',
                            margin: '0px',
                        }}>Create Workspace</h2>


                        <Form
                            name="basic"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={attemptLogin}
                            layout="vertical"
                            onFinishFailed={onValidationFailed}
                            requiredMark={false}
                            colon={false}
                            autoComplete="off">

                            {/*Full Name*/}
                            <Form.Item
                                label="Your Full Name"
                                name="fullName"
                                style={{marginTop: 8}}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your name",
                                    }
                                ]}>
                                <Input prefix={<UserOutlined/>}/>
                            </Form.Item>

                            {/*Workspace*/}
                            <Form.Item
                                label="Workspace Name"
                                name="workspaceName"
                                style={{marginTop: 8}}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input workspace name",
                                    }
                                ]}>
                                <Input prefix={<AppstoreOutlined/>}/>
                            </Form.Item>


                            {/*Email*/}
                            <Form.Item
                                label="Email"
                                name="email"
                                style={{marginTop: 8}}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your email",
                                    }
                                ]}
                            >
                                <Input prefix={<MailOutlined/>}/>
                            </Form.Item>



                            {/*Password */}
                            <Form.Item
                                label="Create Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your password!",
                                    },
                                ]}
                            >
                                <Input.Password prefix={<LockFilled/>}/>
                            </Form.Item>

                            {/*Login Button */}
                            <Form.Item>
                                <Button size="large" style={{backgroundColor: '#5e548e'}}
                                        loading={isLoading} type="primary" htmlType="submit" block>
                                    Register
                                </Button>
                            </Form.Item>


                            <Button
                                block={true}
                                href="/login"
                                type="default"
                                style={{fontSize: "12px", textAlign: 'center', marginTop: '16px', marginBottom: '48px'}}
                                icon={<ExportOutlined/>}>
                                Login
                            </Button>

                        </Form>
                    </Card>

                    <div style={{position: "absolute", bottom: "32px"}}>
                    </div>
                </Row>
            </Content>
        </Layout>
    );
};

export default RegistrationPage;
