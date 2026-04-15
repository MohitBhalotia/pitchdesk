"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Check, X, Wand2 } from "lucide-react";

interface AIAssistPanelProps {
  /** The current text/HTML content to improve */
  selectedContent: string;
  /** The scope label for display */
  scope: string;
  /** Called when user accepts the new content */
  onAccept: (newContent: string) => void;
}

const QUICK_ACTIONS = [
  { label: "Make more concise", prompt: "Condense this to the most essential points. Remove filler, keep maximum impact." },
  { label: "Add a statistic", prompt: "Add a specific, compelling statistic or data point that supports this content." },
  { label: "Rewrite for investors", prompt: "Rewrite to emphasize ROI, market size, growth trajectory, and financial potential." },
  { label: "Stronger headline", prompt: "Rewrite as a punchy, benefit-oriented headline that grabs attention in under 10 words." },
  { label: "More persuasive", prompt: "Make this more persuasive and compelling using confident, specific language." },
  { label: "Simplify language", prompt: "Rewrite using simpler, clearer language that anyone can understand without jargon." },
  { label: "Add bullet points", prompt: "Convert this into 4-5 concise, action-oriented bullet points." },
  { label: "Expand with detail", prompt: "Expand this with more supporting details, specific examples, and context." },
];

export default function AIAssistPanel({ selectedContent, scope, onAccept }: AIAssistPanelProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAssist = async (instruction: string) => {
    if (!selectedContent) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/pitch-deck/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instruction,
          content: selectedContent,
          scope,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI assist failed");
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (result) {
      onAccept(result);
      setResult(null);
    }
  };

  const handleDiscard = () => {
    setResult(null);
  };

  if (!selectedContent) {
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground text-center py-4">
          Select a text element to use AI Assist
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Result preview */}
      {result && (
        <div className="border border-primary/30 rounded-lg p-3 bg-primary/5 space-y-2">
          <p className="text-xs font-medium text-primary flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI Suggestion
          </p>
          <div
            className="text-xs leading-relaxed text-foreground max-h-32 overflow-y-auto"
            dangerouslySetInnerHTML={
              result.trimStart().startsWith("<")
                ? { __html: result }
                : undefined
            }
          >
            {!result.trimStart().startsWith("<") ? result : undefined}
          </div>
          <div className="flex gap-1">
            <button
              className="flex-1 h-7 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 flex items-center justify-center gap-1"
              onClick={handleAccept}
            >
              <Check className="h-3 w-3" />
              Accept
            </button>
            <button
              className="flex-1 h-7 text-xs border rounded hover:bg-muted flex items-center justify-center gap-1"
              onClick={handleDiscard}
            >
              <X className="h-3 w-3" />
              Discard
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 bg-red-50 rounded p-2">{error}</p>
      )}

      {/* Quick actions */}
      {!result && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Quick actions</p>
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              className="w-full text-left text-xs px-2 py-1.5 rounded border hover:bg-muted transition-colors disabled:opacity-50 flex items-center gap-1.5"
              disabled={loading}
              onClick={() => runAssist(action.prompt)}
            >
              {loading ? <Loader2 className="h-3 w-3 animate-spin flex-shrink-0" /> : <Wand2 className="h-3 w-3 flex-shrink-0 text-muted-foreground" />}
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Custom prompt */}
      {!result && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Custom instruction</p>
          <textarea
            className="w-full text-xs border rounded p-2 bg-background resize-none"
            rows={2}
            placeholder="Describe how you'd like to improve this content..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />
          <button
            className="w-full h-7 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-1"
            disabled={loading || !customPrompt.trim()}
            onClick={() => runAssist(customPrompt)}
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            {loading ? "Improving..." : "Improve with AI"}
          </button>
        </div>
      )}
    </div>
  );
}
