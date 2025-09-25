import React from 'react';
import {
    SortableContext,
} from '@dnd-kit/sortable';
import { JobTitleBenchmarkItem } from '@/lib/data';
import { JobTitleCard } from './job-title-card';
import { JobTitleBenchmark } from '@/types/benchMarkTitles';

interface JobTitleListProps {
    id: string;
    title: string;
    items: JobTitleBenchmark[];
}

const getSectionColor = (sectionId: string) => {
    switch (sectionId) {
        case 'highly-relevant':
            return 'bg-green-100 border-green-400';
        case 'needs-more-info':
            return 'bg-yellow-100 border-yellow-400';
        case 'definitely-not-relevant':
            return 'bg-red-100 border-red-400';
        default:
            return 'bg-gray-100 border-gray-400';
    }
};

const JobTitleList: React.FC<JobTitleListProps> = ({ id, title, items }) => {
    return (
        <div
            className={`w-full max-w-sm p-4 rounded-xl border-2 bg-background-main flex flex-col h-full`}
        >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{title} ({items.length})</h2>
            <div className="flex-grow overflow-y-auto pr-2">
                <SortableContext items={items.map(item => item.benchmark_title_id)}>
                    {items.map((item) => (
                        <JobTitleCard key={item.benchmark_title_id} item={item} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};
export default JobTitleList;