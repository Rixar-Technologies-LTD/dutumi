import React, {useState} from "react";
import Sider from "antd/es/layout/Sider";
import MenuItems from "navigation/MenuItems";
import {Button, Col, Image, Row} from "antd";
import {CompressOutlined} from "@ant-design/icons";
import logo from "assets/images/logo-yellow.png"

const LeftSideMenu = () => {

    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (<Sider theme="light"
                   className="site-layout-background"
                   collapsed={collapsed}
                   width={280}
                   style={{
                       overflow: 'auto',
                       height: '100vh',
                       position: 'fixed',
                       left: 0,
                       top: 0,
                       bottom: 0,
                   }}>

            {/*Text Logo*/}
            <div style={{
                backgroundColor: "#5e548e",
                paddingTop: '12px',
                paddingBottom: '12px'
            }}>
                <Row >
                    <Col className="gutter-row" span={1} offset={1}>
                        <Image preview={false} src={logo} style={{ width: 80, marginTop: 4 }} />
                    </Col>
                </Row>
                <Row style={{ }}  >
                    <Col>
                        {!collapsed &&
                            <h2  className="merienda-900" style={{
                                paddingLeft: '12px',
                                color: 'white',
                                margin: "0px" }}>
                                Konvex
                            </h2>}
                    </Col>

                    <Col span={6} offset={6}></Col>
                </Row>
            </div>


            {/*{isLoadingFolders ? <Spin indicator={LoadingOutlined}/> : <p></p>}*/}

            {/*Side Menu With Items*/}
            <MenuItems isInlineCollapsed={collapsed}/>


        </Sider>
    )
}

export default LeftSideMenu;
