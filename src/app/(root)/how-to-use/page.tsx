'use client';

import { useState } from 'react';
import { ChevronRight, Play, FileText, Users, MessageSquare, ChevronLeft, ChevronDown } from 'lucide-react';

export default function HowToUse() {
    const [activeStep, setActiveStep] = useState(0);
    const [showMobileSteps, setShowMobileSteps] = useState(false);

    const steps = [
        {
            title: "Start Your Session",
            description: "Choose how you want to begin your pitch practice.",
            details: [
                "If you need a pitch document, go to 'Generate Pitch'",
                "Otherwise, go to 'Start Pitch' from the main menu",
                "Select your preferred AI VC personality",
                "Click 'Start' when ready to begin"
            ],
            icon: <Play className="h-5 w-5 sm:h-6 sm:w-6" />,
            color: "bg-primary"
        },
        {
            title: "Present Your Pitch",
            description: "Share your startup idea with the AI investor.",
            details: [
                "Present your pitch clearly and confidently",
                "AI analyzes your delivery, content, and presentation style",
                "Use the timer to manage your time effectively",
                "Speak naturally - this is your practice space"
            ],
            icon: <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />,
            color: "bg-primary"
        },
        {
            title: "Negotiate & Get Verdict",
            description: "Interact with the AI VC for deeper discussion.",
            details: [
                "Click 'Negotiate' to discuss terms and deal structure",
                "Click 'Verdict' to get the AI VC's investment decision",
                "Choose based on what you want to practice",
                "AI responds realistically to your pitch quality"
            ],
            icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />,
            color: "bg-primary"
        },
        {
            title: "Evaluate",
            description: "Get detailed feedback on your pitch session.",
            details: [
                "Click 'End Pitch' to finish your session",
                "Go to 'Evaluate Pitch' from the sidebar",
                "Select your latest pitch from the list",
                "Get comprehensive evaluation with scores and suggestions"
            ],
            icon: <FileText className="h-5 w-5 sm:h-6 sm:w-6" />,
            color: "bg-primary"
        }
    ];

    return (
        <div className="min-h-screen bg-background py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                        How to Use PitchDesk
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
                        Transform your pitching skills with realistic AI investors. Here&apos;s your step-by-step guide to practice, negotiate, and get detailed feedback.
                    </p>
                </div>

                {/* Mobile Step Selector */}
                <div className="lg:hidden mb-6">
                    <button
                        onClick={() => setShowMobileSteps(!showMobileSteps)}
                        className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg"
                    >
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full ${steps[activeStep].color} flex items-center justify-center text-primary-foreground mr-3`}>
                                {steps[activeStep].icon}
                            </div>
                            <span className="font-medium text-foreground">{steps[activeStep].title}</span>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showMobileSteps ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showMobileSteps && (
                        <div className="mt-2 bg-card border border-border rounded-lg overflow-hidden">
                            {steps.map((step, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setActiveStep(index);
                                        setShowMobileSteps(false);
                                    }}
                                    className={`w-full flex items-center p-4 border-b border-border last:border-b-0 ${
                                        activeStep === index ? 'bg-primary/10' : 'hover:bg-muted/50'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                        activeStep === index 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'bg-muted text-muted-foreground'
                                    }`}>
                                        {step.icon}
                                    </div>
                                    <span className={`font-medium ${activeStep === index ? 'text-primary' : 'text-foreground'}`}>
                                        {step.title}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Steps */}
                <div className="bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border overflow-hidden">
                    {/* Step Navigation - Desktop */}
                    <div className="hidden lg:block border-b border-border">
                        <div className="flex overflow-x-auto">
                            {steps.map((step, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveStep(index)}
                                    className={`flex items-center px-4 lg:px-6 py-3 lg:py-4 border-b-2 transition-all flex-1 min-w-0 ${
                                        activeStep === index
                                            ? 'border-primary text-primary bg-primary/10'
                                            : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0 ${
                                        activeStep === index 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'bg-muted text-muted-foreground'
                                    }`}>
                                        {step.icon}
                                    </div>
                                    <span className="font-medium text-sm lg:text-base whitespace-nowrap truncate">
                                        {step.title}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="flex items-start mb-4 sm:mb-6">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${steps[activeStep].color} flex items-center justify-center text-primary-foreground mr-3 sm:mr-4 flex-shrink-0`}>
                                {steps[activeStep].icon}
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-xl sm:text-2xl font-bold text-card-foreground mb-1 sm:mb-2">
                                    {steps[activeStep].title}
                                </h2>
                                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                                    {steps[activeStep].description}
                                </p>
                            </div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4 sm:p-6 border border-border">
                            <h3 className="font-semibold text-card-foreground mb-3 sm:mb-4 text-sm sm:text-base">Here&apos;s what to do:</h3>
                            <ul className="space-y-2 sm:space-y-3">
                                {steps[activeStep].details.map((detail, index) => (
                                    <li key={index} className="flex items-start">
                                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="text-card-foreground text-sm sm:text-base">{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-6 sm:mt-8">
                            <button
                                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                                disabled={activeStep === 0}
                                className="flex items-center px-4 sm:px-6 py-2 border border-border rounded-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent hover:text-accent-foreground transition-colors text-sm sm:text-base"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </button>

                            <div className="flex space-x-1 sm:space-x-2">
                                {steps.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveStep(index)}
                                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                                            activeStep === index 
                                                ? 'bg-primary' 
                                                : 'bg-muted-foreground/30'
                                        }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                                disabled={activeStep === steps.length - 1}
                                className="flex items-center px-4 sm:px-6 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors text-sm sm:text-base"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Step Indicator */}
                <div className="lg:hidden mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Step {activeStep + 1} of {steps.length}
                    </p>
                </div>
            </div>
        </div>
    );
}