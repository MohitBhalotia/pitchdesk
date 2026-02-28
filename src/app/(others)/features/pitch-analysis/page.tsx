import type { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3, FileText, TrendingUp, Target, CheckCircle2, ArrowRight, Eye, Award } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'AI Pitch Scoring System | Pitch Transcript Analysis Tool - PitchDesk',
    description: 'Get detailed AI pitch scoring and analysis after every pitch. Pitch transcript analysis, scoring rubrics, performance metrics, and actionable improvement tips. AI tool to evaluate startup pitch quality.',
    canonical: '/features/pitch-analysis',
    keywords: [
        'AI pitch scoring system',
        'pitch transcript analysis tool',
        'automated pitch evaluation',
        'AI tool to evaluate startup pitch',
        'pitch performance scoring software',
    ],
});

export default function PitchAnalysisPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'Pitch Analysis',
        description: 'AI pitch scoring system with detailed transcript analysis and performance metrics',
        url: 'https://pitchdesk.in/features/pitch-analysis',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'Pitch Analysis', url: '/features/pitch-analysis' },
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
                            className="inline-flex items-center text-primary hover:opacity-80 mb-6 font-medium"
                        >
                            ← Back to Features
                        </Link>

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                            <BarChart3 className="w-4 h-4" />
                            Detailed Performance Insights
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            <span className="text-primary">AI Pitch Analysis</span> & Scoring System
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            Get comprehensive <strong>AI pitch scoring</strong> and detailed analysis after every pitch. See transcripts, scoring breakdowns, performance metrics, and actionable insights with our <strong>pitch transcript analysis tool</strong>.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/start-a-pitch"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Target className="w-5 h-5" />
                                Try a Pitch & Get Analysis
                            </Link>
                            <Link
                                href="/features/ai-pitch-simulator"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300"
                            >
                                Learn About AI Simulator
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Is */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                            What is Pitch Analysis?
                        </h2>

                        <div className="bg-card rounded-2xl p-8 md:p-10 shadow-lg border border-border">
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                After every pitch on PitchDesk, our <strong>AI pitch scoring system</strong> generates a detailed analysis report. It&apos;s not just a score—it&apos;s a complete breakdown of your pitch performance with specific insights on what worked and what didn&apos;t.
                            </p>

                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                Our <strong>AI tool to evaluate startup pitch</strong> quality provides transcript analysis, scoring rubrics, performance trends, and personalized recommendations. Think of it as having a pitch coach review every session and give you detailed feedback.
                            </p>

                            <div className="grid md:grid-cols-3 gap-6 mt-8">
                                <div className="text-center p-6 bg-primary/5 rounded-xl">
                                    <div className="text-4xl font-bold text-primary mb-2">/100</div>
                                    <p className="text-muted-foreground">Comprehensive score</p>
                                </div>
                                <div className="text-center p-6 bg-primary/5 rounded-xl">
                                    <div className="text-4xl font-bold text-primary mb-2">Full</div>
                                    <p className="text-muted-foreground">Transcript analysis</p>
                                </div>
                                <div className="text-center p-6 bg-primary/5 rounded-xl">
                                    <div className="text-4xl font-bold text-primary mb-2">Actionable</div>
                                    <p className="text-muted-foreground">Improvement tips</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What's Included */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
                            What&apos;s Included in Your Pitch Analysis
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: 'Overall Pitch Score',
                                    description: 'A comprehensive score out of 100 that evaluates your entire pitch across multiple dimensions. See at a glance how well you performed.',
                                },
                                {
                                    title: 'Scoring Breakdown by Category',
                                    description: 'Detailed scores for market opportunity, problem/solution fit, business model, traction, team, competitive advantage, pitch delivery, and clarity.',
                                },
                                {
                                    title: 'Full Pitch Transcript',
                                    description: 'Complete word-for-word transcript of your pitch and the AI\'s questions. Review exactly what was said, when, and how.',
                                },
                                {
                                    title: 'Strengths Identified',
                                    description: 'The AI highlights what you did well: strong storytelling, clear value proposition, impressive traction, confident delivery, etc.',
                                },
                                {
                                    title: 'Areas for Improvement',
                                    description: 'Specific, actionable feedback on what to improve: weak market analysis, vague business model, lack of defensibility, unclear ask, etc.',
                                },
                                {
                                    title: 'Question-by-Question Analysis',
                                    description: 'For each AI question, see how well you answered, what was good, and what could be better. Understand your Q&A performance.',
                                },
                                {
                                    title: 'Delivery Metrics',
                                    description: 'If you used voice, see metrics on speech pacing, filler words, confidence level, energy, pauses, and articulation quality.',
                                },
                                {
                                    title: 'Comparison to Benchmarks',
                                    description: 'See how your score compares to other pitches in your industry, stage, or on the platform. Understand where you stand.',
                                },
                                {
                                    title: 'Progress Tracking Over Time',
                                    description: 'Track your improvement across multiple pitch sessions. See trends in your scores and measure your growth as you practice.',
                                },
                                {
                                    title: 'Shareable Reports',
                                    description: 'Download or share your pitch analysis with co-founders, advisors, or mentors for additional feedback and guidance.',
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Scoring Dimensions */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-card/50">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
                            AI Scoring Dimensions
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold">
                                        25%
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">Market Opportunity</h3>
                                        <p className="text-muted-foreground">
                                            Market size (TAM/SAM/SOM), growth potential, market timing, and understanding of target customers. Is the opportunity big enough?
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold">
                                        20%
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">Problem & Solution Fit</h3>
                                        <p className="text-muted-foreground">
                                            Clarity of problem, pain point severity, solution effectiveness, and product-market fit. Does your solution actually solve the problem?
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold">
                                        15%
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">Team & Execution</h3>
                                        <p className="text-muted-foreground">
                                            Founder expertise, domain knowledge, team completeness, and execution capability. Are you the right team to build this?
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold">
                                        15%
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">Traction & Validation</h3>
                                        <p className="text-muted-foreground">
                                            Customer traction, revenue (if any), growth metrics, partnerships, and market validation. Do you have proof this works?
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold">
                                        10%
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">Business Model</h3>
                                        <p className="text-muted-foreground">
                                            Revenue model clarity, unit economics, pricing strategy, customer acquisition costs, and path to profitability.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold">
                                        10%
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">Competitive Advantage</h3>
                                        <p className="text-muted-foreground">
                                            Differentiation from competitors, defensibility (tech, network effects, brand), and barriers to entry. What makes you special?
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold">
                                        5%
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">Pitch Quality & Delivery</h3>
                                        <p className="text-muted-foreground">
                                            Clarity of communication, storytelling ability, confidence, energy level, and ability to handle tough questions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-primary">
                    <div className="max-w-4xl mx-auto text-primary-foreground">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                            Why Pitch Analysis Matters
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
                                <h3 className="text-xl font-bold mb-2">Know Exactly Where to Improve</h3>
                                <p className="text-primary-foreground/90">
                                    Generic feedback like &quot;good job&quot; doesn&apos;t help you improve. Detailed analysis tells you exactly what&apos;s weak and how to fix it.
                                </p>
                            </div>

                            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
                                <h3 className="text-xl font-bold mb-2">See Your Progress Over Time</h3>
                                <p className="text-primary-foreground/90">
                                    Track how your pitch evolves across practice sessions. Watch your scores improve and celebrate milestones as you get better.
                                </p>
                            </div>

                            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
                                <h3 className="text-xl font-bold mb-2">Learn from Your Mistakes Privately</h3>
                                <p className="text-primary-foreground/90">
                                    Practice pitches' analyses are private. Make mistakes, learn from them, and refine your pitch before taking it to real investors.
                                </p>
                            </div>

                            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
                                <h3 className="text-xl font-bold mb-2">Share with Your Team</h3>
                                <p className="text-primary-foreground/90">
                                    Download analysis reports and share with co-founders, advisors, or mentors. Get their input on how to address the AI&apos;s feedback.
                                </p>
                            </div>

                            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
                                <h3 className="text-xl font-bold mb-2">Benchmark Against Others</h3>
                                <p className="text-primary-foreground/90">
                                    Understand how competitive your pitch is by seeing how you stack up against other startups in your industry or stage.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Use Cases */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
                            When to Use Pitch Analysis
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-card rounded-xl p-6 border border-border">
                                <h3 className="text-xl font-bold text-foreground mb-3">After Every Practice Session</h3>
                                <p className="text-muted-foreground">
                                    Review the analysis after each pitch so you know exactly what to work on before your next practice.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-6 border border-border">
                                <h3 className="text-xl font-bold text-foreground mb-3">Before a Real VC Meeting</h3>
                                <p className="text-muted-foreground">
                                    Do a final practice pitch and review the analysis to identify any last-minute weak spots to address before your meeting.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-6 border border-border">
                                <h3 className="text-xl font-bold text-foreground mb-3">Competition Preparation</h3>
                                <p className="text-muted-foreground">
                                    Use the analysis to fine-tune your pitch before entering competitions. Address weaknesses to maximize your leaderboard score.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-6 border border-border">
                                <h3 className="text-xl font-bold text-foreground mb-3">Tracking Long-Term Growth</h3>
                                <p className="text-muted-foreground">
                                    Save analysis reports over weeks/months to see how much you&apos;ve improved. Use it for reflection and to motivate your team.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Example Report Preview */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                            Example Pitch Analysis Report
                        </h2>

                        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                            <div className="flex items-center justify-between mb-6 pb-6 border-b">
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground">Your Pitch Score</h3>
                                    <p className="text-muted-foreground">Evaluated on {new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-primary">78</div>
                                    <p className="text-muted-foreground">/100</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-foreground">Market Opportunity</span>
                                        <span className="text-primary font-bold">22/25</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full" style={{ width: '88%' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-foreground">Problem & Solution</span>
                                        <span className="text-primary font-bold">16/20</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-foreground">Team & Execution</span>
                                        <span className="text-primary font-bold">12/15</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-foreground">Traction & Validation</span>
                                        <span className="text-primary font-bold">9/15</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-foreground">Business Model</span>
                                        <span className="text-primary font-bold">8/10</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-foreground">Competitive Advantage</span>
                                        <span className="text-primary font-bold">8/10</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-foreground">Pitch Quality</span>
                                        <span className="text-primary font-bold">3/5</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t">
                                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-primary" />
                                    Strengths
                                </h4>
                                <ul className="space-y-2 text-muted-foreground mb-6">
                                    <li>• Clear articulation of market size and opportunity</li>
                                    <li>• Strong understanding of customer pain points</li>
                                    <li>• Well-defined business model and revenue streams</li>
                                </ul>

                                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-primary" />
                                    Areas for Improvement
                                </h4>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>• Provide more concrete traction metrics (customers, revenue, growth)</li>
                                    <li>• Reduce filler words to sound more confident</li>
                                    <li>• Strengthen your competitive positioning</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Features */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                            Related Features
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            <Link href="/features/ai-pitch-simulator" className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Target className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">AI Pitch Simulator</h3>
                                <p className="text-muted-foreground text-sm">Practice pitching to get analysis reports.</p>
                            </Link>

                            <Link href="/features/real-time-feedback" className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Eye className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">Real-Time Feedback</h3>
                                <p className="text-muted-foreground text-sm">Get live delivery feedback during pitches.</p>
                            </Link>

                            <Link href="/features/pitch-script-generator" className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <FileText className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">Pitch Script Generator</h3>
                                <p className="text-muted-foreground text-sm">Generate strong scripts to improve your scores.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-12 text-primary-foreground shadow-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Get Your First Pitch Analysis
                        </h2>
                        <p className="text-xl opacity-90 mb-8">
                            Practice a pitch and see detailed AI analysis of your performance.
                        </p>
                        <Link
                            href="/start-a-pitch"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-card text-primary rounded-lg font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            <Target className="w-6 h-6" />
                            Start Pitching & Get Analysis
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
