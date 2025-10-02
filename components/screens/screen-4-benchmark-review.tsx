"use client"

import { useMemo,useCallback, useEffect, useState } from "react"
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { Accordion } from "@/components/ui/accordion"
import { DroppableAccordionItem } from "@/components/droppable-accordion-item"
import { BenchmarkKanbanColumn } from "@/components/benchmark-kanban-column"
import type { BenchmarkCategory, JobTitleBenchmarkItem } from "@/lib/data"
import { HybridFeedbackInput } from "@/components/hybrid-feedback-input"
import { StreamState } from "@/types/streamState"
import { HighlyRelevantJobFunctionExpert } from "@/types/highlyRelevantJobFunctionExpert"
import { NeedsMoreInfoExpert } from "@/types/NeedsMoreInfoExperts"
import { JobTitleBenchmark } from "@/types/benchMarkTitles"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateProject } from "@/services/projectService"
import { BenchmarkComment } from "@/types/benchmarkComment"
import { set } from "date-fns"
import AddBenchmarkComment from "./add-benchmark-comment"


interface Screen4_BenchmarkReviewProps {
    sessionId: string,
    streamState: StreamState,
    onStartSourcing: () => void
    onNext: () => void
    onRebenchmark: () => void
}
type SectionId = 'highly-relevant' | 'needs-more-info' | 'definitely-not-relevant';

// Helper type for our state structure
type JobTitleSections = Record<SectionId, JobTitleBenchmark[]>;



const CATEGORIES = [
    { id: "highly_relevant", title: "✅ Highly Relevant" },
    { id: "needs_more_info", title: "❓ Needs More Info" },
    { id: "definitely_not_relevant", title: "❌ Not Relevant" },
] as const

