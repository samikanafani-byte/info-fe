"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CompanyCard } from "@/components/company-card"
import { Plus } from "lucide-react"
import type { Company } from "@/lib/data"
import { StreamState } from "@/types/streamState"
import { CompanyState, createEmptyCompanyState } from "@/types/companyState"

import { ProjectState } from "@/types/project"
import { updateProject } from "@/services/projectService"



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

  const handleRemoveCompany = async (company: string) => {
    const updatedCompanies = {
      ...streamState,
      matching_companies_in_db: streamState.matching_companies_in_db?.filter((c) => c !== company) || [],
      status: "validation"
    }
    try{
    
      const newResp = await updateProject(sessionId, updatedCompanies.stream_id, updatedCompanies)
      onDataChange(newResp)
    }catch(error){
      console.error("Error updating project:", error)
    }
  }

  const handleAddCompany = async () => {
    if (newCompany.trim()) {
      // const newCompanyState = createEmptyCompanyState(newCompany.trim(), streamState.search_stream.stream_summary, streamState.search_stream.detailed_brief_decoding, streamState.keywords)
      try{
        //append the new company state to the existing array
        const updatedCompanies = {
          ...streamState,
          matching_companies_in_db: [...(streamState.matching_companies_in_db || []), newCompany.trim()],
          status: "validation"
        }
        const newResp = await updateProject(sessionId, streamState.stream_id, updatedCompanies)
        onDataChange(newResp)
        
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
            <h3 className="text-base font-semibold text-text-primary mb-3">Primary Targets</h3>
            <div className="space-y-2">
              {streamState.matching_companies_in_db?.map((company) => (
                <CompanyCard
                  key={company}
                  company={company}
                  onRemove={() => handleRemoveCompany(company)}
                />
              ))}
            </div>
          </section>

          {/* <section>
            <h3 className="text-base font-semibold text-text-primary mb-3">Secondary & Researched Targets</h3>
            <div className="space-y-2">
              {companies.secondary.map((company) => (
                <CompanyCard
                  key={company.name}
                  company={company}
                  onRemove={() => handleRemoveCompany(company.name, "secondary")}
                />
              ))}
            </div>
          </section> */}
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
          <Button className="w-full" onClick={onApprove}>
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
