"use client"

import { useCallback, useEffect, useState } from "react"
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

interface Screen4_BenchmarkReviewProps {
  sessionId: string, 
  streamState: StreamState,
  onStartSourcing: () => void
  onNext: () => void
  onRebenchmark: () => void
}


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
    const [newStreamState, setNewStreamState] = useState<StreamState>(streamState)
    const [feedbackText, setFeedbackText] = useState<string>("")
    const [submitLoading, setSubmitLoading] = useState<boolean>(false)

    const benchMarkState = newStreamState.benchmark_state;
    const highlyRelevantJobFunctions: JobTitleBenchmark[] = benchMarkState?.benchmark_titles?.results.filter((item) => item.ai_category === "highly_relevant") ?? []
    const needMoreInfoJobFunctions: JobTitleBenchmark[] = benchMarkState?.benchmark_titles?.results.filter((item) => item.ai_category === "needs_more_info") ?? []
    const definitelyNotRelevantJobFunctions: JobTitleBenchmark[] = benchMarkState?.benchmark_titles?.results.filter((item) => item.ai_category === "definitely_not_relevant") ?? []

    //initially we want to display 4 items from each category
    const [highlyRelevantIndex, setHighlyRelevantIndex] = useState<number>(4)
    const [needMoreInfoIndex, setNeedMoreInfoIndex] = useState<number>(4)
    const [definitelyNotRelevantIndex, setDefinitelyNotRelevantIndex] = useState<number>(4)

    const highlyRelevantData = highlyRelevantJobFunctions.slice(0, highlyRelevantIndex)
    const needMoreInfoData = needMoreInfoJobFunctions.slice(0, needMoreInfoIndex)
    const definitelyNotRelevantData = definitelyNotRelevantJobFunctions.slice(0, definitelyNotRelevantIndex)

    const [clearInput, setClearInput] = useState<(() => void) | null>(null);

    const [items, setItems] = useState<JobTitleBenchmarkItem[]>([
        ...highlyRelevantData.map((jobFunction, index) => ({
            id: jobFunction.benchmark_title_id,
            title: jobFunction.company_job_function.job_function,
            initialCategory: "highly_relevant",
            currentCategory: "highly_relevant",
            company: jobFunction.company_job_function.company_name,
            reasoning: jobFunction.relevance_justification,
        })),
        ...needMoreInfoData.map((jobFunction, index) => ({
            id: jobFunction.benchmark_title_id,
            title: jobFunction.company_job_function.job_function,
            initialCategory: "needs_more_info",
            currentCategory: "needs_more_info",
            company: jobFunction.company_job_function.company_name,
            reasoning: jobFunction.relevance_justification,
        })),
        ...definitelyNotRelevantData.map((jobFunction, index) => ({
            id: jobFunction.benchmark_title_id,
            title: jobFunction.company_job_function.job_function,
            initialCategory: "definitely_not_relevant",
            currentCategory: "definitely_not_relevant",
            company: jobFunction.company_job_function.company_name,
            reasoning: jobFunction.relevance_justification,
        })),
    ])

    useEffect(() => {
        
    }, [highlyRelevantIndex, needMoreInfoIndex, definitelyNotRelevantIndex])


    const handleUpdate = useCallback((content: string) => {
        // setFeedbackContent(content);
        console.log("Updated content:", content);
        setFeedbackText(content);
    }, []);



    const handleUpdateContent = async (content: string)=>{
        // get the job function that are mentioned in the content
        const mentionedJobFunctions = items.filter(item => content.includes(`@${item.title}`));
        console.log("Mentioned Job Functions:", mentionedJobFunctions);
        //check for the mentioned job function in the 
        for (const jobFunction of mentionedJobFunctions) {
            if(jobFunction.currentCategory==="highly_relevant"){
                // find it in the highly relevant array
                const found = highlyRelevantJobFunctions.find(item => item.benchmark_title_id === jobFunction.id);
                if(found){
                    found.user_comment = content;
                }                    
            }
            if(jobFunction.currentCategory==="needs_more_info"){
                // find it in the needs more info array
                const found = needMoreInfoJobFunctions.find(item => item.benchmark_title_id === jobFunction.id);
                if(found){
                    found.user_comment = content;
                }                    
            }
            if(jobFunction.currentCategory==="definitely_not_relevant"){
                // find it in the definitely not relevant array
                const found = definitelyNotRelevantJobFunctions.find(item => item.benchmark_title_id === jobFunction.id);
                if(found){
                    found.user_comment = content;
                }                    
            }
        }
        // update the stream state with the new benchmark titles
        const updatedBenchMarkState = {
            ...benchMarkState,
            benchmark_titles: {
                results: [
                    ...highlyRelevantJobFunctions,
                    ...needMoreInfoJobFunctions,
                    ...definitelyNotRelevantJobFunctions
                ]
            }
        }
        const updatedStreamState = {
            ...newStreamState,
            benchmark_state: updatedBenchMarkState 
        }
        setNewStreamState(updatedStreamState);

        // send the updated stream state to the server
        try{
            const response = await updateProject(sessionId, newStreamState.stream_id, updatedStreamState);
        }
        catch(error){
            console.error("Error updating project with feedback:", error);
        }
    }
    const handleSubmit = useCallback( async (content: string) => {
        console.log("Submitted content:", content);

        handleUpdateContent(content);
        // After submission, you might want to clear the editor:

        if (clearInput) {
            clearInput();
        }

        toast.success('Feedback submitted!', {
            position: 'top-right',
            autoClose: 1000,
        });

        setFeedbackText("")


    }, [clearInput]);





    const handleStartResourcing = async () => {
        //update the status of the stream
        newStreamState.benchmark_state!.status = "profiles"
        newStreamState.status = "benchmarking_profiles"
        try{
            setSubmitLoading(true)
            const updatedProject = await updateProject(sessionId, newStreamState.stream_id, newStreamState)
            onStartSourcing();
        }
        catch(error){
            console.error("Error updating project to start sourcing:", error);
        }
        finally{
            setSubmitLoading(false)
        }
        
    }

    

    const getButtonText = () => {
        if (benchMarkState?.status === "titles") {
            return "Apply & Benchmark Profiles";
        }else{
            return "Apply & Start Full Sourcing";
        }
    }

    const getItemsForCategory = (category: string): JobTitleBenchmarkItem[] => {
        switch (category) {
            case "highly_relevant":
                return highlyRelevantData.map((jobFunction, index) => ({
                    id: jobFunction.benchmark_title_id,
                    title: jobFunction.company_job_function.job_function,
                    initialCategory: "highly_relevant",
                    currentCategory: "highly_relevant",
                    company: jobFunction.company_job_function.company_name,
                    reasoning: jobFunction.relevance_justification,
                }));
            case "needs_more_info":
                return needMoreInfoData.map((jobFunction, index) => ({
                    id: jobFunction.benchmark_title_id,
                    title: jobFunction.company_job_function.job_function,
                    initialCategory: "needs_more_info",
                    currentCategory: "needs_more_info",
                    company: jobFunction.company_job_function.company_name,
                    reasoning: jobFunction.relevance_justification,
                }));
            case "definitely_not_relevant":
                return definitelyNotRelevantData.map((jobFunction, index) => ({
                    id: jobFunction.benchmark_title_id,
                    title: jobFunction.company_job_function.job_function,
                    initialCategory: "definitely_not_relevant",
                    currentCategory: "definitely_not_relevant",
                    company: jobFunction.company_job_function.company_name,
                    reasoning: jobFunction.relevance_justification,
                }));
            default:
                return []
        }
    }


    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id) {
          const activeItem = items.find((i) => i.id === active.id)
          const overContainerId = over.id as BenchmarkCategory

          if (activeItem && activeItem.currentCategory !== overContainerId) {
            const updatedItems = items.map((item) => {
              if (item.id === active.id) {
                return { ...item, currentCategory: overContainerId }
              }
              return item
            })
            setItems(updatedItems)
          }
        }
    }
    

  
    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex flex-col h-full">
                <div className="flex-shrink-0">
                    <p className="text-sm text-text-secondary mb-4">
                        Drag job titles to correct the AI, and use '@' to reference them in your feedback below.
                    </p>
                </div>

                {/* Responsive Layout Container */}
                <div className="flex-grow min-h-0 overflow-y-auto pr-1 -mr-3">
                    {/* Accordion View for small containers */}
                    <div className="w-full space-y-2 @md/main:hidden">
                        <Accordion type="single" collapsible defaultValue="relevant" className="w-full space-y-2">
                            {CATEGORIES.map((category) => (
                                <DroppableAccordionItem
                                    key={category.id}
                                    id={category.id}
                                    title={category.title}
                                    items={getItemsForCategory(category.id)}
                                />
                            ))}
                        </Accordion>
                    </div>

                    {/* Kanban View for large containers */}
                    <div className="hidden @md/main:grid @md/main:grid-cols-3 @md/main:gap-3 @md/main:h-full">
                        {CATEGORIES.map((category) => (
                            <BenchmarkKanbanColumn
                                key={category.id}
                                id={category.id}
                                title={category.title}
                                items={getItemsForCategory(category.id)}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-shrink-0 pt-4 mt-4 border-t border-custom-border">
                            <HybridFeedbackInput
                                mentionableItems={items}
                                onUpdate={handleUpdate}
                                onSubmit={handleSubmit}
                                
                                
                                key={items.length}
                              />
                    <div className="flex items-center justify-between mt-4">
                        <Button variant="link" onClick={onStartSourcing}>
                            Skip & Start Sourcing
                        </Button>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" onClick={()=>{
                                // update the indicies to show 4 more items
                                let added: boolean = false
                                if (highlyRelevantIndex!=null && highlyRelevantIndex + 4 < highlyRelevantJobFunctions.length) {
                                    setHighlyRelevantIndex(highlyRelevantIndex + 4)
                                    added = true
                                } 
                                if (needMoreInfoIndex!=null && needMoreInfoIndex + 4 < needMoreInfoJobFunctions.length) {
                                    setNeedMoreInfoIndex(needMoreInfoIndex + 4)
                                    added = true
                                }
                                if (definitelyNotRelevantIndex!=null && definitelyNotRelevantIndex + 4 < definitelyNotRelevantJobFunctions.length) {
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
        </DndContext>
    )
}
