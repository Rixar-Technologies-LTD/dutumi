import {Button, Flex, Layout, Space} from 'antd';
import {Route, Routes} from "react-router-dom";

import React from "react";

import 'css/custom.css';
import LeftSideMenu from "navigation/LeftSideMenu";
import SystemUsersComponent from "pages/system/users/SystemUsersComponent";
import RolesComponent from "pages/system/users/RolesComponent";
import DashboardInsightsPage from "pages/reports/DashboardInsightsPage";

import RequireAuth from "../services/auth/RequireAuth";
import TransactionsListComponent from "pages/finance/TransactionsListComponent";
import UsersManagementComponent from "pages/users/UsersManagementComponent";
import AgentsListComponent from "pages/management/agents/AgentsListComponent";
import NotificationTemplatesComponent from "pages/management/notications/NotificationTemplatesComponent";
import SmsGatewayManagementComponent from "pages/management/sms_gateways/SmsGatewayManagementComponent";
import CommissionsListComponent from "pages/commissions/CommissionsListComponent";
import {Header} from "antd/es/layout/layout";
import {getUser, getUserName} from "state/auth/authStore";
import {AppstoreOutlined, LogoutOutlined, UserOutlined} from "@ant-design/icons";
import {forceLogout} from "../services/auth/SessionHandler";
import BusinessesListComponent from "pages/businesses/BusinessesListComponent";
import UserDetailsComponent from "pages/users/UserDetailsComponent";
import SmsHistoryComponent from "pages/operations/SmsHistoryComponent";
import AppVersionsComponent from "pages/management/apps/AppVersionsComponent";
import EmailHistoryComponent from "pages/operations/EmailHistoryComponent";
import ProjectsListComponent from "pages/projects/ProjectsListComponent";
import ProjectDetailsComponent from "pages/projects/ProjectDetailsComponent";
import FeatureDetailsComponent from "pages/projects/features/FeatureDeatailsComponent";
import ProjectMembersHolderComponent from "pages/projects/members/ProjectMembersHolderComponent";
import AssetGroupsListComponent from "pages/assets/AssetGroupsListComponent";
import AssetsListComponent from "pages/assets/AssetsListComponent";
import FinanceBillingComponent from "pages/finance/FinanceBillingComponent";

import workspaceIcon from "assets/images/icons/objects/workspace.png";

const {Content} = Layout;

function MainLayout() {


    const user: any = getUser();

    return (
        <Layout style={{minHeight: '100vh'}}>

            <LeftSideMenu></LeftSideMenu>

            <Layout className="site-layout" style={{marginLeft: 280}}>
                <Header style={{
                    background: '#f1f1f1',
                    borderBottom: '1px solid #a3d1ee',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>

                    <Space align="center">
                        <AppstoreOutlined/>
                        <span>{user.workspaceName}</span>
                    </Space>

                    <Space align="end">
                        <UserOutlined/>
                        <span>{user.name}</span>
                        <Button onClick={forceLogout} icon={<LogoutOutlined/>} type="default">Logout</Button>
                    </Space>
                </Header>

                <Content style={{minHeight: '100vh', padding: '0 0'}}>

                    <Routes>


                        <Route path="projects">
                            <Route index element={<RequireAuth><ProjectsListComponent/></RequireAuth>}/>
                            <Route path=":projectId" element={<ProjectDetailsComponent/>}/>
                            <Route path="members/:projectId" element={<ProjectMembersHolderComponent/>}/>
                            <Route path="features/details" element={<FeatureDetailsComponent/>}/>
                            <Route path="releases" element={<BusinessesListComponent/>}/>
                            <Route path="issues" element={<BusinessesListComponent/>}/>
                        </Route>

                        <Route path="assets">
                            <Route index element={<RequireAuth><AssetsListComponent/></RequireAuth>}/>
                            <Route path="groups" element={<RequireAuth><AssetGroupsListComponent/></RequireAuth>}/>
                        </Route>

                        <Route path="finance">
                            <Route path="assets/bills" element={<RequireAuth><FinanceBillingComponent/></RequireAuth>}/>
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






