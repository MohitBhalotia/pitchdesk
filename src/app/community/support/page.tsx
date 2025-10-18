'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageCircle, Mail, Linkedin, CheckCircle, Loader2, ChevronDown, Instagram, Phone } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface SupportFormData {
    name: string;
    email: string;
    issueType: string;
    subject: string;
    description: string;
    // files: File[];
    consent: boolean;
}

interface TicketSummary {
    id: string;
    name: string;
    email: string;
    issueType: string;
    subject: string;
    description: string;
    status: 'submitted' | 'in-progress' | 'resolved';
}

const ISSUE_TYPES = [
    { value: 'account', label: 'Account' },
    { value: 'billing', label: 'Billing' },
    { value: 'bug', label: 'Bug' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'other', label: 'Other' },
];

const CONTACT_DETAILS = {
    email: 'info@pitchdesk.in',
    phone: '+91 9987105864',
    social: {
        twitter: 'https://twitter.com/pitchdesk',
        linkedin: 'https://www.linkedin.com/company/pitch-desk',
        instagram: 'https://www.instagram.com/pitchdesk.in'
    },
};

interface FormErrors {
    name?: string;
    email?: string;
    issueType?: string;
    subject?: string;
    description?: string;
    // files?: string;
    consent?: string;
}

const FAQS = [
    {
        question: "What is PitchDesk?",
        answer:
            "PitchDesk is an AI-powered platform designed to help entrepreneurs and startup founders practice and perfect their investment pitches through realistic simulations with AI venture capitalists.",
    },
    {
        question: "How does PitchDesk work?",
        answer:
            "You can choose from over 10 VC personalities that mimic different investor types, deliver your pitch in real-time, interact in a structured Q&A session, and then receive instant analysis and actionable feedback from our AI-driven Pitch Analyzer.",
    },
    {
        question: "What VC personalities are available?",
        answer:
            "PitchDesk offers a variety of AI VC personalities, each designed to simulate real-world investors with unique questioning styles and sector expertise. This diversity prepares you to handle a wide range of potential funders.",
    },
    {
        question: "What languages does PitchDesk support?",
        answer:
            "Currently, PitchDesk operates in English. Hindi support is coming soon and will enable users to practice their pitches in their preferred language.",
    },
    {
        question: "What type of feedback do I receive?",
        answer:
            "After each session, you get comprehensive insights, including evaluations of your pitch structure, clarity, response quality, and specific suggestions for improvement. The AI Pitch Analyzer delivers focused advice for refining your pitch.",
    },
    {
        question: "Can I practice multiple times with different scenarios?",
        answer:
            "Yes, users can practice repeatedly, switching between VC personalities and scenarios for a well-rounded preparation experience.",
    },
    {
        question: "Can PitchDesk generate personalized pitches?",
        answer:
            "PitchDesk includes an AI agent trained to help you generate a personalized pitch tailored to your venture, business model, and industry needs, providing a starting point for further refinement.",
    },
    {
        question: "Is there a crowdfunding platform included?",
        answer:
            "A crowdfunding platform, enabling engagement with partnered VCs and real investors, is under development and will launch soon. This feature will connect users’ refined pitches to actual funding opportunities.",
    },
    {
        question: "How realistic are the AI VC interactions?",
        answer:
            "AI VC personalities at PitchDesk are trained to reflect actual investor questioning, decision-making, and topical expertise—from market sizing to financial projections.",
    },
    {
        question: "What makes PitchDesk different?",
        answer:
            "PitchDesk stands out for its selection of simulated VC personalities, real-time interactive sessions, comprehensive automated feedback, and its upcoming integration with a crowdfunding and VC network.",
    },
    {
        question: "Can I use PitchDesk for different stages of fundraising?",
        answer:
            "Yes, practice with personalities suited to angel, seed, and growth-stage fundraising, adapting your pitch to various investment situations.",
    },
    {
        question: "How long is each pitch practice session?",
        answer:
            "Sessions are typically 15–30 minutes, balancing realism and efficiency for busy founders.",
    },
    {
        question: "Is my information confidential?",
        answer:
            "Yes, all your pitch content and business information is securely stored and kept confidential, in line with best industry standards.",
    },
    {
        question: "Do I need a ready pitch deck?",
        answer:
            "PitchDesk adapts to your stage of preparation—whether you have a full deck, notes, or just an idea, you’ll get valuable feedback.",
    },
    {
        question: "Can I get sector-specific pitch feedback?",
        answer:
            "PitchDesk VC personalities include a range of industry specialists to ensure feedback and Q&A reflect your target market’s unique demands.",
    },
    {
        question: "How do I get started?",
        answer:
            "Visit pitchdesk.in, select a VC personality, and start your session right away—no complex prerequisites or setup required.",
    },
];

