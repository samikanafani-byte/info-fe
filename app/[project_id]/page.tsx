// app/[project_id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

import Screen1_5DecodingHub from "@/components/screens/screen-1.5-decoding-hub"
import Screen2ReviewBrief from "@/components/screens/screen-2-review-brief"
import Screen2_5ReviewCompanies from "@/components/screens/screen-2.5-review-companies"
import Screen3ReviewKeywords from "@/components/screens/screen-3-review-keywords"
import Screen5ReviewShortlist from "@/components/screens/review/screen-5-review-shortlist"
import { Loader2, ArrowLeft } from "lucide-react"
import {
    initialExperts,
    secondBenchmarkData,
    type DecodingProcess,
} from "@/lib/data"
import { cn } from "@/lib/utils"
import { ResizableDialog } from "@/components/resizable-dialog"
import { produce } from "immer"
import { ProjectState } from "@/types/project"
import { canSelectPage, StreamState } from "@/types/streamState"
import { continueProject, getProject, updateProject } from "@/services/projectService"

import { ToastContainer, toast } from 'react-toastify';
import Screen4_BenchmarkReview from "@/components/screens/screen-4-benchmark-review"
import Screen4_5_BenchmarkProfiles from "@/components/screens/screen-4.5-benchmark-profiles"
import PreventClosing from "@/components/screens/preventClosing"
import AppThoughtChain from "@/components/ui/app-thought-chain"
import StreamTextComponent from "@/components/ui/stream-text-component"
import { useMainPage } from "./hooks/useMainPage"
import { useMainPageStore } from "./store/mainPageStore"

// Define the expected structure for the component's props
interface ProjectPageProps {
    params: {
        project_id: string; // The name must match the folder name: [project_id]
    };
}

