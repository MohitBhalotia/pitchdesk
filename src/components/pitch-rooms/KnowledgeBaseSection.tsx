"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FileText, Upload, RotateCw, Trash2, ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { KnowledgeBaseSummary, KnowledgeSourceSummary } from "./types";

const PROCESSING_STAGES = new Set(["uploading", "queued", "parsing", "extracting", "embedding"]);
const POLL_INTERVAL_MS = 3000;

const STAGE_LABELS: Record<string, string> = {
  uploading: "Uploading",
  queued: "Queued",
  parsing: "Parsing",
  extracting: "Extracting facts",
  embedding: "Embedding",
  ready: "Ready",
  failed: "Failed",
  deleting: "Deleting",
};

interface KnowledgeBaseSectionProps {
  roomId: string;
  onReadyChange?: (ready: boolean) => void;
}

export function KnowledgeBaseSection({ roomId, onReadyChange }: KnowledgeBaseSectionProps) {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseSummary | null>(null);
  const [sources, setSources] = useState<KnowledgeSourceSummary[]>([]);
  const [uploading, setUploading] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasting, setPasting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const [kbRes, sourcesRes] = await Promise.all([
        axios.get(`/api/pitch-rooms/${roomId}/knowledge`),
        axios.get(`/api/pitch-rooms/${roomId}/knowledge/sources`),
      ]);
      const kb: KnowledgeBaseSummary = kbRes.data.data.knowledgeBase;
      const sourceList: KnowledgeSourceSummary[] = sourcesRes.data.data.sources;
      setKnowledgeBase(kb);
      setSources(sourceList);
      onReadyChange?.(kb.status === "ready");

      const stillProcessing = sourceList.some((s) => PROCESSING_STAGES.has(s.stage));
      if (stillProcessing) {
        pollTimeoutRef.current = setTimeout(fetchStatus, POLL_INTERVAL_MS);
      }
    } catch {
      // transient poll failure -- try again shortly rather than surfacing an error
      pollTimeoutRef.current = setTimeout(fetchStatus, POLL_INTERVAL_MS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    fetchStatus();
    return () => {
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    };
  }, [fetchStatus]);

  const handleFileSelected = async (file: File) => {
    setUploading(true);
    try {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      const intentRes = await axios.post(`/api/pitch-rooms/${roomId}/knowledge/upload-intent`, {
        fileName: file.name,
        fileType: extension,
        fileSize: file.size,
      });
      const { sourceId, upload } = intentRes.data.data;

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", upload.apiKey);
      form.append("timestamp", String(upload.timestamp));
      form.append("signature", upload.signature);
      form.append("folder", upload.folder);
      form.append("public_id", upload.publicId);
      form.append("type", upload.type);

      await axios.post(
        `https://api.cloudinary.com/v1_1/${upload.cloudName}/${upload.resourceType}/upload`,
        form
      );

      await axios.post(`/api/pitch-rooms/${roomId}/knowledge/upload-confirm`, { sourceId });
      toast.success("File uploaded — processing now");
      fetchStatus();
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePaste = async () => {
    setPasting(true);
    try {
      await axios.post(`/api/pitch-rooms/${roomId}/knowledge/paste`, { text: pasteText });
      toast.success("Text added — processing now");
      setPasteText("");
      setPasteOpen(false);
      fetchStatus();
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(message || "Failed to add text");
    } finally {
      setPasting(false);
    }
  };

  const handleRetry = async (sourceId: string) => {
    try {
      await axios.post(`/api/pitch-rooms/${roomId}/knowledge/sources/${sourceId}/retry`);
      toast.success("Retrying");
      fetchStatus();
    } catch {
      toast.error("Failed to retry");
    }
  };

  const handleDelete = async (sourceId: string) => {
    try {
      await axios.delete(`/api/pitch-rooms/${roomId}/knowledge/sources/${sourceId}`);
      setSources((prev) => prev.filter((s) => s._id !== sourceId));
      toast.success("Source removed");
    } catch {
      toast.error("Failed to remove source");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelected(file);
          }}
          accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.csv,.txt,.md,.png,.jpg,.jpeg"
        />
        <Button
          variant="default"
          className="gap-2"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload document"}
        </Button>

        <Dialog open={pasteOpen} onOpenChange={setPasteOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ClipboardPaste className="w-4 h-4" />
              Paste text
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Paste text</DialogTitle>
            </DialogHeader>
            <Textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              rows={10}
              maxLength={50000}
              placeholder="Paste your deck notes, financials summary, or any other startup material..."
            />
            <p className="text-xs text-muted-foreground text-right">
              {pasteText.length.toLocaleString()} / 50,000
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPasteOpen(false)} disabled={pasting}>
                Cancel
              </Button>
              <Button onClick={handlePaste} disabled={pasting || !pasteText.trim()}>
                {pasting ? "Adding..." : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {sources.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No sources yet. Upload a document or paste text to build this room&apos;s
            knowledge base.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {sources.map((source) => (
            <li
              key={source._id}
              className="flex items-center justify-between border border-border rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {source.sourceType === "pasted_text" ? "Pasted text" : source.fileName}
                  </p>
                  {source.stage === "failed" && source.errorMessage && (
                    <p className="text-xs text-destructive truncate">{source.errorMessage}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={source.stage === "failed" ? "destructive" : "secondary"}>
                  {STAGE_LABELS[source.stage] ?? source.stage}
                </Badge>
                {source.stage === "failed" && (
                  <Button size="icon" variant="ghost" title="Retry" onClick={() => handleRetry(source._id)}>
                    <RotateCw className="w-4 h-4" />
                  </Button>
                )}
                <Button size="icon" variant="ghost" title="Remove" onClick={() => handleDelete(source._id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {knowledgeBase?.status === "ready" && knowledgeBase.startupBrief && (
        <div className="border border-border rounded-lg p-4 bg-muted/30">
          <p className="text-sm font-semibold text-foreground mb-1">Startup brief</p>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {knowledgeBase.startupBrief}
          </p>
        </div>
      )}

      {(knowledgeBase?.contradictions?.length ?? 0) > 0 && (
        <div className="border border-amber-500/40 rounded-lg p-4 bg-amber-500/10">
          <p className="text-sm font-semibold text-foreground mb-2">Conflicting metrics found</p>
          <ul className="space-y-1">
            {knowledgeBase!.contradictions!.map((c, i) => (
              <li key={i} className="text-sm text-muted-foreground">
                {c.note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
