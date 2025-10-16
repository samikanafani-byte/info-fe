import { getChainItems, isAIProcessing, StreamState } from '@/types/streamState';
import { CheckCircleOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import type { ThoughtChainItem } from '@ant-design/x';
import { Check } from 'lucide-react';
import { ThoughtChain } from '@ant-design/x';
import { THOUGHT_CHAIN_ITEM_STATUS } from '@ant-design/x/es/thought-chain/Item';

import React, { useEffect, useState } from 'react';
import { th } from 'date-fns/locale';

interface AppThoughtChainProps {
    
    streamState: StreamState;
}


const statusColors: { [key: string]: string } = {
    'success': 'bg-primary border-green-500 text-white',
    'passed': 'bg-green-500 border-green-500 text-white',
    'pending': 'bg-gray-500 border-yellow-500 text-white',
    'default': 'bg-primary border-blue-500 text-white',
    'connector-active': 'bg-blue-500',
    'connector-default': 'bg-gray-300', 
};




interface ChainStepProps {
    item: ThoughtChainItem;
    index: number;
    isLast: boolean;
    nextItemStatus?: ThoughtChainItem['status'];
    isAiProcessing?: boolean;
}

const ChainStep: React.FC<ChainStepProps> = ({ item, index, isLast, nextItemStatus, isAiProcessing }) => {
    const { status, title, icon } = item;

    const colorClasses = (status != null ? (statusColors[status] || statusColors['default']) : statusColors['default']) + (isAiProcessing ? " animate-pulse" : "");
    
    const iconContent = icon ? (
        <span className="text-xl">{icon}</span> 
    ) : (
        <span className="text-sm font-bold">{index + 1}</span>
    );

    return (
        
        <div className="flex items-center min-w-0">
        
            <div className="flex flex-col items-center z-10"> 
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${colorClasses}`}>
                    {iconContent}
                </div>
                
                <div className="m-2 text-center text-xs font-bold text-gray-700 max-w-[80px] truncate">
                    {title}
                </div>
            </div>
            
        </div>
    );
};




const getIconForStatus = (status: string) => {
    switch (status) {
        case "passed":
            return <Check />;
        case "current":
            return undefined
        case "pending":
            return undefined;
        default:
            return <InfoCircleOutlined />;
    }
}
const statusToThoughtChainStatus = (status: string): THOUGHT_CHAIN_ITEM_STATUS | undefined => {
    switch (status) {
        case "passed":
            return THOUGHT_CHAIN_ITEM_STATUS.SUCCESS
        case "current":
            return undefined
        default:
            return THOUGHT_CHAIN_ITEM_STATUS.PENDING
    }
}
const getThoughtChainsFromStreamState = (streamState: StreamState): ThoughtChainItem[] => {
    const chainItems = getChainItems(streamState);
    return chainItems.map((item) => ({
        key: item.key,
        title: item.title,
        status: statusToThoughtChainStatus(item.status),
        icon: getIconForStatus(item.status),
    }));
}


const AppThoughtChain: React.FC<AppThoughtChainProps> = ({ streamState }) => {
    const [thoughtChainItems, setThoughtChainItems] = useState<ThoughtChainItem[]>(getThoughtChainsFromStreamState(streamState));
    useEffect(() => {
        console.log("StreamState updated in AppThoughtChain:");
        thoughtChainItems.forEach(item => {
            console.log(`AI Processing- ${item.key}: ${item.status} - isAiProcessing: ${isAIProcessing(streamState,item.key ?? "")}`);
        });
        setThoughtChainItems(getThoughtChainsFromStreamState(streamState));
    }, [streamState]);


    
    if (!thoughtChainItems || thoughtChainItems.length === 0) {
        return <p className="text-gray-500">No chain items to display.</p>;
    }

    return (
        <div className='w-full py-4 overflow-x-auto'>
            <div className="flex items-start min-w-full">
                {thoughtChainItems.map((item, index) => (
                    <ChainStep
                        key={index}
                        item={item}
                        index={index}
                        isLast={index === thoughtChainItems.length - 1}
                        nextItemStatus={thoughtChainItems[index + 1]?.status}
                        isAiProcessing={isAIProcessing(streamState,item.key ?? "")}
                    />
                ))}
            </div>
        </div>
    );
}

export default AppThoughtChain;