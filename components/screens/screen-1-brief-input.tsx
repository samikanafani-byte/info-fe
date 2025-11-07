"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ProjectState } from "@/types/project"
import { createProject } from "@/services/projectService"
import { AcceptResponse } from "@/types/acceptResponse"
import { Switch } from "../ui/switch"

interface Screen1BriefInputProps {
  onStartAnalysis: (project: AcceptResponse) => void
}

export default function Screen1BriefInput({ onStartAnalysis }: Screen1BriefInputProps) {
  const [brief, setBrief] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [skipBenchmarking, setSkipBenchmarking] = useState(true)

  const handleStart = async () => {
    if (brief.trim()) {
      setError(null)
      setIsLoading(true)
      try{
        const project =  await createProject(brief, skipBenchmarking);
        onStartAnalysis(project)
        
      } catch (error) {
        console.error("Error creating project:", error)
        setError("Failed to create project. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex flex-row justify-between">
          <h2 className="text-lg font-semibold text-text-primary mb-2">Project Brief</h2>
        </div>
        
        <p className="text-sm text-text-secondary mb-4">Paste the project brief below to begin the AI analysis.</p>
        
        <Textarea
          placeholder="Paste project brief here..."
          className="h-full min-h-[300px] resize-none border-custom-border focus:border-primary"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        />
        
      </div>
      <div className="mt-4">
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <div className="flex flex-row justify-end py-2 ">
          <p className="text-sm px-2">Skip benchmarking</p>
          <Switch checked={skipBenchmarking} onCheckedChange={setSkipBenchmarking} />
        </div>

        <Button className="w-full flex items-center justify-center" onClick={handleStart} disabled={!brief.trim() || isLoading}>
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          ) : null}
          Start Analysis
        </Button>
      </div>
    </div>
  )
}
