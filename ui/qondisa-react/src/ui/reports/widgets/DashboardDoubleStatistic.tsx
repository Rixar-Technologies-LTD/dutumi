import {Card, Col, Divider, Row, Space, Spin, Table, Tag} from 'antd';
import React from 'react';
import {LoadingOutlined} from "@ant-design/icons";


interface StatsDetails {
    icon: React.ReactNode,
    title: string,
    isLoading?: boolean,
    stat1Value: string,
    stat1Label?: string,
    stat2Value: string,
    stat2Label?: string,
    total?: string,
    description?: string,
    textColor: string
    titleColor?: string,
    borderColor?: string
}


const DashboardDoubleStatistic = ({
                                icon,
                                title,
                                stat1Value,
                                stat1Label,
                                stat2Value,
                                stat2Label,
                                description,
                                textColor,
                                isLoading = false,
                                titleColor = '#5a5a5a',
                                borderColor = '#dedbd2',
                            }: StatsDetails) => {

    return <>
        <Card
            hoverable={true}
            style={{border: `solid ${borderColor} 1px `}}
        >
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}>

                {isLoading ? <LoadingOutlined style={{fontSize: 20}} spin/> : icon}

                <div style={{backgroundColor: "transparent", textAlign: "end"}}>
                    <span style={{fontSize: "1em", color: `${titleColor}`}}>{title}</span><br/>

                    <span style={{fontSize: "1em", color: `${textColor}`}}>{stat1Value} </span>
                    <span style={{fontSize: "1em", color: `${textColor}`, fontWeight: 'lighter'}}> {stat1Label}</span><br/>

                    <span style={{fontSize: "1em", color: `${textColor}`}}>{stat2Value} </span>
                    <span style={{fontSize: "1em", color: `${textColor}`, fontWeight: 'lighter'}}> {stat2Label}</span><br/>

                 </div>


            </div>
        </Card>
    </>;


}

export default DashboardDoubleStatistic

