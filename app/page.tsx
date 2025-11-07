"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import ProgressStepper from "@/components/progress-stepper"
import Screen1BriefInput from "@/components/screens/screen-1-brief-input"
import { Loader2, ArrowLeft } from "lucide-react"
import {
  initialDecodedBrief,
  initialKeywords,
  initialBenchmarkData,
  type DecodingProcess,
} from "@/lib/data"
import Screen3_5BenchmarkReview from "@/components/screens/screen-5-sourcing"
import { cn } from "@/lib/utils"
import { ResizableDialog } from "@/components/resizable-dialog"
import { produce } from "immer"
import { ProjectState } from "@/types/project"
import { StreamState } from "@/types/streamState"
import { continueProject, updateProject } from "@/services/projectService"

import { ToastContainer, toast } from 'react-toastify';
import Screen5_Sourcing from "@/components/screens/screen-5-sourcing"
import Screen4_BenchmarkReview from "@/components/screens/screen-4-benchmark-review"
import Screen4_5_BenchmarkProfiles from "@/components/screens/screen-4.5-benchmark-profiles"
import PreventClosing from "@/components/screens/preventClosing"
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { AcceptResponse } from "@/types/acceptResponse"

//1. Decode
//2. Companies
//3. Keywords
//4. Benchmarking 
//5. Benchmarking Profiles
//5. Sourcing
//6. Review

const STEPS = ["Decode", "Companies", "Keywords", "Benchmarking", "Sourcing", "Review"]


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


  const router = useRouter();

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

  const handleStartAnalysis = (response: AcceptResponse) => {
    setIsLoading(true)
    setLoadingText("Initiating parallel decodings...")
    
    setTimeout(() => {
      router.push(`/${response.session_id}`);
    }, 500)
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
      setIsLoading(false)
    }, 1500)
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
        return 6
      case "completed":
        return 7
      default:
        return 1
    }
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
        // return (
        //   <Screen1_5DecodingHub
        //     project_state={project}
        //     onStartNewDecoding={handleStartNewDecoding}
        //     onSelectDecoding={handleSelectDecoding}
        //     isCorrecting={isCorrectingDecodings}
        //     onApplyFeedback={handleApplyFeedback}
        //   />
          
        // )
        return <div></div>
      }
      return <Screen1BriefInput onStartAnalysis={handleStartAnalysis} />
    }
    console.log("Rendering screen for status:", activeDecoding.status)
    return <div></div>
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
          </div>
          {activeDecoding && (
            <ProgressStepper
              steps={STEPS}
              currentStep={getStepBasedOnStatus(activeDecoding.status ?? "brief")}
              stepIndices={{ decode: 1, companies: 2, keywords: 3, benchmarking: 4, sourcing: 5, review: 7 }}
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