export default function ContinueProjectPage({ params }: ProjectPageProps) {
    // Extract the project ID from the params
    const { project_id } = params;
    const activeDecoding = useMainPageStore((state) => state.activeDecoding);
    const project = useMainPageStore((state) => state.project);
    
    const { setIsLoading, setLoadingText,setProject, setIsDialogOpen, handleLoadProject, setActiveDecoding,setCurrentPage } = useMainPage(project_id);

    const isLoading = useMainPageStore((state) => state.isLoading);
    const [decodings, setDecodings] = useState<DecodingProcess[]>([])
    const loadingText = useMainPageStore((state) => state.loadingText);
    const isCorrectingDecodings = useMainPageStore((state) => state.isCorrectingDecodings);
    const isDialogOpen = useMainPageStore((state) => state.isDialogOpen);
    const currentPage = useMainPageStore((state) => state.currentPage);   
    


    useEffect(() => {
        handleLoadProject();
    }, [project_id]);


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault()
                setIsDialogOpen(!isDialogOpen)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    useEffect(() => {
        //rerender when project changes
        //update the active decoding
        if(!project || !project.stream_states) return
        const streamState = project.stream_states.find((s) => s.stream_id === activeDecoding?.stream_id)
        if (streamState) {
            setActiveDecoding(streamState)
        }
    }, [project])

    const updateStream = (project: ProjectState) => {
        setProject(project)
        if(project.stream_states===undefined) return
        const streamState = project.stream_states.find((s) => s.stream_id === activeDecoding?.stream_id)
        if (streamState) {
            setActiveDecoding(streamState)
        }
    }

    const updateActiveDecoding = (updater: (draft: DecodingProcess) => void) => {
        if (!activeDecoding) return
        setDecodings((currentDecodings) =>
            produce(currentDecodings, (draft) => {
                const decodingToUpdate = draft.find((d) => d.id === activeDecoding.stream_id)
                if (decodingToUpdate) {
                    updater(decodingToUpdate)
                }
            }),
        )
    }


    const handleApproveBrief = async () => {
        setIsLoading(true)
        setLoadingText("Preparing Company Review...")
        try {
            const projectState = await continueProject(project?.session_id || "")
            //move to next page
            setCurrentPage("companies")


            // updateActiveDecoding((draft) => {
            //     draft.step = 2
            // })
            // if(projectState.stream_states===undefined) return
            // setActiveDecoding(projectState.stream_states.find(s => s.stream_id === activeDecoding?.stream_id))
        } catch (error) {
            console.error("Error continuing project:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleApproveCompanies = async () => {
        setIsLoading(true)
        setLoadingText("Moviing to keywords...")
        try {
            setCurrentPage("keywords")
        } catch (error) {
            console.error("Error continuing project:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleApproveBenchmarkTitles = async () => {
        setIsLoading(true)
        setLoadingText("Preparing Benchmark Profiles...")
        try {
            const projectState = await continueProject(project?.session_id || "")
            setCurrentPage("benchmarking_profiles")
        } catch (error) {
            console.error("Error continuing project:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleApproveExperts = async () => {
        setIsLoading(true)
        setLoadingText("Starting the sourcing process...")
        try {
            const projectState = await continueProject(project?.session_id || "")
            setCurrentPage("sourcing")
        } catch (error) {
            console.error("Error continuing project:", error)
        } finally {
            setIsLoading(false)
        }
    }


    const handleApproveKeywords = async () => {
        setIsLoading(true)
        setLoadingText("AI is preparing a benchmark sample...")
        try {

            const projectState = await continueProject(project?.session_id || "")
            setCurrentPage("benchmarking_titles")
            
        } catch (error) {
            console.error("Error continuing project:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStartFullSourcing = async () => {
        setIsLoading(true)


        setLoadingText("Starting full-scale sourcing...")
        try {
            //send the request to continue the project
            const projectState = await continueProject(project?.session_id || "")
            
            // setProject(projectState)
            // updateActiveDecoding((draft) => {
            //     draft.step = 6
            // })
            // if (projectState.stream_states === undefined) return
            // setActiveDecoding(projectState.stream_states.find(s => s.stream_id === activeDecoding?.stream_id))
        } catch (error) {
            console.error("Error updating project:", error)

        } finally {
            setIsLoading(false)
        }

    }


    const handleViewResults = () => {
        setIsLoading(true)
        setLoadingText("Finalizing expert list...")
        setTimeout(() => {
            updateActiveDecoding((draft) => {
                draft.step = 6
                draft.status = "completed"
                draft.finalExpertCount = initialExperts.length
                draft.experts = initialExperts
            })
            setIsLoading(false)
        }, 1000)
    }

    const handleStartNewDecoding = () => {
        setIsLoading(true)
        setLoadingText("Cloning and creating new variant...")
        setTimeout(() => {
            const newId = `decoding-${decodings.length + 1}`
            const newName = `Decoding Variant #${decodings.length - 1}`
            const newReasoning = "A new decoding variant to test an alternative sourcing strategy."
        }, 1500)
    }


    const handleSelectDecoding = async (decoding: StreamState) => {
        //patch the stream_state to make the status decode
        
        if(decoding.status==="initial"){
            decoding.status = "decode"
        }
        try {
            const newResp = await updateProject(project?.session_id || "", decoding.stream_id, decoding)
            if (newResp.stream_states === undefined) return
            const stream_to_set = newResp.stream_states.find(s => s.stream_id === decoding.stream_id)
            setActiveDecoding(stream_to_set)
        }
        catch (error) {
            console.error("Error updating project:", error)
        }
    }
    const handleApplyFeedback = (feedbackText: string) => {
        setIsLoading(false)
        setLoadingText("Applying feedback and regenerating decodings...")
    }



    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-lg font-medium text-text-primary">{loadingText}</p>
                </div>
            )
        }

        if (!activeDecoding) {
            if (project) {
                return (
                    <Screen1_5DecodingHub
                        project_state={project}
                        onStartNewDecoding={handleStartNewDecoding}
                        onSelectDecoding={handleSelectDecoding}
                        isCorrecting={isCorrectingDecodings}
                        onApplyFeedback={handleApplyFeedback}
                    />
                )
            }
            return <div></div>
        }
        

        switch (currentPage){
            case "decode":
                return (
                    <Screen2ReviewBrief
                        session_id={project?.session_id || ""}
                        streamState={activeDecoding}
                        onApprove={handleApproveBrief}
                        onReanalyze={() => { }}
                        onDataChange={(data) => updateStream(data)}
                    />
                )
            case "companies":
                return (
                    <Screen2_5ReviewCompanies
                        sessionId={project?.session_id || ""}
                        streamState={activeDecoding}
                        onApprove={handleApproveCompanies}
                        onBack={() => updateActiveDecoding((d) => (d.step = 2))}
                        onDataChange={(data) => updateStream(data)}
                    />
                )
            case "keywords":
                return (
                    <Screen3ReviewKeywords
                        sessionId={project?.session_id || ""}
                        streamState={activeDecoding}
                        onApprove={handleApproveKeywords}
                        onBack={() => updateActiveDecoding((d) => (d.step = 2))}
                        onDataChange={(data) => updateStream(data)}
                    />
                )
            case "benchmarking_titles":
                return <Screen4_BenchmarkReview
                    sessionId={project?.session_id || ""}
                    streamState={activeDecoding}
                    onStartSourcing={() => {
                        handleApproveBenchmarkTitles()
                    }}
                    onNext={() => { }}
                    onRebenchmark={() => { }}
                />
            case "benchmarking_profiles":   
                return <Screen4_5_BenchmarkProfiles
                    sessionId={project?.session_id || ""}
                    streamState={activeDecoding}
                    onStartSourcing={() => {
                        handleApproveExperts()      
                    }}
                    onNext={() => { }}
                    onRebenchmark={() => { }}
                />
            
            case "sourcing":
                return (
                    <Screen5ReviewShortlist
                        streamState={activeDecoding}
                        sessionId={project?.session_id || ""}
                        onStartNewSearch={() => {
                                setActiveDecoding(undefined)
                            }}
                />
                )
            default:
                return <div></div>
        }
    }

    const isAgentActive = decodings.some((d) => d.status === "in-progress")

    const getButtonContent = () => {
        if (isAgentActive) {
            return (
                <>
                    <span className="relative flex h-3 w-3 mr-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-foreground/90"></span>
                    </span>
                    AI Agent Running..
                </>
            )
        }
        if (decodings.length > 0) {
            return "View Decoding Hub"
        }
        return "Open Expert Search"
    }

    return (
        <div className="bg-background-subtle min-h-screen flex items-center justify-center font-sans">
            <PreventClosing shouldConfirmLeave={true} />
            <ResizableDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                trigger={
                    <Button size="lg" className={cn("relative overflow-visible", isAgentActive && "shadow-lg shadow-primary/20")}>
                        {isAgentActive && <div className="absolute top-0 right-0 bottom-0 left-0 animate-pulse-glow rounded-md" />}
                        {getButtonContent()}
                    </Button>
                }
            >
                <header className="p-4 border-b border-custom-border flex-shrink-0 cursor-move" data-drag-handle="true">
                    <div className="flex items-center justify-between pr-20">
                        <div className="flex items-center gap-2">
                            {activeDecoding && (
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setActiveDecoding(undefined)}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            )}
                            <h1 className="text-xl font-bold text-text-primary">
                                <span className="flex items-center gap-2">
                                    <span>{activeDecoding != null ? (activeDecoding?.search_stream.stream_name + "-") : project?.project_name ?? "" }{project?.session_id || "New Project"}</span>
                                    {project?.session_id && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-12 w-12 p-0"
                                            title="Copy Session ID"
                                            onClick={() => {
                                                navigator.clipboard.writeText(project.session_id)
                                                toast.success('Successfully copied to clipboard!', {
                                                    position: 'top-right',
                                                    autoClose: 2000,
                                                });
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-muted-foreground"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" />
                                                <rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" />
                                            </svg>
                                        </Button>
                                    )}
                                </span>
                            </h1>
                        </div>
                    </div>
                    {activeDecoding && (
                        <div className="flex flex-col ">
                        <div className="flex items-center justify-center">
                        <AppThoughtChain 
                        streamState={activeDecoding} onClick={(item, index) => {
                            console.log(`Clicked on item ${index}:`, item.key);
                            if(!item.key) return;
                            if(canSelectPage(activeDecoding, item.key)){
                                setCurrentPage(item.key);
                            }
                        }} 
                        
                        />
                        </div>
                            <StreamTextComponent streamState={activeDecoding} />
                        </div>
                    )}
                </header>
                <main className="flex-grow p-4 overflow-y-auto @container/main">{renderContent()}</main>
            </ResizableDialog>

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
