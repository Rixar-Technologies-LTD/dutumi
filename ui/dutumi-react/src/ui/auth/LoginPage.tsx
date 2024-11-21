import {Button, Card, Form, Input, Layout, Row, Image, Col, type MenuProps} from "antd";
import React, {useState} from "react";
import {Content} from "antd/es/layout/layout";
import {
    LockFilled,
    UserOutlined
} from "@ant-design/icons";
import logo from "../../assets/images/logo.png"
import loginBackground from "../../assets/images/auth/login_background.jpg"

import {useSelector, useDispatch} from "react-redux";
import {postRequest} from "../../services/rest/RestService";
import {setName, setPermissions, setToken} from "../../state/auth/authStore";
import {useNavigate} from "react-router-dom";
import {notifyHttpError} from "../../services/notification/notifications";

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
                onLoginSuccessful(
                    response.data.respBody.accessToken,
                    response.data.respBody.permissions??[],
                    response.data.respBody.user?.email);
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

    const onLoginSuccessful = (authToken: any, permissions: string[],name: string) => {
        dispatch(setToken(authToken));
        dispatch(setPermissions(["","REPORTS_DASHBOARD"]));
        dispatch(setName(name));
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
                <Row justify="center" align="middle">
                    <Card
                        size="small"
                        style={{width: 540, marginTop: 140, paddingLeft: 64, paddingRight: 64}}>
                        <Row>
                            <Col className="gutter-row" span={6} offset={8}>
                                <Image preview={false} src={logo} style={{width: 100, marginTop: 10}}/>
                            </Col>
                        </Row>

                        <div style={{ width:'100%', textAlign:'center'}}>
                            <h1 style={{
                                textAlign: 'center',
                                color: '#5e548e',
                                backgroundColor: '#ffd465',
                                border: '2px solid #ffd465',
                                marginLeft:'auto',
                                padding:'0px 32px',
                                borderRadius: '8px',
                                marginRight:'auto',
                                display: 'inline-block'
                            }}>Dutumi</h1>
                        </div>
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
                                <Button style={{ backgroundColor:'#5e548e' }}
                                        loading={isLoading} type="primary" htmlType="submit" block>
                                    Login
                                </Button>
                            </Form.Item>

                        </Form>
                    </Card>

                    <div style={{position: "absolute", bottom: "32px"}}>
                        {/*<p style={{ fontSize: "9px" }}>Powered By MobiAd Africa</p>*/}
                    </div>
                </Row>
            </Content>
        </Layout>
    );
};

export default LoginPage;
