import React from "react";
import {Image} from "antd";

interface Props {
    iconPath: string;
    iconColor?: string;
    iconSizeEm?: number;
    visible?: boolean;
}

const GoodImageIcon: React.FC<Props> = ({
                                          visible = true,
                                          iconColor = '#83817b',
                                          iconPath,
                                          iconSizeEm = 56,
                                      }) => {

    if (!visible) {
        return <div></div>;
    }

    return (
        <>
            <div style={{ border: '1px solid #5e548e', backgroundColor:'#efe9ff', borderRadius:'4px' }}>
                <Image style={{padding:'8px'}} width={iconSizeEm} src={iconPath} color={iconColor}></Image>
            </div>
        </>
    );
}

export default GoodImageIcon;
