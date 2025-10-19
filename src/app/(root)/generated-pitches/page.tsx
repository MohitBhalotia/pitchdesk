// app/pitches/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, FileText, Calendar, Copy, Trash2, Eye, Download, Plus, Edit, Save, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import jsPDF from 'jspdf';

interface Pitch {
  _id: string;
  pitch: string;
  createdAt: string;
  companyName?: string;
  title?: string;
}

export default function PitchesPage() {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pitchToDelete, setPitchToDelete] = useState<Pitch | null>(null);
  const [editingPitchId, setEditingPitchId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [updatingTitle, setUpdatingTitle] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchPitches();
  }, [session, status, router]);

  const fetchPitches = async () => {
    try {
      const response = await fetch('/api/store-pitch');
      if (response.ok) {
        const data = await response.json();
        // Sort pitches by creation date, newest first
        const sortedPitches = (data.pitches || []).sort((a: Pitch, b: Pitch) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPitches(sortedPitches);
      } else {
        console.error('Failed to fetch pitches');
      }
    } catch (error) {
      console.error('Error fetching pitches:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPitches = pitches.filter(pitch =>
    pitch.pitch.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pitch.companyName && pitch.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (pitch.title && pitch.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Reset both dates to midnight for accurate day comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = today.getTime() - inputDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log('Pitch copied to clipboard!');
  };

  const downloadAsPDF = (pitch: Pitch) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(pitch.title || pitch.companyName || 'Startup Pitch', margin, 30);

    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${formatFullDate(pitch.createdAt)}`, margin, 45);

    // Content
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(pitch.pitch, maxWidth);
    let yPosition = 65;

    lines.forEach((line: string) => {
      if (yPosition > doc.internal.pageSize.height - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += 7;
    });

    doc.save(`${pitch.title || pitch.companyName || 'pitch'}-${new Date().getTime()}.pdf`);
  };

  const deletePitch = async (pitchId: string) => {
    try {
      const response = await fetch(`/api/store-pitch`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pitchId }),
      });

      if (response.ok) {
        setPitches(pitches.filter(p => p._id !== pitchId));
        setDeleteDialogOpen(false);
        setPitchToDelete(null);
      } else {
        console.error('Failed to delete pitch');
      }
    } catch (error) {
      console.error('Error deleting pitch:', error);
    }
  };

  const updatePitchTitle = async (pitchId: string, newTitle: string) => {
    try {
      setUpdatingTitle(true);
      const response = await fetch(`/api/store-pitch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          pitchId, 
          title: newTitle 
        }),
      });

      if (response.ok) {
        // Update the local state
        setPitches(pitches.map(pitch => 
          pitch._id === pitchId 
            ? { ...pitch, title: newTitle }
            : pitch
        ));
        setEditingPitchId(null);
        setEditTitle('');
      } else {
        console.error('Failed to update pitch title');
      }
    } catch (error) {
      console.error('Error updating pitch title:', error);
    } finally {
      setUpdatingTitle(false);
    }
  };

  const startEditing = (pitch: Pitch) => {
    setEditingPitchId(pitch._id);
    setEditTitle(pitch.title || pitch.companyName || '');
  };

  const cancelEditing = () => {
    setEditingPitchId(null);
    setEditTitle('');
  };

  const saveTitle = (pitchId: string) => {
    if (editTitle.trim()) {
      updatePitchTitle(pitchId, editTitle.trim());
    } else {
      cancelEditing();
    }
  };

  const getDisplayTitle = (pitch: Pitch) => {
    return pitch.title || pitch.companyName || 'Startup Pitch';
  };

  const getPreviewText = (pitch: string) => {
    const words = pitch.split(' ');
    if (words.length <= 25) return pitch;
    return words.slice(0, 25).join(' ') + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your pitches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FileText size={16} />
            My Pitch Library
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Generated Pitches
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            All your startup pitches organized and ready to use
          </p>
          
          <Button 
            onClick={() => router.push('/generate-pitch')}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Pitch
          </Button>
        </div>

        {/* Search and Stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search pitches by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <FileText className="w-4 h-4 mr-2" />
                {filteredPitches.length} {filteredPitches.length === 1 ? 'Pitch' : 'Pitches'}
              </Badge>
              {searchTerm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Pitches Grid */}
        {filteredPitches.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
            <FileText className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm ? 'No matching pitches found' : 'No pitches generated yet'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms or clear the search to see all pitches'
                : 'Create your first pitch to start building your library'
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => router.push('/generate-pitch')}
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Generate First Pitch
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPitches.map((pitch) => (
              <Card 
                key={pitch._id} 
                className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className="text-xs font-normal">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(pitch.createdAt)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(pitch)}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Edit title"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {editingPitchId === pitch._id ? (
                    <div className="space-y-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Enter pitch title..."
                        className="text-lg font-semibold h-8"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveTitle(pitch._id);
                          if (e.key === 'Escape') cancelEditing();
                        }}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => saveTitle(pitch._id)}
                          disabled={updatingTitle || !editTitle.trim()}
                          className="h-6 px-2 text-xs"
                        >
                          {updatingTitle ? (
                            <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full" />
                          ) : (
                            <Save className="h-3 w-3 mr-1" />
                          )}
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEditing}
                          className="h-6 px-2 text-xs"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <CardTitle className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {getDisplayTitle(pitch)}
                    </CardTitle>
                  )}
                  
                  <CardDescription className="text-sm leading-relaxed line-clamp-3">
                    {getPreviewText(pitch.pitch)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPitch(pitch);
                          setViewDialogOpen(true);
                        }}
                        className="h-8 px-3 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(pitch.pitch)}
                        className="h-8 px-3 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadAsPDF(pitch)}
                        className="h-8 w-8 p-0"
                        title="Download PDF"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPitchToDelete(pitch);
                          setDeleteDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Delete pitch"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View Pitch Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl">
                  {selectedPitch && getDisplayTitle(selectedPitch)}
                </DialogTitle>
                <Badge variant="secondary" className="text-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  {selectedPitch && formatFullDate(selectedPitch.createdAt)}
                </Badge>
              </div>
              <DialogDescription>
                Your complete generated startup pitch
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              {selectedPitch && (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-line text-sm leading-relaxed p-6 bg-muted/30 rounded-lg border">
                    {selectedPitch.pitch}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => selectedPitch && copyToClipboard(selectedPitch.pitch)}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Text
              </Button>
              <Button
                variant="outline"
                onClick={() => selectedPitch && downloadAsPDF(selectedPitch)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Delete Pitch
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this pitch? This action cannot be undone and the pitch will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setPitchToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => pitchToDelete && deletePitch(pitchToDelete._id)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Pitch
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}