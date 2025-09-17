"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ChevronDown, 
  ChevronUp, 
  Sun, 
  Moon, 
  Clock, 
  Calendar,
  User,
  Bot
} from "lucide-react"

interface Message {
  role: "user" | "bot"
  content: string
  timestamp: string
}

interface Pitch {
  _id: string
  duration: number
  conversationHistory: Message[]
  createdAt: string
  updatedAt: string
}

export default function PitchTranscripts({ params }: { params: { userId: string } }) {
  const [pitches, setPitches] = useState<Pitch[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [expandedPitches, setExpandedPitches] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check system preference for dark mode
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
      
      // Apply dark mode to document
      if (prefersDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    fetch(`/api/pitches/${params.userId}`)
      .then(res => res.json())
      .then((data: Pitch[]) => {
        setPitches(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [params.userId])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const togglePitchExpansion = (pitchId: string) => {
    const newExpanded = new Set(expandedPitches)
    if (newExpanded.has(pitchId)) {
      newExpanded.delete(pitchId)
    } else {
      newExpanded.add(pitchId)
    }
    setExpandedPitches(newExpanded)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pitch Transcripts</h1>
            <p className="text-muted-foreground">Review your conversation history</p>
          </div>
          {/* <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button> */}
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
        ) : pitches.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">No pitch transcripts found</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pitches.map((pitch, i) => {
              const isExpanded = expandedPitches.has(pitch._id)
              return (
                <Card key={pitch._id} className="overflow-hidden">
                  <button 
                    onClick={() => togglePitchExpansion(pitch._id)}
                    className="w-full text-left focus:outline-none"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            Pitch {i + 1}
                            <Badge variant="outline" className="ml-2">
                              {pitch.conversationHistory.length} messages
                            </Badge>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(pitch.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(pitch.duration)}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground mr-2">
                            {isExpanded ? 'Collapse' : 'Expand'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </button>
                  
                  {isExpanded && (
                    <CardContent className="pt-0">
                      <div className="border-t pt-4">
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-4">
                            {pitch.conversationHistory.map((msg, idx) => (
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
                                        hour: '2-digit', 
                                        minute: '2-digit' 
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