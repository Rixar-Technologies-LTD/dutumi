import {
    ContainerOutlined,
    DesktopOutlined,
    SettingOutlined,
    LogoutOutlined,
    UsergroupAddOutlined,
    MessageOutlined,
    FileSyncOutlined, UserOutlined, ClockCircleOutlined, MailOutlined, AndroidFilled, AndroidOutlined, PhoneOutlined
} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import React from 'react';
import {useNavigate} from "react-router-dom";
import {CiBullhorn} from "react-icons/ci";
import {BiFootball} from "react-icons/bi";
import {FaBroadcastTower} from "react-icons/fa";
import {getUserPermissions} from "../../state/auth/authStore";
import {containsAny, isEmpty} from "../../utils/helpers";

type MenuItem = Required<MenuProps>['items'][number];

function toMenuItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[], type?: 'group'): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}


interface Props {
    isInlineCollapsed: boolean;
}

const MenuItems: React.FC<Props> = ({isInlineCollapsed}) => {

    const navigate = useNavigate();

    const onMenuItemClick = (event: { item: any, key: any, keyPath: any, domEvent: any }) => {
        const uri = event.key;
        console.log('~Selected navigation uri ', uri);
        navigate(uri)
    }

    const permissions: string[] = getUserPermissions();

    const mainMenuItems: MenuProps['items'] = [];

    mainMenuItems.push(toMenuItem('Home', '/', <DesktopOutlined/>));


    // -------------------
    // Finance Menus
    // -------------------
    const financeMenus : MenuProps['items'] = [];


    if(permissions.includes("")){
        financeMenus.push(toMenuItem('Businesses', '/businesses', <UsergroupAddOutlined/>))
    }

    if(permissions.includes("")){
        financeMenus.push(toMenuItem('Payments', '/transactions', <ContainerOutlined/>))
    }

    if(permissions.includes("")){
        financeMenus.push(toMenuItem('Referrals', '/agents', <CiBullhorn/>));
    }


    if(containsAny(permissions,["",'',''])){
        mainMenuItems.push(...[
            toMenuItem('Finance', 'finance/index', <FileSyncOutlined/>, financeMenus),
        ]);
    }


    /// ---------
    // Operations menu
    ///------------
    const operationsMenus : MenuProps['items'] = [];
    if(permissions.includes("")){
        operationsMenus.push(toMenuItem('SMS Delivery', '/operations/sms', <MessageOutlined/>));
    }
    if(permissions.includes("")){
        operationsMenus.push(toMenuItem('Email Delivery', '/operations/emails', <MailOutlined/>));
    }
    if(containsAny(permissions,["",'',''])){
        mainMenuItems.push(...[
            toMenuItem('Operations', 'operations', <DesktopOutlined/>, operationsMenus),
        ]);
    }

    // -------------------
    // Users
    // -------------------
    const messagesMenus : MenuProps['items'] = [];
    if(permissions.includes("")){
        messagesMenus.push(toMenuItem('Users', '/users', <UserOutlined/>))
    }

    if(permissions.includes("")){
        messagesMenus.push(toMenuItem('Activities', '/activities', <ClockCircleOutlined/>))
    }


    if(permissions.includes("")){
        mainMenuItems.push(...[
            toMenuItem('Users & Access', 'users/index', <UserOutlined/>, messagesMenus),
        ]);
    }

    // -----------------------
    // [End] Messages Menus


    //---------------
    // Admin Menus
    const configurationsSubMenus : MenuProps['items'] = [];
    if(permissions.includes("")){
        configurationsSubMenus.push(toMenuItem('System Users', '/rixar/users', <UsergroupAddOutlined/>));
    }

    if(permissions.includes("CONFIG_NOTIFICATIONS_VIEW")){
        configurationsSubMenus.push(toMenuItem('Notifications', '/notifications', <MessageOutlined/>));
    }

    if(permissions.includes("CONFIG_SMS_GATEWAYS_VIEW")){
        configurationsSubMenus.push( toMenuItem('SMS Gateways', '/sms/gateways', <FaBroadcastTower/>));
    }

    if(permissions.includes("")){
        configurationsSubMenus.push( toMenuItem('App Versions', '/apps/versions', <AndroidOutlined/>));
    }

    mainMenuItems.push(...[
        toMenuItem('Configurations', 'setting/index', <SettingOutlined/>, configurationsSubMenus),
    ]);






    mainMenuItems.push(toMenuItem('Logout', '/logout', <LogoutOutlined/>))





    return (
            <Menu
                onClick={onMenuItemClick}
                // style={{height: '100%'}}
                defaultSelectedKeys={['/']}
                theme="light"
                mode="inline"
                items={mainMenuItems}
            />
    );
};

export default MenuItems;
