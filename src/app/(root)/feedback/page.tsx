'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MessageSquare, Star, Heart, Lightbulb, Bug,  Send, Users, Twitter, Linkedin, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface FeedbackFormData {
    name: string;
    email: string;
    feedbackType: string;
    message: string;
    rating: number;
    contactPreference: boolean;
}

interface FeedbackErrors {
    name?: string;
    email?: string;
    feedbackType?: string;
    message?: string;
    rating?: string;
    contactPreference?: string;
}

interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    type: 'testimonial' | 'suggestion' | 'praise' | 'feature';
    rating?: number;
}

const FEEDBACK_TYPES = [
    { value: 'bug', label: 'Bug Report', icon: Bug },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb },
    { value: 'suggestion', label: 'General Suggestion', icon: MessageSquare },
    { value: 'praise', label: 'Praise / Appreciation', icon: Heart },
];

const TESTIMONIALS: Testimonial[] = [
    {
        id: '1',
        name: 'Aditi',
        role: 'Startup Founder',
        content: 'The AI judges feature really helped me refine my pitch. Great product!',
        type: 'testimonial',
        rating: 5,
    },
    {
        id: '2',
        name: 'Raj',
        role: 'Early User',
        content: 'Would love to see integration with Notion soon!',
        type: 'suggestion',
        rating: 4,
    },
    {
        id: '3',
        name: 'Priya',
        role: 'Tech Entrepreneur',
        content: 'The pitch analysis is incredibly accurate and helpful for improving my presentation skills.',
        type: 'praise',
        rating: 5,
    },
    {
        id: '4',
        name: 'Vikram',
        role: 'Product Manager',
        content: 'Feature request: Add export to PDF option for pitch decks.',
        type: 'feature',
        rating: 4,
    },
];

const SOCIAL_LINKS = [
    { name: 'Discord', icon: Users, href: 'https://discord.gg/pitchdesk', color: 'text-indigo-600' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/pitchdesk', color: 'text-blue-500' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/pitch-desk', color: 'text-blue-700' },
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/pitchdesk.in/', color: 'text-pink-500' },
];