export default function Screen4_BenchmarkReview({
    sessionId,
    streamState,
    onStartSourcing,
    onRebenchmark,
}: Screen4_BenchmarkReviewProps) {
    
    

    // if this item was set, then we need to show the dialog to input the reason for changing the category
    const [benchmarkComment, setBenchmarkComment] = useState<BenchmarkComment | undefined>(undefined);
    const [newStreamState, setNewStreamState] = useState<StreamState>(streamState)
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

    const [sections, setSections] = useState<JobTitleSections>(initialSections);
    const sectionIds = useMemo(() => Object.keys(sections), [sections]) as SectionId[];

    
    const handleUpdate = useCallback((content: string) => {
        // setFeedbackContent(content);
        console.log("Updated content:", content);
        
    }, []);



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
    const handleSubmit = async (content: string) => {
        console.log("Submitted content:", content);

        handleUpdateContent(content);
        // After submission, you might want to clear the editor:

        toast.success('Feedback submitted!', {
            position: 'top-right',
            autoClose: 1000,
        });
        
    };
    const totalSectionsCount = sections['highly-relevant'].length + sections['needs-more-info'].length + sections['definitely-not-relevant'].length;


    const handleStartResourcing = async () => {
        //update the status of the stream
        newStreamState.benchmark_state!.status = "profiles"
        newStreamState.status = "benchmarking_profiles"
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



    const getButtonText = () => {
        return "Apply & Benchmark Profiles";
    }
    const getSectionTitle = (sectionId: SectionId) => {
        switch (sectionId) {
            case 'highly-relevant':
                return 'Highly Relevant Job Titles';
            case 'needs-more-info':
                return 'Needs More Info Job Titles';
            case 'definitely-not-relevant':
                return 'Definitely Not Relevant Job Titles';
            default:
                return '';
        }
    }
    const getSectionFromCategory = (category: string): SectionId => {
        switch (category) {
            case 'highly_relevant':
                return 'highly-relevant';
            case 'needs_more_info':
                return 'needs-more-info';
            case 'definitely_not_relevant':
                return 'definitely-not-relevant';
            default:
                throw new Error(`Unknown category: ${category}`);
        }
    }
    const convertData = (): JobTitleBenchmarkItem[] => {
        const allData = [...sections['highly-relevant'], ...sections['needs-more-info'], ...sections['definitely-not-relevant']];
        return allData.map((item) => ({
            id: item.benchmark_title_id,
            title: item.company_job_function.job_function,
            initialCategory: item.ai_category === 'highly_relevant' ? 'relevant' : item.ai_category === 'needs_more_info' ? 'ambiguous' : 'irrelevant',
            currentCategory: item.user_category === 'highly_relevant' ? 'relevant' : item.user_category === 'needs_more_info' ? 'ambiguous' : 'irrelevant',
            company: item.company_job_function.company_name,
            reasoning: item.relevance_justification,
        }));    
    }

    




    return (
        <div>
            <div className="flex flex-col h-full">
                <div className="flex-shrink-0">
                    <p className="text-sm text-text-secondary mb-4">
                        Drag job titles to correct the AI, and use '@' to reference them in your feedback below.
                    </p>
                </div>

                {/* Responsive Layout Container */}
                {benchmarkComment ==undefined && (

                    <div>
                        <div className="flex-grow min-h-0 overflow-y-auto pr-1 -mr-3">
                            {/* Accordion View for small containers */}
                            <div className="w-full space-y-2 @md/main:hidden">
                                <Accordion type="single" collapsible defaultValue="relevant" className="w-full space-y-2">
                                    {sectionIds.map((sectionId) => (
                                        <DroppableAccordionItem
                                            key={sectionId}
                                            id={sectionId}
                                            title={getSectionTitle(sectionId)}
                                            items={sections[sectionId]}
                                            onChangeCategory={(itemId, newCategory) => {
                                                //show dialog to input the reason for changing the category
                                                console.log(`Moving item ${itemId} to category ${newCategory}`);
                                                const allItems = [...sections['highly-relevant'], ...sections['needs-more-info'], ...sections['definitely-not-relevant']];
                                                const itemToMove: JobTitleBenchmark | null = allItems.find(item => item.benchmark_title_id === itemId) || null;
                                                if (!itemToMove) {
                                                    console.error("Item to move not found!");
                                                    return
                                                }
                                                const old_category = itemToMove?.user_category || itemToMove?.ai_category;

                                                const benchmarkComment: BenchmarkComment = {
                                                    benchmarkItemId: itemId,
                                                    oldCategory: old_category!,
                                                    newCategory: newCategory,
                                                    jobTitleBenchMarkItem: itemToMove!,
                                                    //microseconds since epoch
                                                    timestamp: Date.now() * 1000,
                                                }
                                                setBenchmarkComment(benchmarkComment);
                                            }}
                                        />
                                    ))}
                                </Accordion>
                            </div>
                        </div>


                        <div className="flex-shrink-0 pt-4 mt-4 border-t border-custom-border">
                            <HybridFeedbackInput
                                mentionableItems={convertData()}
                                onUpdate={handleUpdate}
                                onSubmit={handleSubmit}
                                key={totalSectionsCount}
                            />
                            <div className="flex items-center justify-between mt-4">
                                <Button variant="link" onClick={onStartSourcing}>
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
                    </div>
                )}
                
                {benchmarkComment && (
                    <AddBenchmarkComment
                        benchmarkComment={benchmarkComment}
                        onSubmit={(comment) => {
                            // Append the new comment to the existing comments in the stream state
                            const oldCategory = comment.oldCategory;
                            const oldSectionId = getSectionFromCategory(oldCategory!);
                            const newCategory = comment.newCategory;
                        
                            const itemToMove = comment.jobTitleBenchMarkItem                            
                            if (!itemToMove) return;
                            itemToMove.user_category = newCategory;
                            itemToMove.ai_category = newCategory;
                            const updatedOldSection = sections[oldSectionId].filter(item => item.benchmark_title_id !== comment.benchmarkItemId);
                            const updatedNewSection = [...sections[getSectionFromCategory(newCategory)], itemToMove];
                            const updatedSections: JobTitleSections = {
                                ...sections,
                                [oldSectionId]: updatedOldSection,
                                [getSectionFromCategory(newCategory)]: updatedNewSection
                            }

                            setSections(updatedSections);
                            console.log("Updated Sections: High value length", updatedSections['highly-relevant'].length, "Need more info length", updatedSections['needs-more-info'].length, "Definitely not relevant length", updatedSections['definitely-not-relevant'].length);
                            // find the item in the sections and update its user_comment
                            setBenchmarkComment(undefined);

                        }}
                        onCancel={() => setBenchmarkComment(undefined)}
                    />
                )}

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
    )
}