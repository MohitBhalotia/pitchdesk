"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Calendar,
  User,
  Bot,
  BarChart3,
  Search,
  Edit,
  Trash2,
  Save,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  role: "user" | "bot"
  content: string
  timestamp: string
}

interface Pitch {
  _id: string
  title: string
  duration: number
  conversationHistory: Message[]
  createdAt: string
  updatedAt: string
}

export default function PitchTranscripts() {
  const [pitches, setPitches] = useState<Pitch[]>([])
  const [expandedPitches, setExpandedPitches] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingPitchId, setEditingPitchId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [updatingTitle, setUpdatingTitle] = useState(false)
  const [deletingPitchId, setDeletingPitchId] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    const fetchPitches = async () => {
      if (status === "loading") return
      
      if (!session?.user?._id) {
        console.log("[PitchTranscripts] No user session or user id found")
        setIsLoading(false)
        return
      }

      try {
        console.log("[PitchTranscripts] Fetching pitches for user:", session.user._id)
        const response = await fetch(`/api/my-pitches`)
        if (!response.ok) {
          throw new Error('Failed to fetch pitches')
        }
        const data = await response.json()
        
        const pitchesData = Array.isArray(data) ? data : data.pitches || data.data || []
        setPitches(pitchesData)
        
        console.log("[PitchTranscripts] Fetched pitches:", pitchesData.length)
      } catch (error) {
        console.error('Error fetching pitches:', error)
        setPitches([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPitches()
  }, [session, status])

  const togglePitchExpansion = (pitchId: string) => {
    const newExpanded = new Set(expandedPitches)
    if (newExpanded.has(pitchId)) {
      newExpanded.delete(pitchId)
    } else {
      newExpanded.add(pitchId)
    }
    setExpandedPitches(newExpanded)
  }

  const handleEvaluatePitch = (pitchId: string) => {
    router.push(`/evaluation/${pitchId}`)
  }

  // Search functionality
  const filteredPitches = pitches.filter(pitch =>
    pitch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pitch.conversationHistory.some(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Edit title functionality
  const startEditing = (pitch: Pitch) => {
    setEditingPitchId(pitch._id)
    setEditTitle(pitch.title)
  }

  const cancelEditing = () => {
    setEditingPitchId(null)
    setEditTitle("")
  }

  const updatePitchTitle = async (pitchId: string, newTitle: string) => {
    try {
      setUpdatingTitle(true)
      const response = await fetch(`/api/my-pitches`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          pitchId, 
          title: newTitle 
        }),
      })

      if (response.ok) {
        setPitches(pitches.map(pitch => 
          pitch._id === pitchId 
            ? { ...pitch, title: newTitle }
            : pitch
        ))
        setEditingPitchId(null)
        setEditTitle("")
      } else {
        console.error('Failed to update pitch title')
      }
    } catch (error) {
      console.error('Error updating pitch title:', error)
    } finally {
      setUpdatingTitle(false)
    }
  }

  const saveTitle = (pitchId: string) => {
    if (editTitle.trim()) {
      updatePitchTitle(pitchId, editTitle.trim())
    } else {
      cancelEditing()
    }
  }

  // Delete functionality
  const deletePitch = async (pitchId: string) => {
    try {
      setDeletingPitchId(pitchId)
      const response = await fetch(`/api/my-pitches`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pitchId }),
      })

      if (response.ok) {
        setPitches(pitches.filter(p => p._id !== pitchId))
        setDeletingPitchId(null)
      } else {
        console.error('Failed to delete pitch')
      }
    } catch (error) {
      console.error('Error deleting pitch:', error)
    } finally {
      setDeletingPitchId(null)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getUserDisplayName = () => {
    if (!session?.user) return ""
    return (session.user as any).fullName || session.user.email || session.user.name || "User"
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">Please log in to view your pitch transcripts</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pitch Transcripts</h1>
            <p className="text-muted-foreground">Review your conversation history</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Welcome, {getUserDisplayName()}</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by title or conversation content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <Badge variant="secondary" className="px-4 py-2">
            {filteredPitches.length} {filteredPitches.length === 1 ? 'Pitch' : 'Pitches'}
          </Badge>
          {searchTerm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="ml-2"
            >
              Clear Search
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPitches.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">
                  {searchTerm ? 'No matching pitches found' : 'No pitch transcripts found'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Start a new pitch conversation to see it here'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredPitches.map((pitch, i) => {
              const isExpanded = expandedPitches.has(pitch._id)
              const conversationHistory = pitch.conversationHistory || []
              const isEditing = editingPitchId === pitch._id
              const isDeleting = deletingPitchId === pitch._id

              return (
                <Card key={pitch._id} className="overflow-hidden group">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {isEditing ? (
                            <div className="flex items-center gap-2 flex-1">
                              <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Enter pitch title..."
                                className="text-lg font-semibold h-8 flex-1 max-w-md"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveTitle(pitch._id)
                                  if (e.key === 'Escape') cancelEditing()
                                }}
                              />
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => saveTitle(pitch._id)}
                                  disabled={updatingTitle || !editTitle.trim()}
                                  className="h-8 px-2"
                                >
                                  {updatingTitle ? (
                                    <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full" />
                                  ) : (
                                    <>
                                      <Save className="h-3 w-3 mr-1" />
                                      Save
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={cancelEditing}
                                  className="h-8 px-2"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <CardTitle className="text-xl flex items-center gap-2">
                                {pitch.title}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditing(pitch)}
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Edit title"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </CardTitle>
                            </>
                          )}
                        </div>
                        
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(pitch.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDuration(pitch.duration || 0)}
                          </span>
                          <Badge variant="outline">
                            {conversationHistory.length} messages
                          </Badge>
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Action Buttons */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEvaluatePitch(pitch._id)}
                          className="flex items-center gap-2"
                        >
                          <BarChart3 className="h-4 w-4" />
                          Evaluate
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePitch(pitch._id)}
                          disabled={isDeleting}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 flex items-center gap-1"
                        >
                          {isDeleting ? (
                            <div className="animate-spin h-3 w-3 border border-destructive border-t-transparent rounded-full" />
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </>
                          )}
                        </Button>

                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => togglePitchExpansion(pitch._id)}
                          className="flex items-center gap-1"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-4 w-4" />
                              Collapse
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4" />
                              Expand
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent className="pt-0">
                      <div className="border-t pt-4">
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-4">
                            {conversationHistory.map((msg, idx) => (
                              <div
                                key={idx}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-lg rounded-xl p-4 relative ${
                                    msg.role === "user"
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className={`rounded-full p-1 ${
                                      msg.role === "user" 
                                        ? "bg-primary-foreground/20" 
                                        : "bg-muted-foreground/20"
                                    }`}>
                                      {msg.role === "user" ? (
                                        <User className="h-3 w-3" />
                                      ) : (
                                        <Bot className="h-3 w-3" />
                                      )}
                                    </div>
                                    <span className="text-xs font-medium capitalize">
                                      {msg.role}
                                    </span>
                                    <span className={`text-xs ml-4 ${
                                      msg.role === "user" 
                                        ? "text-primary-foreground/70" 
                                        : "text-muted-foreground"
                                    }`}>
                                      {new Date(msg.timestamp).toLocaleTimeString([], { 
                                        hour: "2-digit", 
                                        minute: "2-digit" 
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-sm">{msg.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}