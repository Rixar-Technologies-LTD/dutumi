import {Col, Row} from 'antd';

import React, {useState, useEffect} from 'react';
import DashboardStatistic from "./widgets/DashboardStatistic";
import StatisticsGroup from "./widgets/StatisticsGroup";
import {getRequest} from "../../services/http/RestService";
import {notifyHttpError} from "../../services/notification/notifications";
import {getUserPermissions} from "../../state/auth/authStore";
import GoodMdiIcon from "../templates/icons/GoodMdiIcon";
import {
    mdiAccountGroupOutline,
    mdiBankOutline,
    mdiBarcodeScan, mdiCartOutline,
    mdiCash, mdiEmailOutline,
    mdiMapMarkerOutline, mdiMessageOutline, mdiMessageText,
    mdiOfficeBuildingMarkerOutline,
    mdiPackageUp
} from "@mdi/js";
import DashboardDoubleStatistic from "./widgets/DashboardDoubleStatistic";

interface BusinessStats {
    "businessesRegisteredToday": number,
    "businessesRegisteredThisWeek": number,
    "businessesRegisteredThisMonth": number,
    "businessesActiveCount": number,
    "businessesExpiredCount": number,
    "businessesInactiveCount": number,
    "businessesAllCount": number
}

interface UsersStats {
    "usersRegisteredToday": number,
    "usersRegisteredThisWeek": number,
    "usersRegisteredThisMonth": number,
    "usersActiveCount": number,
    "usersInActiveCount": number,
    "usersAllCount": number
}

interface NotificationStat {
    "todaySuccessCount": number,
    "todayFailureCount": number,
    "weeklySuccessCount": number,
    "weeklyFailureCount": number,
    "monthlySuccessCount": number,
    "monthlyFailureCount": number,
    "yearlySuccessCount": number,
    "yearlyFailureCount": number
}

interface GenericInsights {
    createTodayCount: number,
    createdThisWeekCount: number,
    createdThisMonthCount: number,
    allCount: number,
    createdTodaySum: number,
    createdThisWeekSum: number,
    createdThisMonthSum: number,
    createdThisYearSum: number,

    successCount: number,
    pendingCount: number,
    refundedCount: number,

    successSum: number,
    pendingSum: number
    refundedSum: number

}


const DashboardInsightsPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [businessStats, setBusinessStats] = useState<BusinessStats>();
    const [usersStats, setUsersStats] = useState<UsersStats>();
    const [paymentsInsightsStats, setPaymentTransactionsInsights] = useState<GenericInsights>();
    const [manualInsightsStats, setManualTransactionsInsights] = useState<GenericInsights>();
    const [notificationsInsightsStats, setNotificationInsights] = useState<NotificationStat>();
    const [emailsInsightsStats, setEmailsInsights] = useState<NotificationStat>();

    const permissions: string[] = getUserPermissions();

    useEffect(() => {
        // fetchBusinessesStats();
        // fetchUsersStats();
        // fetchPaymentTransactionsInsights();
        // fetchManualTransactionsInsights();
        // fetchSmsInsights();
        // fetchEmailsInsights();
    }, []);

    //Fetch Stats
    const fetchBusinessesStats = () => {
        console.log("fetching business stats...")
        setIsLoading(true)
        getRequest("/api/v1/manage/insights/businesses").then((response) => {
            setBusinessStats(response.data.respBody);
        }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const fetchUsersStats = () => {
        console.log("fetching users stats...")
        setIsLoading(true)
        getRequest("/api/v1/manage/insights/users")
            .then((response) => {
                setUsersStats(response.data.respBody);
            }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const fetchPaymentTransactionsInsights = () => {
        console.log("fetching users stats...")
        setIsLoading(true)
        getRequest("/api/v1/manage/insights/transactions")
            .then((response) => {
                setPaymentTransactionsInsights(response.data.respBody);
            }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const fetchManualTransactionsInsights = () => {
        console.log("fetching users stats...")
        setIsLoading(true)
        getRequest("/api/v1/manage/insights/transactions/manual")
            .then((response) => {
                setManualTransactionsInsights(response.data.respBody);
            }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const fetchSmsInsights = () => {
        console.log("fetching notifications stats...")
        setIsLoading(true)
        getRequest("/api/v1/manage/insights/notifications/sms")
            .then((response) => {
                setNotificationInsights(response.data.respBody);
            }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const fetchEmailsInsights = () => {
        console.log("fetching notifications stats...")
        setIsLoading(true)
        getRequest("/api/v1/manage/insights/notifications/emails")
            .then((response) => {
                setEmailsInsights(response.data.respBody);
            }).catch((errorObj) => {
            notifyHttpError('Operation Failed', errorObj)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const isAllowed: boolean = permissions.includes("REPORTS_DASHBOARD")


    return <div style={{
        paddingLeft: '24px',
        paddingRight: '24px',
        marginTop: "24px",
        marginBottom: "64px",
    }}>


        {/**
         -----------------------
         | Projects Stats
         -------------------------
         */}
        <Row>
            <Col className="gutter-row" span={24}>

                {isAllowed && <StatisticsGroup
                    title="Projects"
                    textColor="#5a5a5a">
                    <Row gutter={16}>

                        {/*Day Subscribers*/}
                        <Col className="gutter-row" style={{marginTop:'8px'}} span={6} md={6} sm={24}>
                            <DashboardStatistic
                                textColor="#4895ef"
                                titleColor="#4895ef"
                                isLoading={isLoading}
                                icon={<GoodMdiIcon iconPath={mdiOfficeBuildingMarkerOutline}/>}
                                title="Subscribed Today"
                                statValue={`${new Intl.NumberFormat('en-US').format(businessStats?.businessesRegisteredToday ?? 0)}`}
                            ></DashboardStatistic>
                        </Col>

                        {/*Month Subscribers*/}
                        <Col className="gutter-row" style={{marginTop:'8px'}} span={6} md={6} sm={24}>
                            <DashboardStatistic
                                textColor="#5a5a5a"
                                isLoading={isLoading}
                                icon={<GoodMdiIcon iconPath={mdiOfficeBuildingMarkerOutline}/>}
                                title="This Week"
                                statValue={`${new Intl.NumberFormat('en-US').format(businessStats?.businessesRegisteredThisMonth ?? 0)}`}
                            ></DashboardStatistic>
                        </Col>

                        {/*Month Subscribers*/}
                        <Col className="gutter-row" style={{marginTop:'8px'}} span={6} md={6} sm={24}>
                            <DashboardStatistic
                                textColor="#5a5a5a"
                                isLoading={isLoading}
                                icon={<GoodMdiIcon iconPath={mdiOfficeBuildingMarkerOutline}/>}
                                title="This Month"
                                statValue={`${new Intl.NumberFormat('en-US').format(businessStats?.businessesRegisteredThisMonth ?? 0)}`}
                            ></DashboardStatistic>
                        </Col>


                        {/*All Time Subscribers*/}
                        <Col className="gutter-row" style={{marginTop:'8px'}} span={6} md={6} sm={24}>
                            <DashboardStatistic
                                textColor="#5a5a5a"
                                isLoading={isLoading}
                                icon={<GoodMdiIcon iconPath={mdiOfficeBuildingMarkerOutline}/>}
                                title="All Time"
                                statValue={`${new Intl.NumberFormat('en-US').format(businessStats?.businessesAllCount ?? 0)}`}
                            ></DashboardStatistic>
                        </Col>

                        {/*Active Subscribers*/}
                        <Col className="gutter-row" style={{marginTop:'8px'}} span={6} md={6} sm={24}>
                            <DashboardStatistic
                                textColor="#57cc99"
                                titleColor="#57cc99"
                                isLoading={isLoading}
                                icon={<GoodMdiIcon iconPath={mdiOfficeBuildingMarkerOutline}/>}
                                title="Active Businesses"
                                statValue={`${new Intl.NumberFormat('en-US').format(businessStats?.businessesActiveCount ?? 0)}`}
                            ></DashboardStatistic>
                        </Col>

                        {/*Active Subscribers*/}
                        <Col className="gutter-row" style={{marginTop:'8px'}} span={6} md={6} sm={24}>
                            <DashboardStatistic
                                textColor="#fb8500"
                                titleColor="#fb8500"
                                isLoading={isLoading}
                                icon={<GoodMdiIcon iconPath={mdiOfficeBuildingMarkerOutline}/>}
                                title="InActive Businesses"
                                statValue={`${new Intl.NumberFormat('en-US').format(businessStats?.businessesInactiveCount ?? 0)}`}
                            ></DashboardStatistic>
                        </Col>

                    </Row>
                </StatisticsGroup>}
            </Col>
        </Row>



        {/**
         ------------------------
         | Online Transactions Stats
         -----------------------------
         */}
        <StatisticsGroup
            title="Issues"
            textColor="#5a5a5a">

            <Row gutter={16}>

                {/*Week Transactions amount*/}
                <Col className="gutter-row" span={6}>
                    <DashboardStatistic
                        isLoading={isLoading}
                        textColor="#4895ef"
                        icon={<GoodMdiIcon iconPath={mdiBankOutline}/>}
                        title="Today"
                        statValue={`${new Intl.NumberFormat('en-US').format(paymentsInsightsStats?.createTodayCount ?? 0)}`}
                        statLabel="Transactions"
                        description={`${(paymentsInsightsStats?.createdTodaySum ?? 0).toLocaleString()} TZS`}
                    ></DashboardStatistic>
                </Col>

                {/*Week Transactions amount*/}
                <Col className="gutter-row" span={6}>
                    <DashboardStatistic
                        isLoading={isLoading}
                        textColor="#5a5a5a"
                        icon={<GoodMdiIcon iconPath={mdiBankOutline}/>}
                        title="This Week"
                        statValue={`${new Intl.NumberFormat('en-US').format(paymentsInsightsStats?.createdThisWeekCount ?? 0)}`}
                        statLabel="Transactions"
                        description={`${(paymentsInsightsStats?.createdThisWeekSum ?? 0).toLocaleString()} TZS`}
                    ></DashboardStatistic>
                </Col>

                {/*Month transactions amount*/}
                <Col className="gutter-row" span={6}>
                    <DashboardStatistic
                        textColor="#5a5a5a"
                        isLoading={isLoading}
                        icon={<GoodMdiIcon iconPath={mdiBankOutline}/>}
                        title="This Month"
                        statValue={`${new Intl.NumberFormat('en-US').format(paymentsInsightsStats?.createdThisMonthCount ?? 0)}`}
                        statLabel="Transactions"
                        description={`${(paymentsInsightsStats?.createdThisMonthSum ?? 0).toLocaleString()} TZS`}
                    ></DashboardStatistic>
                </Col>

                {/*All Transactions Count*/}
                <Col className="gutter-row" span={6}>
                    <DashboardStatistic
                        textColor="#5a5a5a"
                        isLoading={isLoading}
                        icon={<GoodMdiIcon iconPath={mdiBankOutline}/>}
                        title="Refunded"
                        statValue={`${new Intl.NumberFormat('en-US').format(paymentsInsightsStats?.refundedCount ?? 0)}`}
                        statLabel="Transactions"
                        description={`${(paymentsInsightsStats?.refundedSum ?? 0).toLocaleString()} TZS`}
                    ></DashboardStatistic>
                </Col>

            </Row>
        </StatisticsGroup>


        {/**
         ------------------------
         | Manual Transactions Stats
         -----------------------------
         */}
        <StatisticsGroup
            title="Payments"
            textColor="#5a5a5a">

            <Row gutter={16}>

                {/*Week Transactions amount*/}
                <Col className="gutter-row" span={6}>
                    <DashboardStatistic
                        isLoading={isLoading}
                        textColor="#5a5a5a"
                        icon={<GoodMdiIcon iconPath={mdiCash}/>}
                        title="Today"
                        statValue={`${new Intl.NumberFormat('en-US').format(manualInsightsStats?.createTodayCount ?? 0)}`}
                    ></DashboardStatistic>
                </Col>

                {/*Week Transactions amount*/}
                <Col className="gutter-row" span={6}>
                    <DashboardStatistic
                        isLoading={isLoading}
                        textColor="#1e96fc"
                        icon={<GoodMdiIcon iconPath={mdiCash}/>}
                        title="This Week"
                        statValue={`${new Intl.NumberFormat('en-US').format(manualInsightsStats?.createdThisWeekCount ?? 0)}`}
                    ></DashboardStatistic>
                </Col>

                {/*Month transactions amount*/}
                <Col className="gutter-row" span={6}>
                    <DashboardStatistic
                        textColor="#1e96fc"
                        isLoading={isLoading}
                        icon={<GoodMdiIcon iconPath={mdiCash}/>}
                        title="This Month"
                        statValue={`${new Intl.NumberFormat('en-US').format(manualInsightsStats?.createdThisMonthCount ?? 0)}`}
                    ></DashboardStatistic>
                </Col>

                {/*All Transactions Count*/}
                <Col className="gutter-row" span={6}>
                    <DashboardStatistic
                        textColor="#1e96fc"
                        isLoading={isLoading}
                        icon={<GoodMdiIcon iconPath={mdiCash}/>}
                        title="Pending"
                        statValue={`${new Intl.NumberFormat('en-US').format(manualInsightsStats?.pendingCount ?? 0)}`}
                    ></DashboardStatistic>
                </Col>

            </Row>
        </StatisticsGroup>

        {!isAllowed && <div>
            <h3> Hesabu Admin</h3>
            <p> Use left menu for navigation</p>
        </div>}


    </div>;

}

export default DashboardInsightsPage

