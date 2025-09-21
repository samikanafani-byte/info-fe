import { KeywordItem } from "@/types/keywords"
import { ReasoningTooltip } from "@/components/reasoning-tooltip"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface KeywordComponentProps {
    category: string
    keyword: KeywordItem
    onRemove: (category: string, keyWordItem: string, subKeyword?: string) => void
}

const KeyWordComponent = ({ category, keyword, onRemove }: KeywordComponentProps) => {
    return (
        <div className="flex flex-wrap gap-2 mb-3">
            <ReasoningTooltip key={keyword.keyword} content={keyword.proof}>
                <Badge variant="default" className="text-sm py-1 cursor-help bg-primary text-white">
                    {keyword.keyword}
                    <button
                        onClick={() => onRemove(keyword.category, keyword.keyword)}
                        className="ml-1.5 rounded-full hover:bg-gray-300 p-0.5 text-text-secondary"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            </ReasoningTooltip>
            {keyword.component_keywords.map((compKeyword) => (
                <ReasoningTooltip key={compKeyword} content={compKeyword}>
                    <Badge variant="default" className="text-sm py-1 cursor-help bg-secondary text-text-primary">
                        {compKeyword}
                        <button
                            onClick={() => onRemove(keyword.category,keyword.keyword, compKeyword)}
                            className="ml-1.5 rounded-full hover:bg-gray-300 p-0.5 text-text-secondary"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                </ReasoningTooltip>
            ))} 
       </div>
    )
}
export default KeyWordComponent