"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import ProgressStepper from "@/components/progress-stepper"
import Screen1BriefInput from "@/components/screens/screen-1-brief-input"
import Screen1_5DecodingHub from "@/components/screens/screen-1.5-decoding-hub"
import Screen2ReviewBrief from "@/components/screens/screen-2-review-brief"
import Screen2_5ReviewCompanies from "@/components/screens/screen-2.5-review-companies"
import Screen3ReviewKeywords from "@/components/screens/screen-3-review-keywords"
import Screen4SourcingPipeline from "@/components/screens/screen-4-sourcing-pipeline"
import Screen5ReviewShortlist from "@/components/screens/screen-5-review-shortlist"
import { PromptManager } from "@/components/prompt-manager"
import { Loader2, ArrowLeft } from "lucide-react"
import {
  initialDecodedBrief,
  initialKeywords,
  initialExperts,
  initialBenchmarkData,
  secondBenchmarkData,
  type DecodingProcess,
} from "@/lib/data"
import Screen3_5BenchmarkReview from "@/components/screens/screen-5-sourcing"
import { cn } from "@/lib/utils"
import { ResizableDialog } from "@/components/resizable-dialog"
import { produce } from "immer"
import { ProjectState } from "@/types/project"
import { StreamState } from "@/types/streamState"
import { continueProject } from "@/services/projectService"

import { ToastContainer, toast } from 'react-toastify';
import Screen5_Sourcing from "@/components/screens/screen-5-sourcing"
import Screen4_BenchmarkReview from "@/components/screens/screen-4-benchmark-review"


const STEPS = ["Decode", "Companies", "Keywords", "Benchmarking", "Sourcing", "Review"]

// Mock data for prompt management

const mockGlobalSnippets = [
  {
    id: "viewpoint-def",
    name: "Viewpoint Definition",
    content: `A viewpoint represents a specific perspective or role within an industry ecosystem. 
    
Examples:
- Sellers: Companies that manufacture or provide products/services
- Buyers: Companies that purchase or consume products/services
- Regulators: Government bodies that oversee the industry
- Enablers: Companies that facilitate transactions or provide infrastructure`,
    versions: [
      {
        id: "vp-v1",
        version: "1.0",
        content: "Basic viewpoint definition...",
        author: "System",
        timestamp: "2024-01-10 09:00",
        isMain: true,
      },
    ],
    currentVersion: "1.0",
  },
  {
    id: "scoring-template",
    name: "Scoring Template",
    content: `Scoring criteria template:
1. Direct Relevance (0.4): How closely the experience matches requirements
2. Industry Experience (0.3): Experience in the target industry
3. Seniority Level (0.2): Leadership and decision-making experience
4. Geographic Relevance (0.1): Experience in target markets`,
    versions: [
      {
        id: "st-v1",
        version: "1.0",
        content: "Initial scoring template...",
        author: "System",
        timestamp: "2024-01-10 09:00",
        isMain: true,
      },
    ],
    currentVersion: "1.0",
  },
]

const createNewDecoding = (id: string, name: string, reasoning: string): DecodingProcess => ({
  id,
  name,
  reasoning,
  status: "needs-review",
  step: 1,
  brief: produce(initialDecodedBrief, (draft) => {
    if (name.includes("Sellers")) {
      draft.scoring =
        "1. Role Type (0.4): R&D, Engineering, Commercial roles.\n2. Industry (0.3): Fastener manufacturing.\n3. Seniority (0.3): Manager level and above."
    } else if (name.includes("Buyers")) {
      draft.scoring =
        "1. Role Type (0.4): Procurement, Supply Chain, Engineering roles.\n2. Industry (0.3): Aircraft Engine OEM.\n3. Seniority (0.3): Experience with component sourcing."
    }
  }),
  companies: initialDecodedBrief.companies,
  keywords: initialKeywords,
  benchmarkData: initialBenchmarkData,
  benchmarkRound: 1,
  experts: [],
  finalExpertCount: 0,
})

