import {Card} from 'antd';
import React from 'react';
import {LoadingOutlined} from "@ant-design/icons";


interface StatsDetails {
    icon: React.ReactNode,
    title: string,
    isLoading?: boolean,
    statValue: string,
    statLabel?: string,
    description?: string,
    textColor: string
    titleColor?: string,
    borderColor?: string
}


const DashboardStatistic = ({
                                icon,
                                title,
                                statValue,
                                description,
                                textColor,
                                isLoading = false,
                                statLabel = '',
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

                    <span style={{fontSize: "1.4em", color: `${textColor}`}}>{statValue}</span>
                    <span style={{fontSize: "1em", color: `${textColor}`, fontWeight: 'lighter'}}> {statLabel}</span><br/>

                    <span style={{fontSize: "1em", color: `${textColor}`}}>{description}</span>
                </div>


            </div>
        </Card>
    </>;


}

export default DashboardStatistic

