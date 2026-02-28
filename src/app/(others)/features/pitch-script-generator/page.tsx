import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Sparkles, Zap, Target, CheckCircle2, ArrowRight, Edit3, Presentation } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'Startup Pitch Script Generator | AI Investor Pitch Script Tool - PitchDesk',
    description: 'Generate professional startup pitch scripts with AI. Create compelling investor pitch presentations, funding pitch narratives, and structured pitch documents in minutes with PitchDesk\'s AI pitch writing assistant.',
    canonical: '/features/pitch-script-generator',
    keywords: [
        'startup pitch script generator',
        'investor pitch script AI',
        'funding pitch writing assistant',
        'pitch presentation script tool',
        'automated pitch document creator',
    ],
});

export default function PitchScriptGeneratorPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'Pitch Script Generator',
        description: 'AI-powered tool to generate professional startup pitch scripts',
        url: 'https://pitchdesk.in/features/pitch-script-generator',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'Pitch Script Generator', url: '/features/pitch-script-generator' },
    ]);

    return (
        <>
            <script type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(featureSchema) }} />
            <script type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
                    <div className="max-w-4xl mx-auto">
                        <Link
                            href="/features"
                            className="inline-flex items-center text-primary hover:opacity-80 mb-6 font-medium transition-opacity"
                        >
                            ← Back to Features
                        </Link>

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                            <FileText className="w-4 h-4" />
                            AI-Powered Pitch Writing
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            <span className="text-primary">Startup Pitch Script Generator</span> Powered by AI
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            Generate professional <strong className="text-foreground">investor pitch scripts</strong> in minutes. Our AI creates structured, compelling pitch narratives tailored to your startup, audience, and fundraising goals.
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                            <Link
                                href="/generate-pitch"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" />
                                Generate Your Pitch Script
                            </Link>
                            <Link
                                href="/features/ai-pitch-simulator"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300"
                            >
                                Practice After Generating
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Does */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                            What is the Pitch Script Generator?
                        </h2>

                        <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                Our <strong className="text-foreground">startup pitch script generator</strong> is an AI-powered tool that writes professional investor pitch narratives based on your startup details. It&apos;s like having a pitch coach and copywriter in one—creating structured, compelling scripts optimized for fundraising.
                            </p>

                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                Instead of staring at a blank page wondering how to structure your pitch, our <strong className="text-foreground">funding pitch writing assistant</strong> generates a complete script including your problem statement, solution, market opportunity, traction, business model, and ask.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">&lt;5 min</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Script generation time</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">100%</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Customized to your startup</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">∞</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Unlimited revisions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who It's For */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Who Needs a Pitch Script Generator?
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                            <div className="bg-card text-card-foreground rounded-2xl p-6 sm:p-8 border border-border hover:shadow-lg transition-all hover:border-primary/50">
                                <Edit3 className="w-10 h-10 sm:w-12 sm:h-12 mb-4 text-primary" />
                                <h3 className="text-lg sm:text-2xl font-bold mb-4">Non-Native English Speakers</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Struggling to express your vision in perfect English? Our <strong className="text-foreground">investor pitch script AI</strong> creates fluent, professional narratives that sound natural and compelling to English-speaking investors.
                                </p>
                            </div>

                            <div className="bg-card text-card-foreground rounded-2xl p-6 sm:p-8 border border-border hover:shadow-lg transition-all hover:border-primary/50">
                                <FileText className="w-10 h-10 sm:w-12 sm:h-12 mb-4 text-primary" />
                                <h3 className="text-lg sm:text-2xl font-bold mb-4">Technical Founders</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Great at building products, not pitching? Let our AI translate your technical vision into an investor-friendly story. Focus on what you do best—we&apos;ll handle the narrative.
                                </p>
                            </div>

                            <div className="bg-card text-card-foreground rounded-2xl p-6 sm:p-8 border border-border hover:shadow-lg transition-all hover:border-primary/50">
                                <Zap className="w-10 h-10 sm:w-12 sm:h-12 mb-4 text-primary" />
                                <h3 className="text-lg sm:text-2xl font-bold mb-4">Time-Pressed Founders</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Have a pitch meeting tomorrow? Use our <strong className="text-foreground">pitch presentation script tool</strong> to generate a complete, polished script in minutes instead of spending days writing and rewriting.
                                </p>
                            </div>

                            <div className="bg-card text-card-foreground rounded-2xl p-6 sm:p-8 border border-border hover:shadow-lg transition-all hover:border-primary/50">
                                <Target className="w-10 h-10 sm:w-12 sm:h-12 mb-4 text-primary" />
                                <h3 className="text-lg sm:text-2xl font-bold mb-4">Pivoting Startups</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Changed your business model or target market? Quickly regenerate your pitch script to reflect your new direction without starting from scratch.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-secondary/20">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            How to Generate Your Pitch Script
                        </h2>

                        <div className="space-y-6 sm:space-y-8">
                            {/* Step 1 */}
                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">Enter Your Startup Details</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Fill in basic information about your startup: name, industry, problem you&apos;re solving, solution, target market, traction (if any), business model, and funding ask. The more details you provide, the better your script.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">Choose Your Pitch Type</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Select your pitch format: elevator pitch (30 seconds), short pitch (3 minutes), full pitch (10 minutes), or demo day pitch (5 minutes). Each format optimizes length and depth accordingly.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">AI Generates Your Script</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Our AI analyzes your inputs and generates a complete pitch script following proven storytelling frameworks. It structures your narrative, adds compelling hooks, and optimizes for investor engagement.
                                    </p>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    4
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">Refine & Export</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Review your script, make edits if needed, and export it in multiple formats (PDF, Word, or plain text). You can also regenerate with different focuses or ask our AI to refine specific sections.
                                    </p>
                                </div>
                            </div>

                            {/* Step 5 */}
                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    5
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">Practice with AI Judges</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Take your generated script directly into our <Link href="/features/ai-pitch-simulator" className="text-primary font-semibold hover:underline">AI Pitch Simulator</Link> to practice delivery and get feedback on how well the script performs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What's Included */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            What Your Pitch Script Includes
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                {
                                    title: 'Compelling Opening Hook',
                                    description: 'Start strong with an attention-grabbing opening that makes investors lean in. Our AI crafts hooks based on proven storytelling techniques.',
                                },
                                {
                                    title: 'Clear Problem Statement',
                                    description: 'Articulate the pain point you\'re solving in a way that resonates with investors. Make them feel the problem before you present the solution.',
                                },
                                {
                                    title: 'Solution Overview',
                                    description: 'Explain your product or service clearly, highlighting what makes it unique and why it\'s 10x better than existing alternatives.',
                                },
                                {
                                    title: 'Market Opportunity',
                                    description: 'Present the market size and opportunity using TAM, SAM, SOM frameworks. Show investors the scale of the opportunity you\'re pursuing.',
                                },
                                {
                                    title: 'Traction & Validation',
                                    description: 'Showcase your progress, early customers, revenue (if any), partnerships, or other proof points that validate your startup.',
                                },
                                {
                                    title: 'Business Model',
                                    description: 'Clearly explain how you make money, your pricing strategy, customer acquisition costs, and unit economics.',
                                },
                                {
                                    title: 'Competitive Landscape',
                                    description: 'Position yourself against competitors and alternatives. Show what makes you different and defensible.',
                                },
                                {
                                    title: 'Team Introduction',
                                    description: 'Highlight your team\'s expertise, relevant experience, and why you\'re the right people to build this company.',
                                },
                                {
                                    title: 'Funding Ask & Use of Funds',
                                    description: 'State your raise amount and explain exactly how you\'ll deploy the capital to achieve specific milestones.',
                                },
                                {
                                    title: 'Closing Call-to-Action',
                                    description: 'End with a strong close that invites next steps and leaves investors excited to learn more.',
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-base sm:text-xl font-bold text-foreground mb-2">{item.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-primary/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-foreground">
                            Why Use an AI Pitch Script Generator?
                        </h2>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                                <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Save Hours of Writing Time</h3>
                                <p className="text-muted-foreground">
                                    Stop agonizing over every word. Generate a complete, polished script in minutes instead of spending days writing, rewriting, and structuring your pitch.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                                <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Follow Proven Pitch Frameworks</h3>
                                <p className="text-muted-foreground">
                                    Our AI is trained on thousands of successful pitches. It automatically structures your script using frameworks that have raised billions in funding.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                                <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Overcome Writer&apos;s Block</h3>
                                <p className="text-muted-foreground">
                                    Don&apos;t know where to start? Our automated pitch document creator gives you a professional foundation to build from, saving you from the blank page paralysis.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                                <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Multiple Versions for Different Scenarios</h3>
                                <p className="text-muted-foreground">
                                    Generate different versions for different audiences: VC pitch, accelerator application, demo day, or customer pitch. Each optimized for its specific context.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                                <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Professional Language & Tone</h3>
                                <p className="text-muted-foreground">
                                    The AI writes in professional, investor-friendly language that sounds natural and compelling. No awkward phrasing or robotic language.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Real Use Cases */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            When to Use the Script Generator
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border hover:border-primary/30 transition-colors">
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Before Your First Pitch</h3>
                                <p className="text-muted-foreground">
                                    Never pitched before? Generate a professional script to use as your foundation. It&apos;s like having a pitch coach write your first draft.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border hover:border-primary/30 transition-colors">
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Accelerator Applications</h3>
                                <p className="text-muted-foreground">
                                    Need a polished pitch for Y Combinator, Techstars, or other accelerators? Generate a script tailored to accelerator requirements.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border hover:border-primary/30 transition-colors">
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Pitch Competition Prep</h3>
                                <p className="text-muted-foreground">
                                    Entering TechCrunch Disrupt or a local pitch contest? Generate a time-optimized script that fits the competition format perfectly.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border hover:border-primary/30 transition-colors">
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Pre-Fundraise</h3>
                                <p className="text-muted-foreground">
                                    Starting your fundraising journey? Create a baseline pitch script that you can refine as you meet with more investors and get feedback.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Features */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8 text-center">
                            Related Features
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <Link href="/features/ai-pitch-simulator" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">AI Pitch Simulator</h3>
                                <p className="text-muted-foreground text-sm">Practice your generated script with AI judges.</p>
                            </Link>

                            <Link href="/features/real-time-feedback" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Real-Time Feedback</h3>
                                <p className="text-muted-foreground text-sm">Get live coaching on how you deliver the script.</p>
                            </Link>

                            <Link href="/features/pitch-analysis" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Analysis</h3>
                                <p className="text-muted-foreground text-sm">See how your script performs in simulated pitches.</p>
                            </Link>

                            <Link href="/features/pitch-deck-generation" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Presentation className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Deck Generation</h3>
                                <p className="text-muted-foreground text-sm">Turn your narrative into investor-ready slides.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-8 sm:p-12 text-primary-foreground shadow-2xl">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
                            Generate Your Pitch Script in Minutes
                        </h2>
                        <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8">
                            Stop staring at a blank page. Let AI write your first draft.
                        </p>
                        <Link
                            href="/generate-pitch"
                            className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-background text-foreground rounded-lg font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                            Start Generating Now
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