export default function ExpertSearchPage() {
  const [decodings, setDecodings] = useState<DecodingProcess[]>([])
  const [activeDecoding, setActiveDecoding] = useState<StreamState | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCorrectingDecodings, setIsCorrectingDecodings] = useState(false)
  const [currentBranch, setCurrentBranch] = useState("john-doe/feature-improvements")
  const [project, setProject] = useState<ProjectState | null>(null)

  const availableBranches = [
    "main",
    "john-doe/feature-improvements",
    "jane-smith/new-scoring-model",
    "team/experimental-prompts",
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsDialogOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const updateStream = (project: ProjectState) => {
    setProject(project)
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

  const handleToggleCorrection = () => {
    setIsCorrectingDecodings(!isCorrectingDecodings)
  }

  const handleApplyFeedback = (feedbackText: string) => {
    setIsLoading(true)
    setLoadingText("Applying feedback and regenerating decodings...")
    setIsCorrectingDecodings(false)

    setTimeout(() => {
      let newDecodings = [...decodings]
      const lowerFeedback = feedbackText.toLowerCase()

      const decodingsToRemove = decodings.filter(
        (d) => lowerFeedback.includes(`@${d.name}`) && lowerFeedback.includes("remove"),
      )
      if (decodingsToRemove.length > 0) {
        newDecodings = newDecodings.filter((d) => !decodingsToRemove.find((r) => r.id === d.id))
      }

      if (lowerFeedback.includes("add")) {
        const newId = `decoding-${Date.now()}`
        const newName = `New Decoding (User Feedback)`
        const newReasoning = "This decoding was generated based on direct user feedback to address a missing priority."
        newDecodings.push(createNewDecoding(newId, newName, newReasoning))
      }

      setDecodings(newDecodings)
      setIsLoading(false)
    }, 2500)
  }

  const handleStartAnalysis = (project: ProjectState) => {
    setIsLoading(true)
    setLoadingText("Initiating parallel decodings...")
    setTimeout(() => {
      const decodingsData = [
        {
          id: "decoding-1",
          name: "Priority 1: Aircraft Engine Fastener Manufacturers (Sellers)",
          reasoning:
            "Brief explicitly defines this as 'In priority' and targets the sellers/manufacturers of aircraft engine fasteners. This represents a distinct viewpoint node (Sellers) and has different role requirements (R&D, Engineering, Commercial) compared to the second request.",
        },
        {
          id: "decoding-2",
          name: "Priority 2: Aircraft Engine OEMs (Buyers)",
          reasoning:
            "Brief explicitly defines this as 'Second priority' and targets the buyers/users of fasteners within engine OEM companies. This represents a distinct viewpoint node (Buyers) and a different position in the value chain.",
        },
      ]

      const initialDecodings = decodingsData.map((d) => createNewDecoding(d.id, d.name, d.reasoning))
      setDecodings(initialDecodings)
      setIsLoading(false)
      setProject(project)
    }, 1500)
  }

  const handleStartNewDecoding = () => {
    setIsLoading(true)
    setLoadingText("Cloning and creating new variant...")
    setTimeout(() => {
      const newId = `decoding-${decodings.length + 1}`
      const newName = `Decoding Variant #${decodings.length - 1}`
      const newReasoning = "A new decoding variant to test an alternative sourcing strategy."
      const newDecoding = createNewDecoding(newId, newName, newReasoning)
      setDecodings((prev) => [...prev, newDecoding])
      // setActiveDecodingId(newId)
      setIsLoading(false)
    }, 1500)
  }

  const handleApproveBrief = async () => {
    setIsLoading(true)
    setLoadingText("Preparing Company Review...")
    try {
      const projectState = await continueProject(project?.session_id || "")
      setProject(projectState)
      updateActiveDecoding((draft) => {
        draft.step = 2
      })
      setActiveDecoding(projectState.stream_states.find(s => s.stream_id === activeDecoding?.stream_id))
    } catch (error) {
      console.error("Error continuing project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveCompanies = async () => {
    setIsLoading(true)
    
    setLoadingText("Generating Keywords...")
    try{
      const projectState = await continueProject(project?.session_id || "")
      setProject(projectState)
      updateActiveDecoding((draft) => {
        draft.step = 5
      })
      setActiveDecoding(projectState.stream_states.find(s => s.stream_id === activeDecoding?.stream_id))
    }catch(error){
      console.error("Error continuing project:", error)
    }finally{
      setIsLoading(false)
    }
  }

  const handleApproveBenchmarkTitles = async () => {
    setIsLoading(true)
    setLoadingText("Preparing Benchmark Profiles...")
    try{
      const projectState = await continueProject(project?.session_id || "")
      setProject(projectState)
      updateActiveDecoding((draft) => {
        draft.step = 4
      })
      setActiveDecoding(projectState.stream_states.find(s => s.stream_id === activeDecoding?.stream_id))
    }catch(error){
      console.error("Error continuing project:", error)
    }finally{
      setIsLoading(false)
    }
  }
  const getStepBasedOnStatus = (status: string) => {
    switch (status) {
      case "decode":
        return 1
      case "companies":
        return 2
      case "keywords":
        return 3
      case "benchmarking_titles":
        return 4
      case "benchmarking_profiles":
        return 5
      case "validation":
        return 6
      case "sourcing":
        return 7
      case "completed":
        return 8
      default:
        return 1
    }
  }

  const handleApproveKeywords = async() => {
    setIsLoading(true)
    setLoadingText("AI is preparing a benchmark sample...")
    try{

      const projectState = await continueProject(project?.session_id || "")
      setProject(projectState)
      updateActiveDecoding((draft) => {
        draft.step = 4
      })
      setActiveDecoding(projectState.stream_states.find(s => s.stream_id === activeDecoding?.stream_id))
    }catch(error){
      console.error("Error continuing project:", error)
    }finally{
      setIsLoading(false)
    }
  }

  const handleStartFullSourcing = async () => {
    setIsLoading(true)


    setLoadingText("Starting full-scale sourcing...")
    try{
        //send the request to continue the project
        const projectState = await continueProject(project?.session_id || "")
        setProject(projectState)
        updateActiveDecoding((draft) => {
          draft.step = 6
        })
        setActiveDecoding(projectState.stream_states.find(s => s.stream_id === activeDecoding?.stream_id))
    }catch(error){
      console.error("Error updating project:", error)
    
    }finally{
      setIsLoading(false)
    }

  }

  const handleRebenchmark = () => {
    setIsLoading(true)
    setLoadingText("Calibrating and preparing new benchmark...")
    setTimeout(() => {
      updateActiveDecoding((draft) => {
        draft.benchmarkData = secondBenchmarkData
        draft.benchmarkRound += 1
      })
      setIsLoading(false)
    }, 2500)
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
            onSelectDecoding={setActiveDecoding}
            isCorrecting={isCorrectingDecodings}
            onApplyFeedback={handleApplyFeedback}
          />
        )
      }
      return <Screen1BriefInput onStartAnalysis={handleStartAnalysis} />
    }
    console.log("Rendering screen for status:", activeDecoding.status)
    switch (activeDecoding.status) {
      case "decode":
        return (
          <Screen2ReviewBrief
            session_id={project?.session_id || ""}
            streamState={activeDecoding}
            onApprove={handleApproveBrief}
            onReanalyze={() => {}}
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
          onNext={() => {}}
          onRebenchmark={() => {}}
        />
      case "benchmarking_profiles":
        return <Screen4_BenchmarkReview
          sessionId={project?.session_id || ""}
          streamState={activeDecoding}
          onStartSourcing={() => { 

          }}
          onNext={() => { }}
          onRebenchmark={() => { }}
        />
      case "sourcing":
        return (
          <Screen5_Sourcing
            sessionId={project?.session_id || ""}
            streamState={activeDecoding}
            onStartSourcing={handleStartFullSourcing}
            onRebenchmark={handleRebenchmark}
          />
        )
      case "completed":
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
        return <Screen1BriefInput onStartAnalysis={handleStartAnalysis} />
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
                  <span>{activeDecoding!=null? (activeDecoding?.search_stream.stream_name + "-"): ""}{project?.session_id || "New Project"}</span>
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
            <div className="flex items-center gap-2">
              {decodings.length > 0 && !activeDecoding && (
                <Button variant="link" className="text-sm" onClick={handleToggleCorrection}>
                  {isCorrectingDecodings ? "Cancel Correction" : "Correct Decodings"}
                </Button>
              )}
            </div>
          </div>
          {activeDecoding && (
            <ProgressStepper
              steps={STEPS}
              currentStep={getStepBasedOnStatus(activeDecoding.status ?? "brief")}
              stepIndices={{ decode: 1, companies: 2, keywords: 3, benchmarking: 4, sourcing: 5, review: 6 }}
            />
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
