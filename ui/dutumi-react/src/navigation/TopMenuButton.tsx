import type {MenuProps} from 'antd';
import {Dropdown, Space, Divider, Button} from 'antd';
import React from 'react';
import 'css/home-menu.css'

import userIcon from "assets/images/icons/people/profile-user.png";
import {clearSession, getUser} from "state/auth/authStore";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {AppstoreOutlined, LogoutOutlined, UserOutlined} from "@ant-design/icons";


const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="#">
                Get Help
            </a>
        ),
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="#">
                Profile
            </a>
        ),
        disabled: false
    }
];

const TopMenuButton = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();

    const logout = () => {
        dispatch(clearSession())
        navigate('/login')
    }

    const user: any = getUser();

    return <Dropdown
        menu={{items}}
        dropdownRender={menu => (
            <div className="dropdown-content"
                 style={{
                     minWidth: '240px'
                 }}>
                <div style={{padding: '16px 16px'}}>
                    <span style={{
                        fontSize: '1em',
                        fontWeight: 'bold',
                        color: '#3d348b',
                    }}><AppstoreOutlined/> {user.workspaceName}</span> <br/>

                    <span><UserOutlined style={{ marginRight:'6px'}}/>{user.name}</span>

                </div>
                <Divider style={{margin: 0}}/>
                {menu}
                <Divider style={{margin: 0}}/>
                <Space style={{padding: 8}}>
                    <Button icon={<LogoutOutlined/>} onClick={logout} className="btn-khaki">Logout</Button>
                </Space>
            </div>
        )}>
        <Space>
            <span style={{color: '#3d348b'}}>{user.name}</span>
            <Button type="primary" shape="circle" icon={<img alt="" src={userIcon} width={18}/>}/>
        </Space>
    </Dropdown>;
};

export default TopMenuButton;


