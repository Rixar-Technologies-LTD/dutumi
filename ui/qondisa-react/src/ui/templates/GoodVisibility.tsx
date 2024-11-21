import React from "react";


interface Props {
    children: React.ReactNode;
    visible?: boolean;
}

const GoodVisibility : React.FC<Props> = ({children,visible=true}) => {

    if(!visible){
        return <div></div>
    }

    return (
        <>
            {children}
        </>
    );
}

export default GoodVisibility;
