import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    UniqueIdentifier,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    arrayMove,
} from '@dnd-kit/sortable';
import { StreamState } from '@/types/streamState';
import { JobTitleBenchmarkItem } from '@/lib/data';
import JobTitleList from '../job-title-list';
import { JobTitleBenchmark } from '@/types/benchMarkTitles';
import { updateProject } from '@/services/projectService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HybridFeedbackInput } from '../hybrid-feedback-input';



type SectionId = 'highly-relevant' | 'needs-more-info' | 'definitely-not-relevant';

// Helper type for our state structure
type JobTitleSections = Record<SectionId, JobTitleBenchmark[]>;





interface Screen4_BenchmarkReviewProps {
    sessionId: string,
    streamState: StreamState,
    onStartSourcing: () => void
    onNext: () => void
    onRebenchmark: () => void
}



export const Screen4_BenchmarkReview: React.FC<Screen4_BenchmarkReviewProps> = ({
    sessionId,
    streamState,
    onStartSourcing,
    onNext,
    onRebenchmark
}: Screen4_BenchmarkReviewProps) => {
    const [newStreamState, setNewStreamState] = useState<StreamState>(streamState)
    const [feedbackText, setFeedbackText] = useState<string>("")
    const [submitLoading, setSubmitLoading] = useState<boolean>(false)
    const benchMarkState = newStreamState.benchmark_state;
    const allSectionsFilled: JobTitleSections = {
        'highly-relevant': benchMarkState?.benchmark_titles?.results.filter(j => j.ai_category === 'highly_relevant') ?? [],
        'needs-more-info': benchMarkState?.benchmark_titles?.results.filter(j => j.ai_category === 'needs_more_info') ?? [],
        'definitely-not-relevant': benchMarkState?.benchmark_titles?.results.filter(j => j.ai_category === 'definitely_not_relevant') ?? [],
    }
    //first 4 of each section

    const [highlyRelevantIndex, setHighlyRelevantIndex] = useState<number | null>(allSectionsFilled['highly-relevant'].length > 4 ? 4 : null)
    const [needMoreInfoIndex, setNeedMoreInfoIndex] = useState<number | null>(allSectionsFilled['needs-more-info'].length > 4 ? 4 : null)
    const [definitelyNotRelevantIndex, setDefinitelyNotRelevantIndex] = useState<number | null>(allSectionsFilled['definitely-not-relevant'].length > 4 ? 4 : null)

    const initialSections: JobTitleSections = {
        'highly-relevant': highlyRelevantIndex ? allSectionsFilled['highly-relevant'].slice(0, highlyRelevantIndex) : allSectionsFilled['highly-relevant'],
        'needs-more-info': needMoreInfoIndex ? allSectionsFilled['needs-more-info'].slice(0, needMoreInfoIndex) : allSectionsFilled['needs-more-info'],
        'definitely-not-relevant': definitelyNotRelevantIndex ? allSectionsFilled['definitely-not-relevant'].slice(0, definitelyNotRelevantIndex) : allSectionsFilled['definitely-not-relevant'],
    };


    // State to hold job titles categorized into sections
    const [sections, setSections] = useState<JobTitleSections>(initialSections);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

    // Set up Dnd-Kit sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    

    // A memoized list of all section IDs for DndContext
    const sectionIds = useMemo(() => Object.keys(sections), [sections]) as SectionId[];


    useEffect(() => {
        setSections(initialSections)
    }, [highlyRelevantIndex, needMoreInfoIndex, definitelyNotRelevantIndex])

    // Helper to find the section a job title belongs to
    const findSection = (id: UniqueIdentifier): SectionId | undefined => {
        if (sectionIds.includes(id as SectionId)) {
            return id as SectionId;
        }
        const section = sectionIds.find((key) =>
            sections[key].some(item => item.benchmark_title_id === id)
        );
        return section;
    };

    const getButtonText = () => {
        if (benchMarkState?.status === "titles") {
            return "Apply & Benchmark Profiles";
        } else {
            return "Apply & Start Full Sourcing";
        }
    }
    const updateServerWithNewSections = async (updatedSections: JobTitleSections) => {
        // update the stream state with the new benchmark titles
        const updatedBenchMarkState = {
            ...benchMarkState,
            benchmark_titles: {
                results: [
                    ...updatedSections['highly-relevant'],
                    ...updatedSections['needs-more-info'],
                    ...updatedSections['definitely-not-relevant']
                ]
            }
        }
        const updatedStreamState = {
            ...newStreamState,
            benchmark_state: updatedBenchMarkState
        }
        setNewStreamState(updatedStreamState);

        // send the updated stream state to the server
        try {
            const response = await updateProject(sessionId, newStreamState.stream_id, updatedStreamState);
        }
        catch (error) {
            console.error("Error updating project with feedback:", error);
        }
    }
    
    

    // Handler for when a drag action ends
    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Determine the source and destination sections
        const activeSection = findSection(activeId);
        const overSection = findSection(overId) || (sectionIds.includes(overId as SectionId) ? (overId as SectionId) : undefined);

        if (!activeSection || !overSection) return;

        setSections((prevSections) => {
            // 1. Get the items from the source and destination sections
            let newSections: JobTitleSections = { ...prevSections };
            const activeItems = newSections[activeSection];
            const overItems = newSections[overSection];

            // 2. Find the index of the dragged item and the item it's dropped over
            const activeIndex = activeItems.findIndex(item => item.benchmark_title_id === activeId);
            const overIndex = overItems.findIndex(item => item.benchmark_title_id === overId);

            // If dragging within the same section
            if (activeSection === overSection) {
                if (activeIndex !== overIndex) {
                    const newItems = arrayMove(activeItems, activeIndex, overIndex);
                    newSections[activeSection] = newItems;
                }
            }
            // If dragging to a different section
            else {
                // a. Find the item being moved
                const [movedItem] = activeItems.splice(activeIndex, 1);

                // b. Update the item's currentCategory
                const updatedItem = { ...movedItem, currentCategory: overSection };

                // c. Determine the drop position in the new section
                const newIndex = (overIndex === -1 && sectionIds.includes(overId as SectionId)) // Dropped directly onto an empty container
                    ? overItems.length
                    : overIndex === -1 // Dropped onto an item that isn't in the list (e.g., container padding)
                        ? overItems.length
                        : overIndex;

                // d. Insert the item into the new section
                overItems.splice(newIndex, 0, updatedItem);
            }

            return newSections;
        });
        

    };

    const handleStartResourcing = async () => {
        //update the status of the stream
        newStreamState.benchmark_state!.status = "profiles"
        newStreamState.status = "benchmarking_profiles"
        const updatedBenchMarkState = {
            ...benchMarkState,
            benchmark_titles: {
                results: [
                    ...sections['highly-relevant'],
                    ...sections['needs-more-info'],
                    ...sections['definitely-not-relevant']
                ]
            }
        }
        const updatedStreamState = {
            ...newStreamState,
            benchmark_state: updatedBenchMarkState
        }
        setNewStreamState(updatedStreamState);


        try {
            setSubmitLoading(true)
            const updatedProject = await updateProject(sessionId, newStreamState.stream_id, newStreamState)
            onStartSourcing();
        }
        catch (error) {
            console.error("Error updating project to start sourcing:", error);
        }
        finally {
            setSubmitLoading(false)
        }
    }

    const handleUpdateContent = async (content: string) => {
        // get the job function that are mentioned in the content
        const allItems = [...sections['highly-relevant'], ...sections['needs-more-info'], ...sections['definitely-not-relevant']];
        
        const mentionedJobFunctions = allItems.filter(item => content.includes(`@${item.company_job_function.job_function}`));
        console.log("Mentioned Job Functions:", mentionedJobFunctions);
        //check for the mentioned job function in the 
        for (const jobFunction of mentionedJobFunctions) {
            jobFunction.user_comment = content; 
        }
        // update the stream state with the new benchmark titles
        const updatedBenchMarkState = {
            ...benchMarkState,
            benchmark_titles: {
                results: [
                    ...sections['highly-relevant'],
                    ...sections['needs-more-info'],
                    ...sections['definitely-not-relevant']
                ]
            }
        }
        const updatedStreamState = {
            ...newStreamState,
            benchmark_state: updatedBenchMarkState
        }
        setNewStreamState(updatedStreamState);

        // send the updated stream state to the server
        try {
            const response = await updateProject(sessionId, newStreamState.stream_id, updatedStreamState);
        }
        catch (error) {
            console.error("Error updating project with feedback:", error);
        }
    }

    const handleUpdate = useCallback((content: string) => {
        // setFeedbackContent(content);
        setFeedbackText(content);
    }, []);
    
    const handleSubmit = async (content: string) => {
        console.log("Submitted content:", content);

        handleUpdateContent(content);
        // After submission, you might want to clear the editor:

        toast.success('Feedback submitted!', {
            position: 'top-right',
            autoClose: 1000,
        });
        setFeedbackText("")
    };


    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Job Title Categorizer</h1>

            <DndContext
                sensors={sensors}
                // Use closestCorners collision detection for accurate drops
                collisionDetection={closestCorners}
                onDragStart={(event) => setActiveId(event.active.id)}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col space-y-6">
                    {sectionIds.map((sectionId) => (
                        <JobTitleList
                            key={sectionId}
                            id={sectionId}
                            title={
                                sectionId === 'highly-relevant' ? 'Highly Relevant Job Titles' :
                                    sectionId === 'needs-more-info' ? 'Needs More info Job Titles' :
                                        'Definitely not Relevant Job Titles'
                            }
                            items={sections[sectionId]}
                        />
                    ))}
                </div>

                {/* Optional: Add a DragOverlay to show a copy of the item being dragged */}
                <DragOverlay>
          {activeId ? (
            <div className="p-4 bg-white rounded-lg shadow-xl border border-blue-500 opacity-90">
              <p className="font-bold text-lg">{sections[findSection(activeId)!].find(item => item.benchmark_title_id === activeId)?.company_job_function.job_function}</p>
            </div>
          ) : null}
        </DragOverlay>
            </DndContext>

            <div className="flex-shrink-0 pt-4 mt-4 border-t border-custom-border">
                <HybridFeedbackInput
                    mentionableItems={[...sections['highly-relevant'], ...sections['needs-more-info'], ...sections['definitely-not-relevant']]}
                    onUpdate={handleUpdate}
                    onSubmit={handleSubmit}
                    key={sections['highly-relevant'].length + sections['needs-more-info'].length + sections['definitely-not-relevant'].length}
                />
                <div className="flex items-center justify-between mt-4">
                    <Button variant="link" onClick={handleStartResourcing}>
                        Skip & Start Sourcing
                    </Button>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => {
                            // update the indicies to show 4 more items
                            let added: boolean = false
                            if (highlyRelevantIndex != null && highlyRelevantIndex + 4 < allSectionsFilled['highly-relevant'].length) {
                                setHighlyRelevantIndex(highlyRelevantIndex + 4)
                                added = true
                            }
                            if (needMoreInfoIndex != null && needMoreInfoIndex + 4 < allSectionsFilled['needs-more-info'].length) {
                                setNeedMoreInfoIndex(needMoreInfoIndex + 4)
                                added = true
                            }
                            if (definitelyNotRelevantIndex != null && definitelyNotRelevantIndex + 4 < allSectionsFilled['definitely-not-relevant'].length) {
                                setDefinitelyNotRelevantIndex(definitelyNotRelevantIndex + 4)
                                added = true
                            }

                            if (!added) {
                                // show alert that we can't benchmark more
                                toast.error('No more items to benchmark!', {
                                    position: 'top-right',
                                    autoClose: 1000,
                                });

                            }

                        }}>
                            Benchmark More
                        </Button>
                        <Button onClick={handleStartResourcing}>{getButtonText()}</Button>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right" // You can change this
                autoClose={2000} // Toasts will auto-close after 2 seconds
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};
export default Screen4_BenchmarkReview;