"use client";

import { useState, useEffect } from "react";

interface AIGenerationLoaderProps {
    type: "evaluation" | "improvement";
}

const EVALUATION_MESSAGES = [
    "🎯 Analyzing pitch structure and flow...",
    "🧠 Evaluating communication clarity...",
    "💡 Assessing value proposition strength...",
    "📊 Measuring business investability...",
    "🎤 Reviewing Q&A handling quality...",
    "✨ Calculating confidence scores...",
    "📈 Analyzing market opportunity...",
    "🔍 Examining supporting evidence...",
    "💼 Evaluating team capability...",
    "🚀 Finalizing comprehensive assessment...",
];

const IMPROVEMENT_MESSAGES = [
    "🔍 Identifying improvement opportunities...",
    "💡 Analyzing criterion-level performance...",
    "📊 Calculating marks lost per section...",
    "✨ Generating actionable suggestions...",
    "🎯 Pinpointing key strengths...",
    "⚠️ Detecting critical gaps...",
    "🚀 Crafting improvement strategies...",
    "📈 Prioritizing enhancement areas...",
    "💪 Building personalized feedback...",
    "🎓 Finalizing expert recommendations...",
];

export default function AIGenerationLoader({ type }: AIGenerationLoaderProps) {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const messages = type === "evaluation" ? EVALUATION_MESSAGES : IMPROVEMENT_MESSAGES;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        }, 2500); // Change message every 2.5 seconds

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="min-h-[400px] flex items-center justify-center py-12">
            <div className="max-w-md w-full">
                {/* Animated AI Brain Icon */}
                <div className="relative w-32 h-32 mx-auto mb-8">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-spin-slow"></div>

                    {/* Middle pulsing ring */}
                    <div className="absolute inset-2 rounded-full border-4 border-primary/40 animate-pulse"></div>

                    {/* Inner rotating ring (opposite direction) */}
                    <div className="absolute inset-4 rounded-full border-4 border-primary/60 animate-spin-reverse"></div>

                    {/* Center AI icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            className="w-16 h-16 text-primary animate-pulse-slow"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                        </svg>
                    </div>

                    {/* Floating particles */}
                    <div className="absolute -top-2 left-1/2 w-2 h-2 bg-primary rounded-full animate-float-1"></div>
                    <div className="absolute top-1/2 -right-2 w-2 h-2 bg-primary rounded-full animate-float-2"></div>
                    <div className="absolute -bottom-2 left-1/2 w-2 h-2 bg-primary rounded-full animate-float-3"></div>
                    <div className="absolute top-1/2 -left-2 w-2 h-2 bg-primary rounded-full animate-float-4"></div>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full animate-progress"></div>
                    </div>
                </div>

                {/* Main heading */}
                <h3 className="text-xl font-semibold text-center text-card-foreground mb-2">
                    {type === "evaluation" ? "Generating Evaluation" : "Generating Improvement Analysis"}
                </h3>

                <p className="text-sm text-center text-muted-foreground mb-6">
                    Our AI is working hard to provide you with detailed insights
                </p>

                {/* Rotating messages */}
                <div className="bg-card border rounded-lg p-4 min-h-[60px] flex items-center justify-center">
                    <p
                        key={currentMessageIndex}
                        className="text-center text-card-foreground font-medium animate-fade-in"
                    >
                        {messages[currentMessageIndex]}
                    </p>
                </div>

                {/* Estimated time */}
                <p className="text-xs text-center text-muted-foreground mt-4">
                    This usually takes 15-30 seconds
                </p>

                {/* Dots animation */}
                <div className="flex justify-center gap-2 mt-6">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce-1"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce-2"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce-3"></div>
                </div>
            </div>
        </div>
    );
}
