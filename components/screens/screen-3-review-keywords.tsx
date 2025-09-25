"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"
import type { KeywordData, ReasonedKeyword } from "@/lib/data"
import { ReasoningTooltip } from "@/components/reasoning-tooltip"
import { StreamState } from "@/types/streamState"
import { ProjectState } from "@/types/project"
import { KeywordItem, Keywords } from "@/types/keywords"
import { updateProject } from "@/services/projectService"
import KeyWordComponent from "../ui/keywordComponent"

interface Screen3ReviewKeywordsProps {
  streamState: StreamState
  sessionId: string
  onApprove: () => void
  onBack: () => void
  onDataChange: (data: ProjectState) => void
}

export default function Screen3ReviewKeywords({
  streamState,
  sessionId,
  onApprove,
  onBack,
  onDataChange,
}: Screen3ReviewKeywordsProps) {
  
  const [newStreamState, setNewStreamState] = useState<StreamState>(streamState)
  const [newKeyword, setNewKeyword] = useState<{ [key: string]: string }>({})

  const functionKeyWords: KeywordItem[] = newStreamState.keywords?.list_of_keywords.filter((keyword) => keyword.category === "function") ?? []
  const knowledgeKeyWords: KeywordItem[] = newStreamState.keywords?.list_of_keywords.filter((keyword) => keyword.category === "knowledge_gap") ?? []
  const seniorityKeyWords: KeywordItem[] = newStreamState.keywords?.list_of_keywords.filter((keyword) => keyword.category === "seniority") ?? []


  const handleRemoveKeyword = async (category: string, keywordToRemove: string, componentKeyword?: string) => {
    if (!newStreamState.keywords) return
    const keyWordList: KeywordItem[] =[];
    // loop over the keywords to find the right category
    for (let i = 0; i < newStreamState.keywords.list_of_keywords.length; i++) {
      if ((newStreamState.keywords.list_of_keywords[i].category !== category) || (newStreamState.keywords.list_of_keywords[i].keyword !== keywordToRemove)) {
        keyWordList.push(newStreamState.keywords.list_of_keywords[i])    
      } else if (newStreamState.keywords.list_of_keywords[i].category === category && newStreamState.keywords.list_of_keywords[i].keyword === keywordToRemove && componentKeyword){
        // remove the component keyword from the list
        const updatedComponentKeywords = newStreamState.keywords.list_of_keywords[i].component_keywords.filter((compKeyword) => compKeyword !== componentKeyword)
        if (updatedComponentKeywords.length > 0){
          const updatedKeywordItem: KeywordItem = {
            ...newStreamState.keywords.list_of_keywords[i],
            component_keywords: updatedComponentKeywords
          }
          keyWordList.push(updatedKeywordItem)
        }
      }
    }
    
    newStreamState.keywords.list_of_keywords = keyWordList
    const newResp = await updateProject(sessionId, newStreamState.stream_id, newStreamState)
    onDataChange(newResp)
    const stream_to_set = newResp.stream_states.find(s => s.stream_id === newStreamState.stream_id)
    if (stream_to_set){
      setNewStreamState(stream_to_set)
    }
    
  }

  const handleAddKeyword = async (category: string, newKeyWord: string) => {
    if (!newStreamState.keywords) return
    if (!newKeyWord.trim()) return

    // create a new keyword item
    const newKeywordItem: KeywordItem = {
      category: category,
      keyword: newKeyWord.trim(),
      viewpoint: "Viewpoint 3: Operators",
      proof: "Manually added keyword",
      component_keywords: [
        
      ],
    }
    newStreamState.keywords.list_of_keywords.push(newKeywordItem)
    // loop over the keywords to find the right category
    
    const newResp = await updateProject(sessionId, newStreamState.stream_id, newStreamState)
    onDataChange(newResp)
    const stream_to_set = newResp.stream_states.find(s => s.stream_id === newStreamState.stream_id)
    if (stream_to_set){
      setNewStreamState(stream_to_set)
    }
  }

  

  // Fixed handleInputChange function
  const handleInputChange = (id: string, value: string) => {
    setNewKeyword(prev => ({ ...prev, [id]: value }));
  };


  // Fixed renderKeywordCard function
  const renderKeywordCard = (title: string, keyWordItems: KeywordItem[], category:string) => {
    // Guard clause to prevent rendering if the item is missing
    if (!keyWordItems || keyWordItems.length === 0) {
      return null;
    }

    
    // The rest of the component remains the same
    return (
      <Card className="border-custom-border">
        <CardHeader className="p-4">
          <CardTitle className="text-base text-text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap gap-2 mb-3">
            {keyWordItems.map((keyword: KeywordItem) => (
              <KeyWordComponent
                key={keyword.keyword}
                category={category}
                keyword={keyword}
                onRemove={handleRemoveKeyword}
              />

              // <ReasoningTooltip key={keyword.keyword} content={keyword.proof}>
              //   <Badge variant="default" className="text-sm py-1 cursor-help bg-secondary text-text-primary">
              //     {keyword.keyword}
              //     <button
              //       onClick={() => handleRemoveKeyword(keyword.category, keyword.keyword)}
              //       className="ml-1.5 rounded-full hover:bg-gray-300 p-0.5 text-text-secondary"
              //     >
              //       <X className="h-3 w-3" />
              //     </button>
              //   </Badge>
              // </ReasoningTooltip>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="+ Add keyword"
              className="h-8 text-sm"
              value={newKeyword[category] || ""}
              onChange={(e) => handleInputChange(category, e.target.value)}
              // onKeyDown={(e) => handleInputKeyDown(e, id)}
            />
            <Button size="sm" variant="outline" onClick={() => handleAddKeyword(category, newKeyword[category] || "")}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const handleApprove= async () => {
    // handle the approval
    newStreamState.status = "benchmarking_titles"
    const newResp = await updateProject(sessionId, newStreamState.stream_id, newStreamState)
    // send a request to continue the company check
    
    onDataChange(newResp)
    onApprove()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow space-y-4">
        <h2 className="text-lg font-semibold text-text-primary mb-1">Refine Search Keywords</h2>
        <p className="text-sm text-text-secondary mb-4 -mt-1">Add or remove keywords to improve search accuracy.</p>

        {/* Responsive grid layout for keyword cards */}
        <div className="grid grid-cols-1 @2xl/main:grid-cols-3 gap-4">

          {renderKeywordCard("Function Keywords", functionKeyWords!, "function")}
          {renderKeywordCard("Knowledge Gaps Keywords", knowledgeKeyWords!, "knowledge")}
          {renderKeywordCard("Seniority Keywords", seniorityKeyWords!, "seniority")}

        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Button className="w-full" onClick={handleApprove}>
          Approve & Begin Sourcing
        </Button>
        <Button variant="outline" className="w-full bg-transparent" onClick={onBack}>
          Back to Companies
        </Button>
      </div>
    </div>
  )
}
