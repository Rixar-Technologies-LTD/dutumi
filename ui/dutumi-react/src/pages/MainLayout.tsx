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

import {Header} from "antd/es/layout/layout";
import {getUser} from "state/auth/authStore";
import {AppstoreOutlined, LogoutOutlined, UserOutlined} from "@ant-design/icons";
import BusinessesListComponent from "pages/businesses/BusinessesListComponent";
import UserDetailsComponent from "pages/users/UserDetailsComponent";
import SmsHistoryComponent from "pages/operations/SmsHistoryComponent";
import EmailHistoryComponent from "pages/operations/EmailHistoryComponent";
import ProjectsListComponent from "pages/projects/ProjectsListComponent";
import ProjectDetailsComponent from "pages/projects/ProjectDetailsComponent";
import FeatureDetailsComponent from "pages/projects/features/FeatureDeatailsComponent";
import ProjectMembersHolderComponent from "pages/projects/members/ProjectMembersHolderComponent";
import AssetGroupsListComponent from "pages/assets/AssetGroupsListComponent";
import AssetsListComponent from "pages/assets/AssetsListComponent";
import FinanceBillingComponent from "pages/finance/FinanceBillingComponent";
import TopMenuButton from "navigation/TopMenuButton";


const {Content} = Layout;

function MainLayout() {


    const user: any = getUser();

    return (
        <Layout style={{minHeight: '100vh'}}>

            <LeftSideMenu></LeftSideMenu>

            <Layout className="site-layout" style={{marginLeft: 280}}>
                <Header style={{
                    background: '#ffffff',
                    borderBottom: '1px solid #a3d1ee',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>

                    <Space align="center">
                        <AppstoreOutlined/>
                        <span style={{fontWeight: 'bold'}}>{user.workspaceName}</span>
                        <span style={{fontWeight: 'lighter'}}>Workspace</span>
                    </Space>

                    <TopMenuButton/>
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


                        <Route path="transactions">
                            <Route index element={<RequireAuth><TransactionsListComponent/></RequireAuth>}/>
                        </Route>


                        <Route path="operations/sms">
                            <Route index element={<RequireAuth><SmsHistoryComponent/></RequireAuth>}/>
                        </Route>
                        <Route path="operations/emails">
                            <Route index element={<RequireAuth><EmailHistoryComponent/></RequireAuth>}/>
                        </Route>


                        <Route path="configs">
                            <Route path="users" element={<RequireAuth><UsersManagementComponent/></RequireAuth>}/>
                            <Route path="users/:userId" element={<RequireAuth><UserDetailsComponent/></RequireAuth>}/>
                        </Route>


                        <Route path="/users" element={<RequireAuth><SystemUsersComponent/></RequireAuth>}/>
                        <Route path="/roles" element={<RequireAuth><RolesComponent/></RequireAuth>}/>
                        <Route path="*" element={<RequireAuth><DashboardInsightsPage/></RequireAuth>}/>

                    </Routes>

                </Content>
            </Layout>
        </Layout>
    );
}

export default MainLayout






