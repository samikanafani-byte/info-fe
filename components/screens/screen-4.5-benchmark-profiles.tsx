"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Accordion } from "@/components/ui/accordion"
import { StreamState } from "@/types/streamState"
import { JobTitleBenchmark } from "@/types/benchMarkTitles"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DroppableAccordionExpertItem } from "../droppable-accordion-expert-item"
import { ExpertHybridFeedbackInput } from "../expert-feedback-input"
import { RankedExpert } from "@/types/rankedExpert"
import { updateProject } from "@/services/projectService"

interface Screen4_5_BenchmarkProfilesProps {
  sessionId: string, 
  streamState: StreamState,
  onStartSourcing: () => void
  onNext: () => void
  onRebenchmark: () => void
}

type SectionId = 'highly-relevant' | 'needs-more-info' | 'definitely-not-relevant';


// Helper type for our state structure
type ExpertSections = Record<SectionId, RankedExpert[]>;


export default function Screen4_5_BenchmarkProfiles({ sessionId,
    streamState,
    onStartSourcing,
    onRebenchmark}: Screen4_5_BenchmarkProfilesProps) {

    const [newStreamState, setNewStreamState] = useState<StreamState>(streamState)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const benchMarkState = newStreamState.benchmark_state;
    const [submitLoading, setSubmitLoading] = useState<boolean>(false)
    const allSectionsFilled: ExpertSections = {
        'highly-relevant': benchMarkState?.expert_rank_list?.results?.filter(j => j.category === 'highly_relevant') ?? [],
        'needs-more-info': benchMarkState?.expert_rank_list?.results?.filter(j => j.category === 'needs_more_info') ?? [],
        'definitely-not-relevant': benchMarkState?.expert_rank_list?.results?.filter(j => j.category === 'definitely_not_relevant') ?? [],

    }
    const [highlyRelevantIndex, setHighlyRelevantIndex] = useState<number | null>(allSectionsFilled['highly-relevant'].length > 4 ? 4 : null)
    const [needMoreInfoIndex, setNeedMoreInfoIndex] = useState<number | null>(allSectionsFilled['needs-more-info'].length > 4 ? 4 : null)
    const [definitelyNotRelevantIndex, setDefinitelyNotRelevantIndex] = useState<number | null>(allSectionsFilled['definitely-not-relevant'].length > 4 ? 4 : null)

    const initialSections: ExpertSections = {
        'highly-relevant': highlyRelevantIndex ? allSectionsFilled['highly-relevant'].slice(0, highlyRelevantIndex) : allSectionsFilled['highly-relevant'],
        'needs-more-info': needMoreInfoIndex ? allSectionsFilled['needs-more-info'].slice(0, needMoreInfoIndex) : allSectionsFilled['needs-more-info'],
        'definitely-not-relevant': definitelyNotRelevantIndex ? allSectionsFilled['definitely-not-relevant'].slice(0, definitelyNotRelevantIndex) : allSectionsFilled['definitely-not-relevant'],
    };
    

    

    const getSectionFromCategory = (category: string): SectionId => {
        switch (category) {
            case 'highly_relevant':
                return 'highly-relevant';
            case 'needs_more_info':
                return 'needs-more-info';
            case 'definitely_not_relevant':
                return 'definitely-not-relevant';   
            default:
                return 'needs-more-info';
        }
    };
    const getSectionTitle = (sectionId: SectionId): string => {
        switch (sectionId) {
            case 'highly-relevant':
                return '✅ Highly Relevant';
            case 'needs-more-info':
                return '❓ Needs More Info';
            case 'definitely-not-relevant':
                return '❌ Definitely Not Relevant';        
            default:
                return '';
        }
    }
    


    const [sections, setSections] = useState<ExpertSections>(initialSections);
    const sectionIds = useMemo(() => Object.keys(sections), [sections]) as SectionId[];
    const totalSectionsCount = sections['highly-relevant'].length + sections['needs-more-info'].length + sections['definitely-not-relevant'].length;

    useEffect(() => {

    }, [highlyRelevantIndex, needMoreInfoIndex, definitelyNotRelevantIndex])


        const handleUpdateContent = async (content: string) => {
            // get the job function that are mentioned in the content
            const allItems = [...sections['highly-relevant'], ...sections['needs-more-info'], ...sections['definitely-not-relevant']];
    
            const mentionedExperts = allItems.filter(item => content.includes(`@${item.expert_id}`));
            console.log("Mentioned Experts:", mentionedExperts);
            //check for the mentioned expert in the 
            for (const expert of mentionedExperts) {
                expert.user_comment = content;
            }
            // update the stream state with the new benchmark titles
            const updatedBenchMarkState = {
                ...benchMarkState,
                expert_rank_list: {
                    ...benchMarkState?.expert_rank_list,
                    results: benchMarkState?.expert_rank_list?.results?.map(expert => {
                        const mentionedExpert = mentionedExperts.find(e => e.expert_id === expert.expert_id);
                        return mentionedExpert ? { ...expert, user_comment: mentionedExpert.user_comment } : expert;
                    })
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
    const handleStartResourcing = async () => {
        //update the status of the stream
        newStreamState.benchmark_state!.status = "completed"
        newStreamState.status = "validation"
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


        return (
            <div>
                <div className="flex flex-col h-full">
                    <div className="flex-shrink-0">
                        <p className="text-sm text-text-secondary mb-4">
                            Drag experts to correct the AI, and use '@' to reference them in your feedback below.
                        </p>
                    </div>
    
                    {/* Responsive Layout Container */}
                    <div className="flex-grow min-h-0 overflow-y-auto pr-1 -mr-3">
                        {/* Accordion View for small containers */}
                        <div className="w-full space-y-2 @md/main:hidden">
                            <Accordion type="single" collapsible defaultValue="relevant" className="w-full space-y-2">
                                {sectionIds.map((sectionId) => (
                                    <DroppableAccordionExpertItem
                                        key={sectionId}
                                        id={sectionId}
                                        title={getSectionTitle(sectionId)}
                                        items={sections[sectionId]}
                                        onChangeCategory={(itemId, newCategory) => {
                                            console.log(`Moving item ${itemId} to category ${newCategory}`);
                                            const allItems = [...sections['highly-relevant'], ...sections['needs-more-info'], ...sections['definitely-not-relevant']];
                                            const itemToMove: RankedExpert| null  = allItems.find(item => item.expert_id === itemId) || null;
                                            const old_category = itemToMove?.category;
                                            //remove the item from the old category list
                                            const oldSectionId = getSectionFromCategory(old_category!);
                                            if (!itemToMove) return;
                                            itemToMove.category = newCategory;
                                            const updatedOldSection = sections[oldSectionId].filter(item => item.expert_id !== itemId);
                                            const updatedNewSection = [...sections[getSectionFromCategory(newCategory)], itemToMove];
                                            const updatedSections: ExpertSections = {
                                                ...sections,
                                                [oldSectionId]: updatedOldSection,
                                                [getSectionFromCategory(newCategory)]: updatedNewSection
                                            }
                                            
                                            setSections(updatedSections);
                                            console.log("Updated Sections: High value length", updatedSections['highly-relevant'].length, "Need more info length", updatedSections['needs-more-info'].length, "Definitely not relevant length", updatedSections['definitely-not-relevant'].length);
                                        }}
                                    />
                                ))}
                            </Accordion>
                        </div>
                    </div>
    
    
                    <div className="flex-shrink-0 pt-4 mt-4 border-t border-custom-border">
                        <ExpertHybridFeedbackInput
                            mentionableItems={benchMarkState?.expert_rank_list?.results || []}
                            onUpdate={()=>{}}
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
                                <Button onClick={handleStartResourcing}>Apply & Start Full Sourcing</Button>
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
            </div>
        )

        
}