export default function SupportPage() {
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<SupportFormData>({
        name: '',
        email: '',
        issueType: '',
        subject: '',
        description: '',
        // files: [],
        consent: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    // const [dragOver, setDragOver] = useState(false);
    const [ticketSummary, setTicketSummary] = useState<TicketSummary | null>(null);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.issueType) {
            newErrors.issueType = 'Please select an issue type';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.trim().length < 20) {
            newErrors.description = 'Description must be at least 20 characters long';
        }

        if (!formData.consent) {
            newErrors.consent = 'You must agree to be contacted about this issue';
        }

        // Validate file uploads
        // if (formData.files.length > 0) {
        //     for (const file of formData.files) {
        //         if (file.size > 5 * 1024 * 1024) { // 5MB
        //             newErrors.files = 'File size must be less than 5MB';
        //             break;
        //         }
        //         const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
        //         if (!allowedTypes.includes(file.type)) {
        //             newErrors.files = 'Only PNG, JPG, JPEG, and PDF files are allowed';
        //             break;
        //         }
        //     }
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof SupportFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // const handleFileUpload = (files: FileList | null) => {
    //     if (!files) return;

    //     const fileArray = Array.from(files);
    //     const totalFiles = formData.files.length + fileArray.length;

    //     if (totalFiles > 3) {
    //         toast.error('Maximum 3 files allowed');
    //         return;
    //     }

    //     // Validate each file
    //     for (const file of fileArray) {
    //         if (file.size > 5 * 1024 * 1024) {
    //             toast.error(`${file.name} is too large. Maximum file size is 5MB.`);
    //             return;
    //         }
    //         const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
    //         if (!allowedTypes.includes(file.type)) {
    //             toast.error(`${file.name} is not a supported file type.`);
    //             return;
    //         }
    //     }

    //     setFormData(prev => ({
    //         ...prev,
    //         files: [...prev.files, ...fileArray].slice(0, 3) // Limit to 3 files
    //     }));
    // };

    // const removeFile = (index: number) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         files: prev.files.filter((_, i) => i !== index)
    //     }));
    // };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare form data for API submission
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('issueType', formData.issueType);
            submitData.append('subject', formData.subject);
            submitData.append('description', formData.description);
            submitData.append('consent', formData.consent.toString());

            // Add files
            // formData.files.forEach((file, index) => {
            //     submitData.append(`file${index}`, file);
            // });

            // Submit to API
            const response = await axios.post('/api/support', submitData);

            const result = await response.data;

            if (response.status !== 200) {
                throw new Error(result.message || 'Failed to submit ticket');
            }

            // Create ticket summary
            const summary: TicketSummary = {
                id: result.ticketId,
                name: formData.name,
                email: formData.email,
                issueType: formData.issueType,
                subject: formData.subject,
                description: formData.description,
                status: 'submitted',
            };

            setTicketSummary(summary);

            toast.success(`Thanks! Ticket #${result.ticketId} created. We'll reply in ~24 hours.`);

            // Reset form
            setFormData({
                name: '',
                email: '',
                issueType: '',
                subject: '',
                description: '',
                // files: [],
                consent: false,
            });

            setShowForm(false);
        } catch (error) {
            toast.error('Failed to submit ticket. Please try again.');
            console.error('Support form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // const handleDragOver = (e: React.DragEvent) => {
    //     e.preventDefault();
    //     setDragOver(true);
    // };

    // const handleDragLeave = (e: React.DragEvent) => {
    //     e.preventDefault();
    //     setDragOver(false);
    // };

    // const handleDrop = (e: React.DragEvent) => {
    //     e.preventDefault();
    //     setDragOver(false);
    //     handleFileUpload(e.dataTransfer.files);
    // };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative pb-4 pt-0 px-4 ">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        We&apos;re here to help
                    </h1>
                    <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Find quick answers or get in touch with our support team anytime.
                    </p>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-14 px-4 ">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-muted-foreground">Find quick answers to common questions about PitchDesk</p>
                    </div>

                    <div className="space-y-4">
                        {FAQS.map((faq, index) => (
                            <Card key={index} className="overflow-hidden">
                                <Collapsible>
                                    <CollapsibleTrigger className="w-full px-6  text-left  transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">{faq.question}</h3>
                                            <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180" />
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="px-6 ">
                                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                    </CollapsibleContent>
                                </Collapsible>
                            </Card>
                        ))}
                    </div>


                </div>
            </section>

            {/* Need Help Section */}
            <section className="py-14 px-4 bg-muted/30">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Still need assistance?</h2>
                    <p className="text-muted-foreground mb-8">
                        Our team replies within 24 hours.
                    </p>
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        className="text-lg px-8 py-3"
                        size="lg"
                    >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        fill out the form to get support
                    </Button>
                </div>
            </section>

            {/* Support Form */}
            {showForm && (
                <section className="py-16 px-4">
                    <div className="max-w-2xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" />
                                    Contact Support
                                </CardTitle>
                                <CardDescription>
                                    Tell us about your issue and we&apos;ll get back to you as soon as possible.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name (Optional)</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                placeholder="Your name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                placeholder="your.email@example.com"
                                                className={errors.email ? 'border-destructive' : ''}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-destructive">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Issue Type and Subject */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="issueType">Issue Type *</Label>
                                            <Select
                                                value={formData.issueType}
                                                onValueChange={(value) => handleInputChange('issueType', value)}
                                            >
                                                <SelectTrigger className={errors.issueType ? 'border-destructive' : ''}>
                                                    <SelectValue placeholder="Select issue type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ISSUE_TYPES.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.issueType && (
                                                <p className="text-sm text-destructive">{errors.issueType}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject *</Label>
                                            <Input
                                                id="subject"
                                                value={formData.subject}
                                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                                placeholder="Brief description of your issue"
                                                className={errors.subject ? 'border-destructive' : ''}
                                            />
                                            {errors.subject && (
                                                <p className="text-sm text-destructive">{errors.subject}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description *</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="Please provide detailed information about your issue..."
                                            className={cn(
                                                'min-h-[120px]',
                                                errors.description ? 'border-destructive' : ''
                                            )}
                                        />
                                        <div className="flex justify-between items-center">
                                            {errors.description ? (
                                                <p className="text-sm text-destructive">{errors.description}</p>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    Minimum 20 characters
                                                </p>
                                            )}
                                            <p className="text-sm text-muted-foreground">
                                                {formData.description.length}/20
                                            </p>
                                        </div>
                                    </div>

                                    {/* File Upload */}
                                    {/* <div className="space-y-2">
                                        <Label>Screenshot Upload (Optional)</Label>
                                        <div
                                            className={cn(
                                                'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                                                dragOver
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-muted-foreground/25 hover:border-muted-foreground/50',
                                                errors.files ? 'border-destructive' : ''
                                            )}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                        >
                                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Drag & drop files here, or click to browse
                                            </p>
                                            <p className="text-xs text-muted-foreground mb-4">
                                                PNG, JPG, JPEG, PDF • Max 3 files • 5MB each
                                            </p>
                                            <input
                                                type="file"
                                                multiple
                                                accept=".png,.jpg,.jpeg,.pdf"
                                                onChange={(e) => handleFileUpload(e.target.files)}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <Label htmlFor="file-upload" className="cursor-pointer">
                                                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
                                                    Choose Files
                                                </Button>
                                            </Label>
                                        </div> */}

                                    {/* File Previews */}
                                    {/* {formData.files.length > 0 && (
                                            <div className="space-y-2">
                                                {formData.files.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-2 bg-muted rounded-lg"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4" />
                                                            <span className="text-sm font-medium">{file.name}</span>
                                                            <Badge variant="secondary" className="text-xs">
                                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                                            </Badge>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeFile(index)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {errors.files && (
                                            <p className="text-sm text-destructive">{errors.files}</p>
                                        )}
                                    </div> */}

                                    {/* Consent Checkbox */}
                                    <div className="flex items-start space-x-2">
                                        <Checkbox
                                            id="consent"
                                            checked={formData.consent}
                                            onCheckedChange={(checked) => handleInputChange('consent', !!checked)}
                                            className={errors.consent ? 'border-destructive' : ''}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label htmlFor="consent" className="text-sm font-medium leading-none">
                                                I agree to be contacted about this issue *
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                We&apos;ll use your email to follow up on your support request.
                                            </p>
                                        </div>
                                    </div>
                                    {errors.consent && (
                                        <p className="text-sm text-destructive">{errors.consent}</p>
                                    )}

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Ticket'
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

            {/* Ticket Summary Card */}
            {ticketSummary && (
                <section className="py-16 px-4">
                    <div className="max-w-2xl mx-auto">
                        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                    <CheckCircle className="h-5 w-5" />
                                    Ticket Submitted Successfully!
                                </CardTitle>
                                <CardDescription>
                                    Your support ticket has been created and our team will get back to you soon.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono">
                                            #{ticketSummary.id}
                                        </Badge>
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            Submitted
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="font-medium text-muted-foreground">Name</p>
                                            <p>{ticketSummary.name || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-muted-foreground">Email</p>
                                            <p>{ticketSummary.email}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-muted-foreground">Issue Type</p>
                                            <p className="capitalize">{ticketSummary.issueType}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-muted-foreground">Subject</p>
                                            <p>{ticketSummary.subject}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="font-medium text-muted-foreground mb-2">Description</p>
                                        <p className="text-sm bg-background p-3 rounded-lg border">
                                            {ticketSummary.description}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <p className="text-sm text-muted-foreground">
                                            📧 We&apos;ll reply to your email within 24 hours with updates on your ticket.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}


            {/* Contact Details Section */}
            <section className="py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Card className="text-center w-50 min-h-[180px] flex flex-col">
                            <CardHeader className="flex-grow-0">
                                <Phone className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <CardTitle className="text-lg">Email</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow flex items-center justify-center">
                                <a
                                     href={`tel:${CONTACT_DETAILS.phone}`}
                                    className="text-muted-foreground hover:text-primary transition-colors break-all text-sm"
                                >
                                    {CONTACT_DETAILS.phone}
                                </a>
                            </CardContent>
                        </Card>
                        <Card className="text-center w-50 min-h-[180px] flex flex-col">
                            <CardHeader className="flex-grow-0">
                                <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <CardTitle className="text-lg">Email</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow flex items-center justify-center">
                                <a
                                    href={`mailto:${CONTACT_DETAILS.email}`}
                                    className="text-muted-foreground hover:text-primary transition-colors break-all text-sm"
                                >
                                    {CONTACT_DETAILS.email}
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="text-center w-50 min-h-[180px] flex flex-col">
                            <CardHeader className="flex-grow-0">
                                <Instagram className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <CardTitle className="text-lg">Instagram</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow flex items-center justify-center">
                                <a
                                    href={CONTACT_DETAILS.social.instagram}
                                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    @pitchdesk
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="text-center w-50 min-h-[180px] flex flex-col">
                            <CardHeader className="flex-grow-0">
                                <Linkedin className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <CardTitle className="text-lg">LinkedIn</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow flex items-center justify-center">
                                <a
                                    href={CONTACT_DETAILS.social.linkedin}
                                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    PitchDesk
                                </a>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>


        </div>
    );
}
