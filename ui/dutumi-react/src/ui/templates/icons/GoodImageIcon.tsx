import React from "react";
import {Image} from "antd";

interface Props {
    iconPath: string;
    iconColor?: string;
    iconSizeEm?: number;
    padding?: number;
    visible?: boolean;
}

const GoodImageIcon: React.FC<Props> = ({
                                          visible = true,
                                          iconColor = '#83817b',
                                          iconPath,
                                          iconSizeEm = 56,
                                          padding = 8,
                                      }) => {

    if (!visible) {
        return <div></div>;
    }

    return (
        <>
            <div style={{ border: '1px solid #5e548e', backgroundColor:'#f7f1fe', borderRadius:'4px' }}>
                <Image style={{padding:`${padding}px`}} width={iconSizeEm} src={iconPath} color={iconColor}></Image>
            </div>
        </>
    );
}

export default GoodImageIcon;
