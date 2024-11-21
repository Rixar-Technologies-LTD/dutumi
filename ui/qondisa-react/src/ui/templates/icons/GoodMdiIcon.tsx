import React from "react";
import Icon from "@mdi/react";

interface Props {
    iconPath: string;
    iconColor?: string;
    iconSizeEm?: number;
    visible?: boolean;
}

const GoodMdiIcon: React.FC<Props> = ({
                                          visible = true,
                                          iconColor = '#83817b',
                                          iconPath,
                                          iconSizeEm = 1.5,
                                      }) => {

    if (!visible) {
        return <div></div>;
    }

    return (
        <>
            <Icon style={{margin:'0'}} size={iconSizeEm} path={iconPath} color={iconColor}></Icon>
        </>
    );
}

export default GoodMdiIcon;
