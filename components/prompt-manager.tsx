"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  GitBranch,
  GitMerge,
  History,
  Copy,
  Save,
  Plus,
  ChevronDown,
  Globe,
  User,
  Lock,
  MessageSquare,
  ReplyIcon,
  Check,
  X,
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
  Zap,
  Send,
} from "lucide-react"

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
    initials: string
    color: string
  }
  content: string
  timestamp: string
  lineNumber?: number
  selection?: { start: number; end: number; text: string }
  resolved: boolean
  priority: "low" | "medium" | "high"
  replies: {
    id: string
    author: { name: string; avatar: string; initials: string; color: string }
    content: string
    timestamp: string
  }[]
  reactions: { emoji: string; users: string[] }[]
}

interface ActiveCollaborator {
  name: string
  initials: string
  color: string
  status: "active" | "idle" | "away"
  lastSeen: string
}

interface PromptVersion {
  id: string
  version: string
  content: string
  author: string
  timestamp: string
  isMain: boolean
  comments: Comment[]
}

interface GlobalSnippet {
  id: string
  name: string
  content: string
  versions: PromptVersion[]
  currentVersion: string
}

interface NodePrompt {
  id: string
  nodeName: string
  content: string
  versions: PromptVersion[]
  currentVersion: string
  globalSnippets: string[]
}

interface PromptManagerProps {
  nodeName: string
  nodePrompt: NodePrompt
  globalSnippets: GlobalSnippet[]
  currentBranch: string
  availableBranches: string[]
  onPromptUpdate: (content: string) => void
  onVersionChange: (version: string) => void
  onBranchChange: (branch: string) => void
}

// Enhanced Brain-Settings icon with collaboration indicator
const BrainSettingsIcon = ({ className, hasActivity }: { className?: string; hasActivity?: boolean }) => (
  <div className="relative">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.5 2A2.5 2.5 0 0 0 7 4.5c0 .5.1 1 .3 1.4C6.8 6.2 6.4 6.5 6 7c-.8.8-.8 2.1 0 2.8.3.3.6.5 1 .6-.1.4-.1.8 0 1.2.2 1.2 1.1 2.1 2.3 2.3.4.1.8.1 1.2 0 .1.4.3.7.6 1 .8.8 2.1.8 2.8 0 .5-.4.8-.8 1-1.4.4.2.9.3 1.4.3a2.5 2.5 0 0 0 2.5-2.5c0-1-.6-1.9-1.4-2.3.2-.4.3-.9.3-1.4A2.5 2.5 0 0 0 14.5 2" />
      <circle cx="12" cy="16" r="3" />
      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-3.5L19 10m-7 7-2.5 2.5M6.5 6.5L4 4m15 15-2.5-2.5" opacity="0.6" />
    </svg>
    {hasActivity && (
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
    )}
  </div>
)

