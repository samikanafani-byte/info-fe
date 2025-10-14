"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { DecodedBrief } from "@/lib/data"
import { Edit, Loader2, Save, Search, X } from "lucide-react"
import { ReasoningTooltip } from "@/components/reasoning-tooltip"
import { StreamState } from "@/types/streamState"
import { set } from "date-fns"
import { updateProject } from "@/services/projectService"
import { ProjectState } from "@/types/project"
import Tooltip from '@mui/material/Tooltip';

interface Screen2ReviewBriefProps {
  session_id: string
  streamState: StreamState
  onApprove: () => void
  onReanalyze: () => void
  onDataChange: (data: ProjectState) => void
}
type SECTION = "brief" | "scoring" | "context_and_knowledge_gap" | "end_client_sub_sector" | "industries_of_interest" | "sub_sectors_of_interest" | "value_chain_analysis" | "desired_viewpoint_node" | "geography" | "project_logistics"
export default function Screen2ReviewBrief({
  session_id,
  streamState,
  onApprove,
  onReanalyze,
  onDataChange,
}: Screen2ReviewBriefProps) {
  const [editingSection, setEditingSection] = useState<SECTION | null>(null)
  const [editText, setEditText] = useState("")
  const [isResearching, setIsResearching] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [projectState, setProjectState] = useState<ProjectState | null>(null)

  const handleEdit = (section: SECTION, content: string) => {
    if (section === "brief"){
      streamState.search_stream.stream_summary = content
    }
      else if (section === "context_and_knowledge_gap"){
      streamState.search_stream.detailed_brief_decoding.context_and_knowledge_gap = content
    }
    else if (section === "end_client_sub_sector"){
      streamState.search_stream.detailed_brief_decoding.end_client_sub_sector = content
    }
    else if (section === "industries_of_interest"){
      streamState.search_stream.detailed_brief_decoding.industries_of_interest = content
    }
    else if (section === "sub_sectors_of_interest"){
      streamState.search_stream.detailed_brief_decoding.sub_sectors_of_interest = content
    }
    else if (section === "value_chain_analysis"){
      streamState.search_stream.detailed_brief_decoding.value_chain_analysis = content
    }
    else if (section === "desired_viewpoint_node"){
      streamState.search_stream.detailed_brief_decoding.desired_viewpoint_node = content
    }
    else if (section === "geography"){
      streamState.search_stream.detailed_brief_decoding.geography = content
    }
    else if (section === "project_logistics"){
      streamState.search_stream.detailed_brief_decoding.project_logistics = content
    }
    

    
    setEditingSection(section)
    setEditText(content)
  }

  const handleCancel = () => {
    setEditingSection(null)
    setEditText("")
  }
  const handleOnApprove = async () => {
    streamState.status = "companies"
    const newResp = await updateProject(session_id, streamState.stream_id, streamState)
    onDataChange(newResp)
    onApprove()
  }

  const handleSave = async () => {
    setLoadingSave(true)
    try{
      const newResp = await updateProject(session_id, streamState.stream_id, streamState)
    }
    catch(err){
      console.error("Failed to save updated brief:", err)
    }finally{
      setLoadingSave(false)
    }
    
  }


  const renderEditableItem = (id: SECTION, title: string, content: string) => {
    const isEditing = editingSection === id
    return (
      <AccordionItem value={id}>
        <AccordionTrigger className="text-base font-semibold hover:no-underline text-text-primary">
          <div className="flex justify-between items-center w-full">
            <span>{title}</span>
            {!isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 mr-2 text-text-secondary hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEdit(id, content)
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="min-h-[120px] text-sm border-custom-border focus:border-primary"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" /> Save
                </Button>
              </div>
            </div>
          ) : (
            <Tooltip title={id === "brief" ? streamState.search_stream.stream_summary : "This content is user-editable."} placement="right-start">
              <p className="text-sm text-text-secondary whitespace-pre-wrap cursor-help border-b border-dashed border-gray-400 inline">
                {content}
              </p>
              </Tooltip>
          )}
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <h2 className="text-lg font-semibold text-text-primary mb-1">Review Decoded Brief</h2>
        <p className="text-sm text-text-secondary mb-4">Review and edit the AI's interpretation of the brief.</p>
        <Accordion type="multiple" defaultValue={["brief", "expertise", "companies"]}>
          {renderEditableItem("brief", "Detailed Brief Decoding", streamState.search_stream.stream_summary)}
          {renderEditableItem("context_and_knowledge_gap", "Context and Knowledge Gap", streamState.search_stream.detailed_brief_decoding?.context_and_knowledge_gap ?? "N/A")}
          {renderEditableItem("end_client_sub_sector", "End Client Sub-Sector", streamState.search_stream.detailed_brief_decoding?.end_client_sub_sector ?? "N/A")}
          {renderEditableItem("industries_of_interest", "Industries of Interest", streamState.search_stream.detailed_brief_decoding?.industries_of_interest ?? "N/A")}
          {renderEditableItem("sub_sectors_of_interest", "Sub-Sectors of Interest", streamState.search_stream.detailed_brief_decoding?.sub_sectors_of_interest ?? "N/A")}
          {renderEditableItem("value_chain_analysis", "Value Chain Analysis", streamState.search_stream.detailed_brief_decoding?.value_chain_analysis ?? "N/A")}
          {renderEditableItem("desired_viewpoint_node", "Desired Viewpoint/Node", streamState.search_stream.detailed_brief_decoding?.desired_viewpoint_node ?? "N/A")}
          {renderEditableItem("geography", "Geography", streamState.search_stream.detailed_brief_decoding?.geography ?? "N/A")}
          {renderEditableItem("project_logistics", "Project Logistics", streamState.search_stream.detailed_brief_decoding?.project_logistics ?? "N/A")}
          {/* <AccordionItem value="expertise"> */}
            {/* <AccordionTrigger className="text-base font-semibold hover:no-underline text-text-primary">
              Map Needed Expertise
            </AccordionTrigger> */}
            {/* <AccordionContent>
              <ul className="list-disc pl-5 space-y-1">
                {decodedData.expertise.map((item) => (
                  <li key={item.text} className="text-sm text-text-primary">
                    <ReasoningTooltip content={item.reasoning}>
                      <span className="cursor-help border-b border-dashed border-gray-400">{item.text}</span>
                    </ReasoningTooltip>
                  </li>
                ))}
              </ul>
            </AccordionContent> */}
          {/* </AccordionItem> */}
          <AccordionItem value="companies">
            <AccordionTrigger className="text-base font-semibold hover:no-underline text-text-primary">
              Identify Companies of Interest
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-text-primary">Primary Targets</h4>
                <div className="flex flex-wrap gap-2">
                  {streamState.matching_companies_in_db?.map((c) => (
                    <ReasoningTooltip key={c} content={c}>
                      <Badge variant="outline" className="cursor-help border-custom-border text-text-primary">
                        {c}
                      </Badge>
                    </ReasoningTooltip>
                  ))}
                </div>
              </div>
 

            </AccordionContent>
          </AccordionItem>
          
        </Accordion>
      </div>
      <div className="mt-4 space-y-2">
        <Button className="w-full" onClick={handleOnApprove}>
          Approve & Review Companies
        </Button>
        <Button variant="outline" className="w-full bg-transparent" onClick={onReanalyze}>
          Re-Analyze Brief
        </Button>
      </div>
    </div>
  )
}
