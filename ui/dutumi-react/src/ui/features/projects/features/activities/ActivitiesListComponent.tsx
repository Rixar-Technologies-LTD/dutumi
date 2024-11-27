import {Avatar, Button, Card, Flex, List, Space, Tag} from 'antd';
import React, {useEffect, useState} from 'react';

import {ActivityUpdate} from "../../../../../interfaces/projects/ProjectsInterfaces";
import ActivityFormComponent from "./ActivityFormComponent";
import {PlusCircleOutlined} from "@ant-design/icons";
import {getRequest} from "../../../../../services/http/RestClient";
import {notifyHttpError} from "../../../../../services/notification/notifications";

import sectionIcon from "../../../../../assets/images/icons/sections/feature2.png"
import userIcon from "../../../../../assets/images/icons/users/author.png"
import {isEmpty} from "../../../../../utils/helpers";

interface Props {
    featureId: string;
}


const ActivitiesListComponent = ({ featureId }:Props) => {

    const [activitiesList, setActivitiesList] = useState<ActivityUpdate[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);

    //Fetch products
    useEffect(() => {
        fetchUpdates();
    }, [featureId]);

    const fetchUpdates = () => {
        if(isEmpty(featureId)){
            console.log("")
            return ;
        }
        const url:string =`/api/v1/projects/features/activities?task_id=${featureId}`;
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                setActivitiesList(response.data.respBody.data);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }


    return <>
        <Card className="dtm-elevated" style={{marginRight: '24px', marginTop: '32px', padding:'0px'}}>

            <Flex justify="space-between" style={{marginBottom: 24}}>
                <h2 style={{color: '#758bfd', padding: 0, margin: 0, marginRight: '48px'}}>Updates</h2>
                <Button onClick={() => {
                    console.log("opening form")
                    setIsActivityFormOpen(true)
                }}
                        size="large"
                        icon={<PlusCircleOutlined/>}
                        key="1" type="primary">Post Update</Button>
            </Flex>

            <List
                className="demo-loadmore-list"
                loading={isLoading}
                itemLayout="horizontal"
                dataSource={activitiesList}
                renderItem={(activityUpdate) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={userIcon}/>}
                            title={<span style={{ color:'#8a8a8a', fontWeight:'normal'}}>{activityUpdate.author?.name}</span>}
                            description={<div>
                                 <p style={{margin:'0px',
                                     padding:'0px',
                                     color: '#212121',
                                     paddingBottom:'4px'}}>{activityUpdate.message}</p>
                                <Tag>{activityUpdate?.created_at}</Tag>
                            </div>}
                        />

                    </List.Item>
                )}
            />
        </Card>


        <ActivityFormComponent
            title="Post an Update"
            isVisible={isActivityFormOpen}
            featureId={featureId}
            onSaveCompleted={()=>{
                setIsActivityFormOpen(false);
                fetchUpdates();
            }}
            onCancelled={() => {
                setIsActivityFormOpen(false);
            }}
        />

    </>;

}

export default ActivitiesListComponent

