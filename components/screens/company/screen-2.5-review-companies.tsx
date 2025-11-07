"use client"

import { useEffect} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CompanyCard } from "@/components/screens/company/components/company-card"
import { Plus } from "lucide-react"
import { StreamState } from "@/types/streamState"
import { ProjectState } from "@/types/project"
import { useCompanyReview } from "./hooks/useCompanyReview"
import { useCompanyReviewStore } from "./store/companyReviewStore"
import { StatementSync } from "node:sqlite"



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

    const { loadCompaniesData, removeCompany, addCompany, setNewCompany } = useCompanyReview(streamState, sessionId);
    const newCompany = useCompanyReviewStore((state) => state.newCompany);
    const displayCompanies = useCompanyReviewStore((state) => state.displayedCompanies);
    
    
  useEffect(() => {
    loadCompaniesData(streamState);
  }, [streamState])

  const handleRemoveCompany = async (company: string) => {
    
    await removeCompany(company);
  }
  const handleApprove = async () => {
    onApprove()
  }

  const handleAddCompany = async () => {
    addCompany(newCompany?.trim() || "");
  }
  const canAddRemoveCompany = (): boolean => {
    return streamState.benchmark_state!=null;
  }

  

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        <h2 className="text-lg font-semibold text-text-primary mb-1">Review Companies of Interest</h2>
        <p className="text-sm text-text-secondary mb-4">Curate the final list of target companies for sourcing.</p>

        <div className="space-y-6">
          <section>
            <div className="space-y-2">
              {displayCompanies?.map((company) => (
                <CompanyCard
                  canRemove={canAddRemoveCompany()}
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
            <Button size="icon" onClick={handleAddCompany} disabled={!canAddRemoveCompany()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-custom-border">
        <div className="space-y-2">
          <Button className="w-full" onClick={handleApprove}>
            Check Keywords
          </Button>
          <Button variant="outline" className="w-full bg-transparent" onClick={onBack}>
            Back to Brief Decoding
          </Button>
        </div>
      </div>
    </div>
  )
}
