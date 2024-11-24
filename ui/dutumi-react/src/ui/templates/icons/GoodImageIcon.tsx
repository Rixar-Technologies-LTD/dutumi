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
                                          iconPath,
                                          iconSizeEm = 56,
                                          padding = 8,
                                      }) => {

    if (!visible) {
        return <div></div>;
    }

    return (
        <>
            <div style={{ border: '1px solid #758bfd', backgroundColor:'#f1f3ff', borderRadius:'4px' }}>
                <Image preview={false} style={{padding:`${padding}px`}} width={iconSizeEm} src={iconPath}></Image>
            </div>
        </>
    );
}

export default GoodImageIcon;
