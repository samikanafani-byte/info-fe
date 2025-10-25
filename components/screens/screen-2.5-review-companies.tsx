"use client"

import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CompanyCard } from "@/components/company-card"
import { Plus } from "lucide-react"
import type { Company } from "@/lib/data"
import { getMatchingCompaniesFiltered, StreamState } from "@/types/streamState"
import { CompanyState, createEmptyCompanyState } from "@/types/companyState"

import { ProjectState } from "@/types/project"
import { updateProject } from "@/services/projectService"
import { set } from "date-fns"



interface Screen2_5ReviewCompaniesProps {
  sessionId: string
  streamState: StreamState
  onApprove: () => void
  onBack: () => void
  onDataChange: (data: ProjectState) => void
}

export default function Screen2_5ReviewCompanies({
  sessionId,
streamState,
  onApprove,
  onBack,
  onDataChange,
}: Screen2_5ReviewCompaniesProps) {
  const [newCompany, setNewCompany] = useState("")
  const [newStreamState, setNewStreamState] = useState<StreamState>(streamState)

  useEffect(() => {
    setNewStreamState(streamState)
  }, [streamState])

  const handleRemoveCompany = async (company: string) => {
    const updatedCompanies = {
      ...newStreamState,
      matching_companies_in_db: newStreamState.matching_companies_in_db?.filter((c) => c !== company) || [],
    }
    try{
      const newResp = await updateProject(sessionId, updatedCompanies.stream_id, updatedCompanies)
      onDataChange(newResp)
      const stream_to_set = newResp?.stream_states?.find(s => s.stream_id === newStreamState.stream_id)
      if (stream_to_set){
        setNewStreamState(stream_to_set)
      } 
    }catch(error){
      console.error("Error updating project:", error)
    }
  }
  const handleApprove = async () => {
    
    // const newResp = await updateProject(sessionId, newStreamState.stream_id, newStreamState)
    // onDataChange(newResp)
    onApprove()
  }

  const handleAddCompany = async () => {
    if (newCompany.trim()) {
      try{
        //append the new company state to the existing array
        const updatedCompanies = {
          ...newStreamState,
          matching_companies_in_db: [...(newStreamState.matching_companies_in_db || []), newCompany.trim()],
        }
        const newResp = await updateProject(sessionId, newStreamState.stream_id, updatedCompanies)
        onDataChange(newResp)
        const stream_to_set = newResp?.stream_states?.find(s => s.stream_id === newStreamState.stream_id)
        if (stream_to_set) {
          setNewStreamState(stream_to_set)
        } 
        
      }catch(error){
        console.error("Error updating project:", error)
      }
      
      setNewCompany("")
    }
  }

  

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        <h2 className="text-lg font-semibold text-text-primary mb-1">Review Companies of Interest</h2>
        <p className="text-sm text-text-secondary mb-4">Curate the final list of target companies for sourcing.</p>

        <div className="space-y-6">
          <section>
            <div className="space-y-2">
              {getMatchingCompaniesFiltered(newStreamState)?.map((company) => (
                <CompanyCard
                  key={company}
                  company={company}
                  onRemove={() => handleRemoveCompany(company)}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 pt-4 border-t border-custom-border">
          <p className="text-sm font-medium text-text-primary mb-2">Add a company manually</p>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter company name"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCompany()}
            />
            <Button size="icon" onClick={handleAddCompany}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-custom-border">
        <div className="space-y-2">
          <Button className="w-full" onClick={handleApprove}>
            Approve Companies & Generate Keywords
          </Button>
          <Button variant="outline" className="w-full bg-transparent" onClick={onBack}>
            Back to Brief Decoding
          </Button>
        </div>
      </div>
    </div>
  )
}
