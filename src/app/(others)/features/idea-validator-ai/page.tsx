import type { Metadata } from 'next';
import Link from 'next/link';
import { Lightbulb, Target, TrendingUp, CheckCircle2, ArrowRight, Play, MessageSquare, BarChart3, Search, Zap, Sparkles } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'AI Idea Validator | Validate Your Startup Idea with AI VC',
    description: 'Validate your startup idea with our AI idea validator. Get instant feedback on market potential, competition analysis, and business viability. The best startup idea validation tool powered by AI.',
    canonical: '/features/idea-validator-ai',
    keywords: [
        'startup idea validation tool',
        'AI idea validator for startups',
        'validate business idea online',
        'startup idea feedback AI',
        'market validation tool',
        'competitive analysis AI startup',
        'is my startup idea good',
        'idea validation platform',
        'business idea tester',
        'startup idea analyzer',
    ],
});

export default function IdeaValidatorAIPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'AI Idea Validator',
        description: 'Validate your startup idea with AI-powered analysis of market potential, competition, and business viability',
        url: 'https://pitchdesk.in/features/idea-validator-ai',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'AI Idea Validator', url: '/features/idea-validator-ai' },
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
                            <Lightbulb className="w-4 h-4" />
                            Early-Stage Idea Validation
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            <span className="text-primary">Validate Your Startup Idea</span> with AI Before Building
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            Not sure if your idea is worth pursuing? Talk to our <strong className="text-foreground">AI idea validator</strong>—a specialized AI VC that analyzes your startup concept, discusses market potential, evaluates competition, and gives you honest feedback before you invest time and money.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <span className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary/80 text-primary-foreground rounded-lg font-semibold cursor-not-allowed opacity-90">
                                <Lightbulb className="w-5 h-5" />
                                Validate My Idea (Coming Soon)
                            </span>
                            <Link
                                href="/features/ai-pitch-simulator"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300"
                            >
                                Practice Full Pitch Instead
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Does */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                            What is the AI Idea Validator?
                        </h2>

                        <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                The <strong className="text-foreground">AI idea validator</strong> is a specialized AI VC designed specifically for early-stage founders who want to <strong className="text-foreground">validate business ideas online</strong> before committing resources. Unlike our pitch simulator that evaluates your presentation skills, this tool focuses entirely on your idea&apos;s merit.
                            </p>

                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                Think of it as having a <strong className="text-foreground">startup idea feedback AI</strong> that acts like an experienced VC partner—asking probing questions about your market, challenging your assumptions about competition, and helping you identify blind spots in your business model. It&apos;s the <strong className="text-foreground">best startup idea validation tool</strong> for founders who want honest, data-informed feedback.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Market</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Size & opportunity analysis</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Competition</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Landscape & differentiation</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Viability</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Business model assessment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who It's For */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Who Should Use the AI Idea Validator?
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { title: 'First-Time Founders', desc: 'Wondering "is my startup idea good?" Get objective AI feedback before you quit your job.' },
                                { title: 'Serial Entrepreneurs', desc: 'Quickly validate multiple ideas and identify which one has the most potential.' },
                                { title: 'Side Project Starters', desc: 'Test your weekend idea before investing months of evening hours building it.' },
                                { title: 'Pivot Explorers', desc: 'Evaluating a pivot? Validate the new direction before abandoning your current path.' },
                                { title: 'Hackathon Teams', desc: 'Quickly assess idea viability before committing your hackathon to a specific direction.' },
                                { title: 'Student Founders', desc: 'Validate your thesis project or startup idea with real-world market analysis.' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{item.title}</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-secondary/20">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            How Does Idea Validation Work?
                        </h2>

                        <div className="space-y-6 sm:space-y-8">
                            {[
                                { num: '1', title: 'Describe Your Idea', desc: 'Share your startup concept—problem you\'re solving, target audience, and proposed solution. No pitch deck needed.' },
                                { num: '2', title: 'AI Asks Probing Questions', desc: 'The AI digs deeper into your assumptions about market size, customer pain points, and competitive landscape.' },
                                { num: '3', title: 'Market & Competition Analysis', desc: 'Get AI-powered insights on market potential, existing competitors, and gaps your idea could fill.' },
                                { num: '4', title: 'Viability Assessment', desc: 'Receive honest feedback on business model, monetization potential, and key risks to address.' },
                                { num: '5', title: 'Actionable Recommendations', desc: 'Walk away with specific next steps—whether to proceed, pivot, or explore alternatives.' },
                            ].map((step) => (
                                <div key={step.num} className="flex gap-4 sm:gap-6 items-start">
                                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                        {step.num}
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">{step.title}</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* What You'll Learn */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            What You&apos;ll Learn About Your Idea
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { icon: Search, title: 'Market Opportunity', desc: 'Is the market big enough? Growing or shrinking? What\'s the total addressable market for your idea?' },
                                { icon: Target, title: 'Competitive Landscape', desc: 'Who else is solving this problem? What\'s your differentiation? Can you actually win?' },
                                { icon: TrendingUp, title: 'Business Model Viability', desc: 'Can this make money? What are realistic revenue models? What\'s the path to profitability?' },
                                { icon: Zap, title: 'Key Risks & Blockers', desc: 'What could kill this idea? Technical, market, or regulatory risks you should know about.' },
                            ].map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-lg border border-border">
                                        <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
                                        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">{item.title}</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-primary/5">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Why Validate Your Idea with AI?
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { icon: CheckCircle2, title: 'Save Time & Money', desc: 'Don\'t spend 6 months building something nobody wants. Validate first, build second.' },
                                { icon: Target, title: 'Objective Feedback', desc: 'Friends and family say "great idea!" An AI gives you honest, unbiased analysis.' },
                                { icon: TrendingUp, title: 'Data-Informed Decisions', desc: 'Move beyond gut feelings with market data and competitive intelligence.' },
                            ].map((benefit, idx) => {
                                const Icon = benefit.icon;
                                return (
                                    <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-lg border border-border">
                                        <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
                                        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground">{benefit.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* vs Pitch Simulator */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                            Idea Validator vs. Pitch Simulator
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                            <div className="bg-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/20">
                                <Lightbulb className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
                                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Idea Validator</h3>
                                <ul className="space-y-3 text-muted-foreground text-sm sm:text-base">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>For <strong className="text-foreground">early-stage ideas</strong> before building</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>Focuses on <strong className="text-foreground">market & viability</strong></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>No pitch deck required</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>Answers &quot;Should I build this?&quot;</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border">
                                <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
                                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Pitch Simulator</h3>
                                <ul className="space-y-3 text-muted-foreground text-sm sm:text-base">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>For <strong className="text-foreground">fundraising preparation</strong></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>Focuses on <strong className="text-foreground">presentation skills</strong></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>Simulates VC Q&A sessions</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>Answers &quot;How do I pitch this?&quot;</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Features */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
                            Related Features
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <Link href="/features/ai-pitch-simulator" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">AI Pitch Simulator</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Ready to pitch? Practice with AI VCs.</p>
                            </Link>

                            <Link href="/features/pitch-script-generator" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Script Generator</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Turn your validated idea into a pitch.</p>
                            </Link>

                            <Link href="/features/ai-virtual-cofounder" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">AI Virtual Co-Founder</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Discuss strategy daily with your AI partner.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-8 sm:p-12 text-primary-foreground shadow-2xl">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
                            Is Your Idea Worth Building?
                        </h2>
                        <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8">
                            Find out in minutes. Validate your startup idea with AI before investing months of work.
                        </p>
                        <span className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-primary-foreground/20 text-primary-foreground rounded-lg font-bold text-base sm:text-lg border border-primary-foreground/30 cursor-not-allowed">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                            Validate My Idea (Coming Soon)
                        </span>
                    </div>
                </section>
            </div>
        </>
    );
}
