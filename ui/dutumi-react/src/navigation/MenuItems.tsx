import {
    ContainerOutlined,
    DesktopOutlined,
    SettingOutlined,
    LogoutOutlined,
    UsergroupAddOutlined,
    MessageOutlined,
    UserOutlined,
    ClockCircleOutlined,
    AndroidOutlined,
    FolderOutlined,
    DatabaseOutlined,
    PoundCircleOutlined
} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import React from 'react';
import {useNavigate} from "react-router-dom";
import {CiBullhorn} from "react-icons/ci";
import {FaBroadcastTower} from "react-icons/fa";
import {getUserPermissions} from "state/auth/authStore";
import {containsAny} from "utils/helpers";

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


    /// ---------
    // Projects
    ///------------
    const operationsMenus : MenuProps['items'] = [];
    if(permissions.includes("")){
        operationsMenus.push(toMenuItem('Projects', '/projects', <FolderOutlined/>));
    }
    if(permissions.includes("")){
        operationsMenus.push(toMenuItem('Releases', '/projects/releases', <MessageOutlined/>));
    }
    if(permissions.includes("")){
        operationsMenus.push(toMenuItem('Issues', '/projects/issues', <MessageOutlined/>));
    }
    if(containsAny(permissions,["",'',''])){
        mainMenuItems.push(...[
            toMenuItem('Projects', 'operations', <FolderOutlined/>, operationsMenus),
        ]);
    }


    // -------------------
    // Finance Menus
    // -------------------
    const financeMenus : MenuProps['items'] = [];

    if(permissions.includes("")){
        financeMenus.push(toMenuItem('Transactions', '/finance/transactions', <CiBullhorn/>));
    }

    if(permissions.includes("")){
        financeMenus.push(toMenuItem('Bills', '/finance/assets/bills', <ContainerOutlined/>))
    }

    if(permissions.includes("")){
        financeMenus.push(toMenuItem('Payroll', '/finance/payroll', <CiBullhorn/>));
    }

    if(containsAny(permissions,["",'',''])){
        mainMenuItems.push(...[
            toMenuItem('Finance', 'finance/index', <PoundCircleOutlined/>, financeMenus),
        ]);
    }

    // -------------------
    // Assets Menus
    // -------------------
    const assetsMenus : MenuProps['items'] = [];

    if(permissions.includes("")){
        assetsMenus.push(toMenuItem('Assets List', '/assets', <DatabaseOutlined/>))
        assetsMenus.push(toMenuItem('Assets Groups', '/assets/groups', <DatabaseOutlined/>))
    }

    if(containsAny(permissions,["",'',''])){
        mainMenuItems.push(...[
            toMenuItem('Assets', 'finance/assets', <DatabaseOutlined/>, assetsMenus),
        ]);
    }


    //---------------
    // Admin Menus
    const configurationsSubMenus : MenuProps['items'] = [];
    if(permissions.includes("")){
        configurationsSubMenus.push(toMenuItem('Manage Users', '/configs/users', <UsergroupAddOutlined/>));
    }


    mainMenuItems.push(...[
        toMenuItem('Configurations', 'setting/index', <SettingOutlined/>, configurationsSubMenus),
    ]);



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