export function PromptManager({
  nodeName,
  nodePrompt,
  globalSnippets,
  currentBranch,
  availableBranches,
  onPromptUpdate,
  onVersionChange,
  onBranchChange,
}: PromptManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("node-prompt")
  const [editingContent, setEditingContent] = useState(nodePrompt.content)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [commentPriority, setCommentPriority] = useState<"low" | "medium" | "high">("medium")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [selectedText, setSelectedText] = useState<{ start: number; end: number; text: string } | null>(null)

  const currentVersion = nodePrompt.versions.find((v) => v.id === nodePrompt.currentVersion)
  const isMainBranch = currentBranch === "main"
  const isExperimentalBranch = currentBranch.includes("experimental") || currentBranch.includes("team")

  // Mock active collaborators
  const activeCollaborators: ActiveCollaborator[] = [
    { name: "Jane Smith", initials: "JS", color: "bg-blue-500", status: "active", lastSeen: "now" },
    { name: "Mike Wilson", initials: "MW", color: "bg-green-500", status: "active", lastSeen: "2m ago" },
    { name: "Sarah Chen", initials: "SC", color: "bg-purple-500", status: "idle", lastSeen: "5m ago" },
    { name: "Alex Kumar", initials: "AK", color: "bg-orange-500", status: "away", lastSeen: "1h ago" },
  ]

  // Enhanced mock comments with better structure
  const mockComments: Comment[] = [
    {
      id: "comment-1",
      author: { name: "Jane Smith", avatar: "", initials: "JS", color: "bg-blue-500" },
      content:
        "The scoring criteria section needs more specificity. Should we break this down into sub-categories for better AI understanding?",
      timestamp: "2 hours ago",
      lineNumber: 8,
      selection: { start: 120, end: 180, text: "Create scoring criteria" },
      resolved: false,
      priority: "high",
      replies: [
        {
          id: "reply-1",
          author: { name: "John Doe", avatar: "", initials: "JD", color: "bg-gray-500" },
          content: "I'm thinking we could add industry-specific weights. Let me draft something.",
          timestamp: "1 hour ago",
        },
        {
          id: "reply-2",
          author: { name: "Mike Wilson", avatar: "", initials: "MW", color: "bg-green-500" },
          content: "Good idea. We should also consider geographic relevance as a factor.",
          timestamp: "45 minutes ago",
        },
      ],
      reactions: [
        { emoji: "🎯", users: ["John Doe", "Mike Wilson"] },
        { emoji: "💡", users: ["Sarah Chen"] },
      ],
    },
    {
      id: "comment-2",
      author: { name: "Mike Wilson", avatar: "", initials: "MW", color: "bg-green-500" },
      content: "The viewpoint definition placeholder is working well, but we might want dynamic industry context.",
      timestamp: "4 hours ago",
      resolved: false,
      priority: "medium",
      replies: [],
      reactions: [{ emoji: "👍", users: ["Jane Smith", "Alex Kumar"] }],
    },
    {
      id: "comment-3",
      author: { name: "Sarah Chen", avatar: "", initials: "SC", color: "bg-purple-500" },
      content: "Great improvement on the prompt structure! The flow is much clearer now.",
      timestamp: "1 day ago",
      resolved: true,
      priority: "low",
      replies: [
        {
          id: "reply-3",
          author: { name: "Jane Smith", avatar: "", initials: "JS", color: "bg-blue-500" },
          content: "Thanks! The user feedback really helped shape this version.",
          timestamp: "1 day ago",
        },
      ],
      reactions: [{ emoji: "✅", users: ["Jane Smith", "John Doe"] }],
    },
  ]

  const handleSave = () => {
    onPromptUpdate(editingContent)
    setIsOpen(false)
  }

  const handleVersionSelect = (version: string) => {
    onVersionChange(version)
    const selectedVersion = nodePrompt.versions.find((v) => v.id === version)
    if (selectedVersion) {
      setEditingContent(selectedVersion.content)
    }
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0)
      setSelectedText({
        start: range.startOffset,
        end: range.endOffset,
        text: selection.toString(),
      })
    }
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      console.log("Adding comment:", { content: newComment, priority: commentPriority, selection: selectedText })
      setNewComment("")
      setSelectedText(null)
      setCommentPriority("medium")
    }
  }

  const handleAddReply = (commentId: string) => {
    if (replyContent.trim()) {
      console.log("Adding reply to", commentId, ":", replyContent)
      setReplyContent("")
      setReplyingTo(null)
    }
  }

  const handleResolveComment = (commentId: string) => {
    console.log("Resolving comment:", commentId)
  }

  const handleReaction = (commentId: string, emoji: string) => {
    console.log("Adding reaction", emoji, "to comment", commentId)
  }

  const unresolvedComments = mockComments.filter((c) => !c.resolved)
  const resolvedComments = mockComments.filter((c) => c.resolved)
  const highPriorityComments = unresolvedComments.filter((c) => c.priority === "high")

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      case "low":
        return "border-l-green-500 bg-green-50"
    }
  }

  const getPriorityIcon = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-text-secondary hover:text-primary transition-colors relative"
          title={`Manage prompts for ${nodeName}`}
        >
          <BrainSettingsIcon className="h-5 w-5" hasActivity={isExperimentalBranch && unresolvedComments.length > 0} />
          {isExperimentalBranch && unresolvedComments.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white border-2 border-white shadow-lg">
              {unresolvedComments.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[95vh] bg-background-main border-0 shadow-2xl">
        <DialogHeader className="border-b border-custom-border pb-6 bg-gradient-to-r from-blue-50 to-purple-50 -m-6 mb-0 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <BrainSettingsIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl text-text-primary font-bold">Prompt Manager</DialogTitle>
                <p className="text-sm text-text-secondary mt-1">{nodeName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Active Collaborators */}
              {isExperimentalBranch && (
                <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 shadow-sm">
                  <div className="flex -space-x-2">
                    {activeCollaborators.slice(0, 4).map((collaborator) => (
                      <div key={collaborator.name} className="relative">
                        <Avatar className="h-8 w-8 border-2 border-white">
                          <AvatarFallback className={`${collaborator.color} text-white text-xs font-semibold`}>
                            {collaborator.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            collaborator.status === "active"
                              ? "bg-green-500"
                              : collaborator.status === "idle"
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-text-primary">{activeCollaborators.length} collaborators</div>
                    <div className="text-text-secondary text-xs">
                      {activeCollaborators.filter((c) => c.status === "active").length} active now
                    </div>
                  </div>
                </div>
              )}

              {/* Branch and Actions */}
              <div className="flex items-center gap-2">
                <Select value={currentBranch} onValueChange={onBranchChange}>
                  <SelectTrigger className="w-48 bg-white shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBranches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-3 w-3" />
                          {branch}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" className="bg-white shadow-sm">
                  <GitMerge className="h-4 w-4 mr-1" />
                  Merge
                </Button>
              </div>
            </div>
          </div>

          {/* Branch Status Bar */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/50">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-white shadow-sm">
                <GitBranch className="h-3 w-3 mr-1" />
                {currentBranch}
              </Badge>
              <Badge variant={isMainBranch ? "default" : "secondary"} className="shadow-sm">
                {isMainBranch ? <Lock className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                {isMainBranch ? "Protected" : "Development"}
              </Badge>
              {isExperimentalBranch && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm">
                  <Users className="h-3 w-3 mr-1" />
                  Collaborative
                </Badge>
              )}
            </div>

            {isExperimentalBranch && (
              <div className="flex items-center gap-2">
                {highPriorityComments.length > 0 && (
                  <Badge variant="destructive" className="animate-pulse">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {highPriorityComments.length} urgent
                  </Badge>
                )}
                <Button
                  variant={showComments ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowComments(!showComments)}
                  className={showComments ? "bg-primary shadow-lg" : "bg-white shadow-sm"}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comments
                  {unresolvedComments.length > 0 && (
                    <Badge className="ml-2 bg-white text-primary">{unresolvedComments.length}</Badge>
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-6 pt-6">
          {/* Main Content Area */}
          <div className={`${showComments && isExperimentalBranch ? "w-2/3" : "w-full"} transition-all duration-300`}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 bg-background-subtle">
                <TabsTrigger value="node-prompt" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Node Prompt
                </TabsTrigger>
                <TabsTrigger
                  value="global-snippets"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Global Snippets
                </TabsTrigger>
              </TabsList>

              <TabsContent value="node-prompt" className="flex-1 space-y-6 mt-6">
                {/* Version Controls */}
                <div className="flex items-center justify-between p-4 bg-background-subtle rounded-lg">
                  <div className="flex items-center gap-4">
                    <Label className="text-sm font-medium">Version:</Label>
                    <Select value={nodePrompt.currentVersion} onValueChange={handleVersionSelect}>
                      <SelectTrigger className="w-48 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {nodePrompt.versions.map((version) => (
                          <SelectItem key={version.id} value={version.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{version.version}</span>
                              {version.isMain && (
                                <Badge variant="default" className="ml-2 text-xs">
                                  Main
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {currentVersion && (
                      <div className="text-sm text-text-secondary">
                        by {currentVersion.author} • {currentVersion.timestamp}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <History className="h-4 w-4 mr-1" />
                      History
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-1" />
                      Fork
                    </Button>
                  </div>
                </div>

                {/* Prompt Editor */}
                <div className="space-y-4">
                  <Label htmlFor="prompt-content" className="text-base font-semibold">
                    Prompt Content
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="prompt-content"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      onMouseUp={handleTextSelection}
                      className="min-h-[350px] font-mono text-sm bg-white border-2 border-custom-border focus:border-primary rounded-lg p-4"
                      placeholder="Enter your prompt content here..."
                    />
                    {selectedText && isExperimentalBranch && (
                      <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                        Text selected
                      </div>
                    )}
                  </div>

                  {/* Selection Comment Box */}
                  {selectedText && isExperimentalBranch && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Comment on selection</span>
                        <Badge variant="outline" className="text-xs bg-white">
                          "{selectedText.text.substring(0, 30)}..."
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Select
                            value={commentPriority}
                            onValueChange={(value: "low" | "medium" | "high") => setCommentPriority(value)}
                          >
                            <SelectTrigger className="w-32 bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                  Low
                                </div>
                              </SelectItem>
                              <SelectItem value="medium">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3 w-3 text-yellow-500" />
                                  Medium
                                </div>
                              </SelectItem>
                              <SelectItem value="high">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-3 w-3 text-red-500" />
                                  High
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="What needs attention here?"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 bg-white"
                            onKeyDown={(e) => e.key === "Enter" && e.metaKey && handleAddComment()}
                          />
                          <Button onClick={handleAddComment} className="bg-blue-600 hover:bg-blue-700">
                            <Send className="h-4 w-4 mr-1" />
                            Comment
                          </Button>
                        </div>
                        <div className="text-xs text-blue-700">💡 Tip: Use Cmd+Enter to quickly add your comment</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Global Snippets */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Global Snippets Used</Label>
                  <div className="flex flex-wrap gap-2">
                    {nodePrompt.globalSnippets.map((snippetId) => {
                      const snippet = globalSnippets.find((s) => s.id === snippetId)
                      return snippet ? (
                        <Badge
                          key={snippetId}
                          variant="secondary"
                          className="text-sm py-1 px-3 bg-white border shadow-sm"
                        >
                          <Globe className="h-3 w-3 mr-1" />
                          {snippet.name}
                        </Badge>
                      ) : null
                    })}
                    <Button variant="outline" size="sm" className="h-8 bg-white shadow-sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Snippet
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="global-snippets" className="flex-1 space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Global Snippets</Label>
                  <Button variant="outline" size="sm" className="bg-white shadow-sm">
                    <Plus className="h-4 w-4 mr-1" />
                    New Snippet
                  </Button>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {globalSnippets.map((snippet) => (
                    <div key={snippet.id} className="bg-white border border-custom-border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-text-primary">{snippet.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            v{snippet.currentVersion}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Select value={snippet.currentVersion}>
                            <SelectTrigger className="w-20 h-8">
                              <ChevronDown className="h-3 w-3" />
                            </SelectTrigger>
                            <SelectContent>
                              {snippet.versions.map((version) => (
                                <SelectItem key={version.id} value={version.version}>
                                  v{version.version}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="text-sm text-text-secondary bg-background-subtle p-3 rounded font-mono">
                        {snippet.content.substring(0, 200)}
                        {snippet.content.length > 200 && "..."}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Comments Panel */}
          {showComments && isExperimentalBranch && (
            <div className="w-1/3 bg-gradient-to-b from-gray-50 to-white border-l-2 border-gray-200 pl-6">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary">Comments</h3>
                      <p className="text-xs text-text-secondary">
                        {unresolvedComments.length} open • {resolvedComments.length} resolved
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowComments(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                  {/* Priority Comments First */}
                  {highPriorityComments.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-semibold text-sm">Urgent ({highPriorityComments.length})</span>
                      </div>
                      {highPriorityComments.map((comment) => (
                        <CommentCard
                          key={comment.id}
                          comment={comment}
                          onResolve={handleResolveComment}
                          onReaction={handleReaction}
                          onReply={setReplyingTo}
                          replyingTo={replyingTo}
                          replyContent={replyContent}
                          setReplyContent={setReplyContent}
                          onAddReply={handleAddReply}
                        />
                      ))}
                      <Separator className="my-4" />
                    </div>
                  )}

                  {/* Other Open Comments */}
                  {unresolvedComments.filter((c) => c.priority !== "high").length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-text-primary">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-semibold text-sm">
                          Open ({unresolvedComments.filter((c) => c.priority !== "high").length})
                        </span>
                      </div>
                      {unresolvedComments
                        .filter((c) => c.priority !== "high")
                        .map((comment) => (
                          <CommentCard
                            key={comment.id}
                            comment={comment}
                            onResolve={handleResolveComment}
                            onReaction={handleReaction}
                            onReply={setReplyingTo}
                            replyingTo={replyingTo}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            onAddReply={handleAddReply}
                          />
                        ))}
                    </div>
                  )}

                  {/* Resolved Comments */}
                  {resolvedComments.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="font-semibold text-sm">Resolved ({resolvedComments.length})</span>
                      </div>
                      {resolvedComments.map((comment) => (
                        <div key={comment.id} className="bg-green-50 border border-green-200 rounded-lg p-3 opacity-75">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className={`${comment.author.color} text-white text-xs`}>
                                {comment.author.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{comment.author.name}</span>
                                <span className="text-xs text-text-secondary">{comment.timestamp}</span>
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-green-100 text-green-700 border-green-300"
                                >
                                  ✓ Resolved
                                </Badge>
                              </div>
                              <p className="text-sm text-text-primary">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="flex justify-between items-center pt-6 border-t border-custom-border bg-gradient-to-r from-gray-50 to-white -m-6 mt-0 p-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-text-secondary">
              {isExperimentalBranch ? (
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Changes sync automatically with your team</span>
                </div>
              ) : (
                "Changes will create a new version in your branch"
              )}
            </div>
            {isExperimentalBranch && unresolvedComments.length > 0 && (
              <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">
                <Clock className="h-3 w-3 mr-1" />
                {unresolvedComments.length} pending review
              </Badge>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="bg-white">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 shadow-lg">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Enhanced Comment Card Component
function CommentCard({
  comment,
  onResolve,
  onReaction,
  onReply,
  replyingTo,
  replyContent,
  setReplyContent,
  onAddReply,
}: {
  comment: Comment
  onResolve: (id: string) => void
  onReaction: (id: string, emoji: string) => void
  onReply: (id: string | null) => void
  replyingTo: string | null
  replyContent: string
  setReplyContent: (content: string) => void
  onAddReply: (id: string) => void
}) {
  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      case "low":
        return "border-l-green-500 bg-green-50"
    }
  }

  const getPriorityIcon = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-3 w-3 text-red-500" />
      case "medium":
        return <Clock className="h-3 w-3 text-yellow-500" />
      case "low":
        return <CheckCircle2 className="h-3 w-3 text-green-500" />
    }
  }

  return (
    <div className={`bg-white border-l-4 rounded-lg p-4 shadow-sm ${getPriorityColor(comment.priority)}`}>
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className={`${comment.author.color} text-white text-xs font-semibold`}>
            {comment.author.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold">{comment.author.name}</span>
            <span className="text-xs text-text-secondary">{comment.timestamp}</span>
            {getPriorityIcon(comment.priority)}
          </div>

          {comment.selection && (
            <div className="bg-blue-100 border border-blue-200 rounded px-2 py-1 mb-2">
              <span className="text-xs text-blue-700 font-mono">"{comment.selection.text}"</span>
            </div>
          )}

          <p className="text-sm text-text-primary mb-3">{comment.content}</p>

          {/* Reactions */}
          <div className="flex items-center gap-2 mb-3">
            {comment.reactions.map((reaction, idx) => (
              <Button
                key={idx}
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs bg-white border hover:bg-gray-50"
                onClick={() => onReaction(comment.id, reaction.emoji)}
              >
                {reaction.emoji} {reaction.users.length}
              </Button>
            ))}
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-gray-50">
              😊+
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(comment.id)}
              className="text-xs h-7 text-blue-600 hover:bg-blue-50"
            >
              <ReplyIcon className="h-3 w-3 mr-1" />
              Reply
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onResolve(comment.id)}
              className="text-xs h-7 text-green-600 hover:bg-green-50"
            >
              <Check className="h-3 w-3 mr-1" />
              Resolve
            </Button>
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies.map((reply) => (
        <div key={reply.id} className="ml-8 mt-3 bg-gray-50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className={`${reply.author.color} text-white text-xs`}>
                {reply.author.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium">{reply.author.name}</span>
                <span className="text-xs text-text-secondary">{reply.timestamp}</span>
              </div>
              <p className="text-xs text-text-primary">{reply.content}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Reply Input */}
      {replyingTo === comment.id && (
        <div className="ml-8 mt-3 space-y-2">
          <Textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="min-h-[60px] text-sm bg-white"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onAddReply(comment.id)} className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-3 w-3 mr-1" />
              Reply
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onReply(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
