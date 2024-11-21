
import React from "react";

import '../../css/components.css';
import {Tag} from "antd";

interface LabelValueProps {
    label?: string,
    value?: string,
    isTag?: boolean,
    tagColor?: string,
    borderColor?: string,
}

const GoodLabelValueWidget = ({ label, value, isTag = false,tagColor='grey' ,borderColor='#faedcd'} : LabelValueProps) => {

    return <div className="info-holder">
        <div className="label-value-container" style={{paddingTop: '4px', paddingBottom: '8px', borderBottom: `1px solid ${borderColor}`}}>
            <span className="label">{label}</span>
            {isTag? <Tag color={tagColor}>{value}</Tag> : <span className="value">{value}</span>}
        </div>
    </div>;

}

export default GoodLabelValueWidget;