export default function FeedbackPage() {
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FeedbackFormData>({
        name: '',
        email: '',
        feedbackType: '',
        message: '',
        rating: 0,
        contactPreference: false,
    });
    const [errors, setErrors] = useState<FeedbackErrors>({});
    const [hoveredRating, setHoveredRating] = useState(0);

    const validateForm = (): boolean => {
        const newErrors: FeedbackErrors = {};

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.feedbackType) {
            newErrors.feedbackType = 'Please select a feedback type';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Please share your feedback';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Please provide more detailed feedback (at least 10 characters)';
        }

        if (formData.rating === 0) {
            newErrors.rating = 'Please rate your experience';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FeedbackFormData, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

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
            submitData.append('feedbackType', formData.feedbackType);
            submitData.append('message', formData.message);
            submitData.append('rating', formData.rating.toString());
            submitData.append('contactPreference', formData.contactPreference.toString());

            // Submit to API
            const response = await axios.post('/api/feedback', submitData);

            const result = await response.data;

            if (response.status !== 200) {
                throw new Error(result.message || 'Failed to submit feedback');
            }

            toast.success('Thanks for your feedback! We truly appreciate you helping us improve.');

            // Reset form
            setFormData({
                name: '',
                email: '',
                feedbackType: '',
                message: '',
                rating: 0,
                contactPreference: false,
            });

            setShowForm(false);
        } catch (error) {
            toast.error('Failed to submit feedback. Please try again.');
            console.error('Feedback form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (rating: number, interactive = false, size = 'w-5 h-5') => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={cn(
                            size,
                            'transition-colors',
                            interactive
                                ? 'cursor-pointer hover:fill-yellow-400 hover:text-yellow-400'
                                : '',
                            star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                        )}
                        onClick={interactive ? () => handleInputChange('rating', star) : undefined}
                        onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
                        onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-8 px-4 ">
                <div className="max-w-4xl mx-auto text-center">
                    
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Your voice drives Pitch Desk forward
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        We love hearing your thoughts, suggestions, and ideas to make our platform better for you.
                    </p>
                </div>
            </section>

            {/* Quick Poll Section */}
            <section className="py-16 px-4 ">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-card rounded-2xl p-8 border shadow-sm">
                        <h3 className="text-2xl font-bold mb-4">How satisfied are you with your experience today?</h3>
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                {renderStars(4, false, 'w-6 h-6')}
                                <span className="text-lg font-semibold">4.2/5</span>
                            </div>
                        </div>
                        <p className="text-muted-foreground mb-6">Based on 147 recent responses</p>
                        <Button
                            onClick={() => setShowForm(!showForm)}
                            className="text-lg px-8 py-3"
                            size="lg"
                        >
                            <MessageSquare className="h-5 w-5 mr-2" />
                            Share Your Feedback
                        </Button>
                    </div>
                </div>
            </section>

            {/* Feedback Form */}
            {showForm && (
                <section className="py-10 px-4 ">
                    <div className="max-w-2xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Share Your Feedback
                                </CardTitle>
                                <CardDescription>
                                    Your input helps us create a better experience for everyone. Thank you for taking the time to share your thoughts!
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name and Email */}
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
                                            <Label htmlFor="email">Email (Optional)</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                placeholder="your.email@example.com"
                                                className={errors.email ? 'border-destructive' : ''}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                We'll only use this to follow up if you request it
                                            </p>
                                            {errors.email && (
                                                <p className="text-sm text-destructive">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Feedback Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="feedbackType">What type of feedback do you have? *</Label>
                                        <Select
                                            value={formData.feedbackType}
                                            onValueChange={(value) => handleInputChange('feedbackType', value)}
                                        >
                                            <SelectTrigger className={errors.feedbackType ? 'border-destructive' : ''}>
                                                <SelectValue placeholder="Select feedback type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {FEEDBACK_TYPES.map((type) => {
                                                    const IconComponent = type.icon;
                                                    return (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            <div className="flex items-center gap-2">
                                                                <IconComponent className="w-4 h-4" />
                                                                {type.label}
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                        {errors.feedbackType && (
                                            <p className="text-sm text-destructive">{errors.feedbackType}</p>
                                        )}
                                    </div>

                                    {/* Rating */}
                                    <div className="space-y-2">
                                        <Label>How would you rate your overall experience? *</Label>
                                        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                            <span className="text-sm font-medium">Rate us:</span>
                                            <div className="flex items-center gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={cn(
                                                            'w-8 h-8 cursor-pointer transition-colors hover:fill-yellow-400 hover:text-yellow-400',
                                                            star <= (hoveredRating || formData.rating)
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300'
                                                        )}
                                                        onClick={() => handleInputChange('rating', star)}
                                                        onMouseEnter={() => setHoveredRating(star)}
                                                        onMouseLeave={() => setHoveredRating(0)}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {formData.rating > 0 ? `${formData.rating}/5` : 'Click to rate'}
                                            </span>
                                        </div>
                                        {errors.rating && (
                                            <p className="text-sm text-destructive">{errors.rating}</p>
                                        )}
                                    </div>

                                    {/* Feedback Message */}
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Tell us more *</Label>
                                        <Textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={(e) => handleInputChange('message', e.target.value)}
                                            placeholder="Share your thoughts, suggestions, or experiences with PitchDesk..."
                                            className={cn(
                                                'min-h-[120px]',
                                                errors.message ? 'border-destructive' : ''
                                            )}
                                        />
                                        <div className="flex justify-between items-center">
                                            {errors.message ? (
                                                <p className="text-sm text-destructive">{errors.message}</p>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    Help us understand your experience
                                                </p>
                                            )}
                                            <p className="text-sm text-muted-foreground">
                                                {formData.message.length}/10
                                            </p>
                                        </div>
                                    </div>

                                    {/* Contact Preference */}
                                    <div className="flex items-start space-x-2">
                                        <Checkbox
                                            id="contactPreference"
                                            checked={formData.contactPreference}
                                            onCheckedChange={(checked) => handleInputChange('contactPreference', !!checked)}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label htmlFor="contactPreference" className="text-sm font-medium leading-none">
                                                I'd like to be contacted about this feedback
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                We'll reach out if we need clarification or want to discuss your suggestions.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Send className="h-4 w-4 mr-2 animate-pulse" />
                                                Submitting Feedback...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-2" />
                                                Submit Feedback
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}
            
            {/* Testimonials Section */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">What Our Community Says</h2>
                        <p className="text-muted-foreground">Real feedback from real users helping us build a better product</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {TESTIMONIALS.map((testimonial) => {
                            const IconComponent = FEEDBACK_TYPES.find(type => type.value === testimonial.type)?.icon || MessageSquare;
                            return (
                                <Card key={testimonial.id} className="relative overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <IconComponent className="w-5 h-5 text-primary" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h4 className="font-semibold">{testimonial.name}</h4>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {testimonial.role}
                                                    </Badge>
                                                </div>
                                                {testimonial.rating && (
                                                    <div className="mb-3">
                                                        {renderStars(testimonial.rating, false, 'w-4 h-4')}
                                                    </div>
                                                )}
                                                <p className="text-muted-foreground leading-relaxed">
                                                    "{testimonial.content}"
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>
            
            {/* Community Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
                    <p className="text-muted-foreground mb-8">
                        Stay updated with the latest features, get early access to new tools, and connect with other PitchDesk users.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {SOCIAL_LINKS.map((social) => {
                            const IconComponent = social.icon;
                            return (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="group"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                                        <div className="flex flex-col items-center gap-3">
                                            <IconComponent className={cn('w-8 h-8 transition-colors', social.color, 'group-hover:scale-110')} />
                                            <span className="font-medium">{social.name}</span>
                                        </div>
                                    </Card>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
