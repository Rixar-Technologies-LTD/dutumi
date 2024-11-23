import {Button, Layout, Space} from 'antd';
import {Route, Routes} from "react-router-dom";

import React from "react";

import '../css/custom.css';
import LeftSideMenu from "./navigation/LeftSideMenu";
import SystemUsersComponent from "./system/users/SystemUsersComponent";
import RolesComponent from "./system/users/RolesComponent";
import DashboardInsightsPage from "./reports/DashboardInsightsPage";

import RequireAuth from "../services/auth/RequireAuth";
import TransactionsListComponent from "./features/finance/TransactionsListComponent";
import UsersManagementComponent from "./features/users/UsersManagementComponent";
import AgentsListComponent from "./features/management/agents/AgentsListComponent";
import NotificationTemplatesComponent from "./features/management/notications/NotificationTemplatesComponent";
import SmsGatewayManagementComponent from "./features/management/sms_gateways/SmsGatewayManagementComponent";
import CommissionsListComponent from "./features/commissions/CommissionsListComponent";
import {Header} from "antd/es/layout/layout";
import {getUserName} from "../state/auth/authStore";
import {LogoutOutlined, UserOutlined} from "@ant-design/icons";
import {forceLogout} from "../services/auth/SessionHandler";
import BusinessesListComponent from "./features/businesses/BusinessesListComponent";
import BusinessesDetailsComponent from "./features/businesses/BusinessesDetailsComponent";
import UserDetailsComponent from "./features/users/UserDetailsComponent";
import SmsHistoryComponent from "./features/operations/SmsHistoryComponent";
import AppVersionsComponent from "./features/management/apps/AppVersionsComponent";
import EmailHistoryComponent from "./features/operations/EmailHistoryComponent";
import BusinessProductsPage from "./features/businesses/pages/BusinessProductsPage";
import BusinessOrdersPage from "./features/businesses/pages/BusinessOrdersPage";
import ProjectsListComponent from "./features/projects/ProjectsListComponent";
import ProjectDetailsComponent from "./features/projects/ProjectDetailsComponent";
import FeaturesListComponent from "./features/projects/features/ProjectFeaturesListComponent";
import FeatureDetailsComponent from "./features/projects/features/FeatureDeatailsComponent";

const {Content} = Layout;

function MainLayout() {


    const username = getUserName();

    return (
        <Layout style={{minHeight: '100vh'}}>

            <LeftSideMenu></LeftSideMenu>

            <Layout className="site-layout" style={{marginLeft: 280}}>
                <Header style={{  background: '#f1f1f1', borderBottom:'1px solid #a3d1ee',display:'flex' , justifyContent: 'flex-end' }} >
                         <Space align="end" >
                             <UserOutlined/>
                              <span>{username}</span>
                             <Button onClick={forceLogout} icon={<LogoutOutlined/>} type="default">Logout</Button>
                         </Space>
                </Header>

                <Content style={{minHeight: '100vh', padding: '0 0'}}>

                    <Routes>
                        {/*<Route index element={<RolesComponent/>}/>*/}

                        <Route path="projects">
                            <Route index element={<RequireAuth><ProjectsListComponent/></RequireAuth>}/>
                            <Route path=":projectId" element={<ProjectDetailsComponent/>}/>
                            <Route path="features/details" element={<FeatureDetailsComponent/>}/>
                            <Route path="releases" element={<BusinessesListComponent/>}/>
                            <Route path="issues" element={<BusinessesListComponent/>}/>
                        </Route>

                        <Route path="businesses">
                            <Route index element={<RequireAuth><BusinessesListComponent/></RequireAuth>}/>
                            <Route path=":businessId" element={<BusinessesDetailsComponent/>}/>
                            <Route path="products/:businessId" element={<BusinessProductsPage/>}/>
                            <Route path="orders/:businessId" element={<BusinessOrdersPage/>}/>
                        </Route>

                        <Route path="transactions" >
                            <Route index element={<RequireAuth><TransactionsListComponent/></RequireAuth>} />
                        </Route>

                        <Route path="operations/sms" >
                            <Route index element={<RequireAuth><SmsHistoryComponent/></RequireAuth>} />
                        </Route>
                        <Route path="operations/emails" >
                            <Route index element={<RequireAuth><EmailHistoryComponent/></RequireAuth>} />
                        </Route>



                        <Route path="users">
                            <Route index element={<RequireAuth><UsersManagementComponent/></RequireAuth>}/>
                            <Route path=":userId" element={<RequireAuth><UserDetailsComponent/></RequireAuth>}/>
                        </Route>


                        <Route path="agents">
                            <Route index element={<RequireAuth><AgentsListComponent/></RequireAuth>}/>
                        </Route>

                        <Route path="commissions">
                            <Route index element={<RequireAuth><CommissionsListComponent/></RequireAuth>}/>
                        </Route>

                        <Route path="apps/versions">
                            <Route index element={<RequireAuth><AppVersionsComponent/></RequireAuth>}/>
                        </Route>

                        <Route path="notifications">
                            <Route index element={<RequireAuth><NotificationTemplatesComponent/></RequireAuth>}/>
                        </Route>

                        <Route path="sms/gateways">
                            <Route index element={<RequireAuth><SmsGatewayManagementComponent/></RequireAuth>}/>
                        </Route>

                        <Route path="/users" element={<RequireAuth><SystemUsersComponent /></RequireAuth>}/>
                        <Route path="/roles" element={<RequireAuth><RolesComponent /></RequireAuth>}/>
                        <Route path="*" element={<RequireAuth><DashboardInsightsPage/></RequireAuth>}/>
                    </Routes>

                </Content>
            </Layout>
        </Layout>
    );
}

export default MainLayout






