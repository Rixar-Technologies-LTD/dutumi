import {Card, Space, Image} from "antd";
import BaseCardComponentProps from "types/ui/BaseCardComponentProps";
import React from "react";

const EyasiContentCard = ({
                              children,
                              title,
                              iconImage,
                              subTitle,
                              extraHeaderItems,
                              margin = 24
                          }: BaseCardComponentProps) => {

    const header = <Space style={{paddingTop: 12, paddingBottom: 12}}>
        <div style={{backgroundColor: '#f1f3ff', padding: '8px 8px', borderRadius: 8}}>
            <Image width={36}
                   style={{marginRight: 12, backgroundColor: '#00000000'}}
                   src={iconImage}></Image></div>
        <h3 style={{ lineHeight: '1em'}}>
            {title} <br/>
            <span style={{fontWeight: "lighter", fontSize: "0.9em"}}>{subTitle}</span>
        </h3>
    </Space>


    return <Card

        title={header}
        style={{marginLeft: margin, marginRight: margin, marginTop: 32, marginBottom: 48}}
        extra={extraHeaderItems}>
        {children}
    </Card>;

}

export default EyasiContentCard;
