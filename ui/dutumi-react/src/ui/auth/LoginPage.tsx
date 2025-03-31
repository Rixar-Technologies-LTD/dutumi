import {Button, Card, Form, Input, Layout, Row, Image, Col, type MenuProps, Flex, Tag, Space} from "antd";
import React, {useState} from "react";
import {Content} from "antd/es/layout/layout";
import {
    ExportOutlined,
    LockFilled,
    UserOutlined
} from "@ant-design/icons";
import logo from "assets/images/logo-yellow.png"
import loginBackground from "assets/images/auth/login_background.jpg"

import {useSelector, useDispatch} from "react-redux";
import {postRequest} from "services/http/RestClient";
import {setName, setPermissions, setToken, setWorkspaceName} from "state/auth/authStore";
import {useNavigate} from "react-router-dom";
import {notifyHttpError} from "services/notification/notifications";


const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useSelector((state: any) => state.serverConfig);
    const [isLoading, setIsLoading] = useState(false);

    const attemptLogin = async (credentials: any) => {
        setIsLoading(true);
        postRequest("/api/v1/auth/login", credentials)
            .then((response) => {
                console.log(JSON.stringify(response.data))
                onLoginSuccessful(response.data.respBody );
            })
            .catch((errorObj) => {
                console.error(JSON.stringify(errorObj));
                notifyHttpError("Login Failed", errorObj);
                setIsLoading(false);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const onLoginSuccessful = (response: any) => {
        dispatch(setToken(response.accessToken));
        dispatch(setPermissions(response.permissions??[]));
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
                <Row justify="end" align="middle">
                    <Card
                        size="small"
                        style={{
                            width: 540,
                            marginTop: 140,
                            marginRight: 48,
                            paddingLeft: 64,
                            paddingRight: 64
                        }}>


                        <Flex justify="center">
                            <div style={{
                                width: '240px',
                                textAlign: 'center',
                                borderRadius: '16px'
                            }}>
                                <Space align="center">
                                    <Image preview={false} src={logo} style={{width: 64}}/>
                                    <h1 className="merienda-900" style={{
                                        textAlign: 'center',
                                        color: '#5e548e',
                                        padding: '0px 0px',
                                        display: 'inline-block'
                                    }}>Konvex</h1>
                                </Space>

                            </div>
                        </Flex>
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
                            autoComplete="off"
                        >
                            {/*User Name*/}
                            <Form.Item
                                label="Username"
                                name="identifier"
                                style={{marginTop: 32}}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your username!",
                                    },
                                ]}
                            >
                                <Input prefix={<UserOutlined/>}/>
                            </Form.Item>

                            {/*Password */}
                            <Form.Item
                                label="Password"
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
                                    Login
                                </Button>
                            </Form.Item>

                            <Button
                                block={true}
                                href="/register"
                                type="default"
                                style={{fontSize: "12px", textAlign: 'center', marginTop: '16px'}}
                                icon={<ExportOutlined/>}>
                                Create Workplace
                            </Button>


                            <p style={{fontSize: "12px", textAlign: 'center', marginTop: '48px'}}>
                                Powered By <Tag>Rixar Technology</Tag></p>


                        </Form>
                    </Card>

                    <div style={{position: "absolute", bottom: "32px"}}>
                    </div>
                </Row>
            </Content>
        </Layout>
    );
};

export default LoginPage;
