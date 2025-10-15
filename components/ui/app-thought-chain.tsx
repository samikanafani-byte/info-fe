import { CheckCircleOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import type { ThoughtChainItem } from '@ant-design/x';
import { ThoughtChain } from '@ant-design/x';

import React from 'react';

interface AppThoughtChainProps {
    thoughtChainItems: ThoughtChainItem[];
}


const statusColors: { [key: string]: string } = {
    'success': 'bg-green-500 border-green-500 text-white',
    'passed': 'bg-green-500 border-green-500 text-white',
    'pending': 'bg-gray-500 border-yellow-500 text-white',
    'default': 'bg-blue-500 border-blue-500 text-white',
    'connector-active': 'bg-blue-500',
    'connector-default': 'bg-gray-300', 
};




interface ChainStepProps {
    item: ThoughtChainItem;
    index: number;
    isLast: boolean;
    nextItemStatus?: ThoughtChainItem['status'];
}

const ChainStep: React.FC<ChainStepProps> = ({ item, index, isLast, nextItemStatus }) => {
    const { status, title, icon } = item;


    const colorClasses = status != null ? (statusColors[status] || statusColors['default']) : statusColors['default'];
    const connectorColor = (status === 'success' ) ? statusColors['connector-active'] : statusColors['connector-default'];

    
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

            
            {!isLast && (
                
                <div className={`flex-1 h-1 ${connectorColor}`}></div>
            )}
        </div>
    );
};

// The main component
const AppThoughtChain: React.FC<AppThoughtChainProps> = ({ thoughtChainItems }) => {
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
                    />
                ))}
            </div>
        </div>
    );
}

export default AppThoughtChain;