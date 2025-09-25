import React, { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { JobTitleBenchmark } from '@/types/benchMarkTitles';


interface JobTitleCardProps {
  item: JobTitleBenchmark;
}
const getCategoryName = (category: string) => {
  switch (category) {
    case 'highly_relevant':
      return 'Highly Relevant';
    case 'needs_more_info':
      return 'Needs More Info';
    case 'definitely_not_relevant':
      return 'Definitely Not Relevant';
    default:
      return category;
  }
}
export const JobTitleCard: React.FC<JobTitleCardProps> = ({ item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.benchmark_title_id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Add a slight tilt and shadow when dragging for better visual feedback
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.5 : 1,
    boxShadow: isDragging ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 mb-3 bg-white rounded-lg shadow-md border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow duration-150"
    >
      <p className="font-bold text-lg text-gray-800">{item.company_job_function.job_function}</p>
      <p className="text-sm text-blue-600">{item.company_job_function.company_name}</p>
      <p className="text-xs mt-1 text-gray-500 line-clamp-2">
        Reasoning: {item.relevance_justification}
      </p>
      <div className="mt-2 flex justify-between items-center text-xs">
        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
          Initial: {getCategoryName(item.ai_category)}
        </span>
        {item.user_category && (
          <span className="px-2 py-0.5 bg-indigo-500 text-white rounded-full">
            Current: {getCategoryName(item.user_category)}
          </span>
        )}
        
      </div>
    </div>
  );
};