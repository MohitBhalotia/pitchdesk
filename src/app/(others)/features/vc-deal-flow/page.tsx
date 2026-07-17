import type { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3, Filter, Zap, Database, TrendingUp, CheckCircle2, ArrowRight, Inbox } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'VC Deal Flow Automation Software | AI Startup Screening',
    description: 'Automate startup screening and deal flow management with PitchDesk. AI-powered pitch screening for VCs, automated startup evaluation, and intelligent application management. Scale your deal flow effortlessly.',
    canonical: '/features/vc-deal-flow',
    keywords: [
        'VC deal flow automation software',
        'AI startup screening',
        'automated pitch screening',
        'AI startup evaluation system',
        'deal flow management for VCs',
        'AI pitch screening for investors',
    ],
});

export default function VCDealFlowPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'VC Deal Flow Automation',
        description: 'AI-powered startup screening and deal flow management for VCs and investors',
        url: 'https://pitchdesk.in/features/vc-deal-flow',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'VC Deal Flow Automation', url: '/features/vc-deal-flow' },
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

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-lavender text-lavender-foreground rounded-full text-sm font-medium mb-6">
                            <BarChart3 className="w-4 h-4" />
                            For VCs & Investors
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            <span className="text-primary">VC Deal Flow Automation</span> with AI Screening
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            Automate startup screening with <strong className="text-foreground">VC deal flow automation software</strong>. Use AI-powered pitch analysis to evaluate hundreds of startups, filter top deals, and manage applications effortlessly.
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                            <Link
                                href="/dashboard"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Zap className="w-5 h-5" />
                                Start Automating Deal Flow
                            </Link>
                            <Link
                                href="/features/ai-vc-agents"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300"
                            >
                                Build Custom AI Agents
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Is */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                            What is VC Deal Flow Automation?
                        </h2>

                        <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                PitchDesk&apos;s <strong className="text-foreground">automated pitch screening</strong> system helps VCs evaluate, filter, and manage startup applications at scale using AI. Instead of manually watching every pitch, let AI pre-screen startups and surface only the top candidates.
                            </p>

                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                Our <strong className="text-foreground">AI startup evaluation system</strong> analyzes pitch content, team, market, traction, and business models—then scores and ranks startups automatically. You review the best performers, not every application.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
                                <div className="text-center p-4 sm:p-6 bg-mint/25 rounded-xl">
                                    <div className="text-3xl sm:text-4xl font-bold text-ink mb-2">10x</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">More applications screened</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-yellow/25 rounded-xl">
                                    <div className="text-3xl sm:text-4xl font-bold text-ink mb-2">90%</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Reduction in screening time</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-pink/25 rounded-xl">
                                    <div className="text-3xl sm:text-4xl font-bold text-ink mb-2">100%</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Consistent evaluation</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Features */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Key Features of Deal Flow Automation
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                {
                                    title: 'AI-Powered Startup Screening',
                                    description: 'Let AI evaluate every pitch against your criteria. Automatically score startups on market, team, traction, tech, and fit with your thesis.',
                                },
                                {
                                    title: 'Automated Application Management',
                                    description: 'Track all applications in one dashboard. See status, scores, notes, and communication history for every startup in your pipeline.',
                                },
                                {
                                    title: 'Custom Scoring Criteria',
                                    description: 'Define your own evaluation rubric. Weight factors like traction, market size, team experience, or tech innovation based on your investment focus.',
                                },
                                {
                                    title: 'Intelligent Filtering',
                                    description: 'Filter applications by score, industry, stage, geography, or any custom criteria. Surface only the deals that meet your requirements.',
                                },
                                {
                                    title: 'Pitch Transcript Analysis',
                                    description: 'AI transcribes and analyzes every pitch. Search by keywords, identify patterns, and extract key insights from pitch content.',
                                },
                                {
                                    title: 'Deal Flow Dashboard',
                                    description: 'Visual dashboards show your entire pipeline at a glance. Track applications, review scores, manage communications, and make decisions faster.',
                                },
                                {
                                    title: 'Collaborative Workflows',
                                    description: 'Assign pitches to team members, add notes, and collaborate on decisions. Everyone on your team sees the same data and context.',
                                },
                                {
                                    title: 'Integration with Investment Programs',
                                    description: 'Applications submitted to your investment programs automatically flow into your deal pipeline for evaluation and tracking.',
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{item.title}</h3>
                                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-secondary/20">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            How Deal Flow Automation Works
                        </h2>

                        <div className="space-y-6 sm:space-y-8">
                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">Create AI VC Agents</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        Build custom AI judges with your investment thesis, evaluation criteria, and focus areas. Each agent represents your unique screening process.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">Startups Pitch to Your AI</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        Founders pitch to your AI agent through competitions, programs, or direct applications. The AI evaluates each pitch consistently.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">AI Scores & Ranks Applications</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        Every pitch is scored and ranked automatically. Top performers appear in your dashboard, ready for human review.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    4
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">Review & Make Decisions</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        Review top-scored startups, watch pitch recordings, read transcripts, and make investment decisions. Accept, reject, or request more information.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-primary">
                    <div className="max-w-4xl mx-auto text-primary-foreground">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">
                            Why Automate Your Deal Flow?
                        </h2>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-primary-foreground/20">
                                <h3 className="text-lg sm:text-xl font-bold mb-2">Scale Without Adding Headcount</h3>
                                <p className="text-primary-foreground/90 text-sm sm:text-base">
                                    Evaluate 10x more startups without hiring more analysts. AI does the initial screening, so your team focuses only on the best deals.
                                </p>
                            </div>

                            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-primary-foreground/20">
                                <h3 className="text-lg sm:text-xl font-bold mb-2">Never Miss a Great Deal</h3>
                                <p className="text-primary-foreground/90 text-sm sm:text-base">
                                    Manual screening means great startups slip through the cracks. AI evaluates every application consistently, ensuring no diamond goes unnoticed.
                                </p>
                            </div>

                            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-primary-foreground/20">
                                <h3 className="text-lg sm:text-xl font-bold mb-2">Reduce Bias in Screening</h3>
                                <p className="text-primary-foreground/90 text-sm sm:text-base">
                                    Human bias affects decision-making. AI evaluates objectively based on predefined criteria, ensuring fair assessment for every startup.
                                </p>
                            </div>

                            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-primary-foreground/20">
                                <h3 className="text-lg sm:text-xl font-bold mb-2">Faster Time-to-Decision</h3>
                                <p className="text-primary-foreground/90 text-sm sm:text-base">
                                    Founders hate waiting weeks for a response. With automated screening, you can respond to top deals within days, not months.
                                </p>
                            </div>

                            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-primary-foreground/20">
                                <h3 className="text-lg sm:text-xl font-bold mb-2">Data-Driven Investment Decisions</h3>
                                <p className="text-primary-foreground/90 text-sm sm:text-base">
                                    Every pitch is scored with detailed metrics. Make investment decisions backed by data, not just gut feeling.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Use Cases */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Who Uses Deal Flow Automation?
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                            <div className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-8">
                                <Database className="w-10 h-10 sm:w-12 sm:h-12 mb-4 opacity-90" />
                                <h3 className="text-lg sm:text-2xl font-bold mb-4">VC Firms</h3>
                                <p className="text-primary-foreground/90 text-sm sm:text-base leading-relaxed">
                                    Screen hundreds of inbound pitches monthly. Use AI to filter signal from noise and focus your team on high-quality deals.
                                </p>
                            </div>

                            <div className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-8">
                                <Inbox className="w-10 h-10 sm:w-12 sm:h-12 mb-4 opacity-90" />
                                <h3 className="text-lg sm:text-2xl font-bold mb-4">Accelerators & Incubators</h3>
                                <p className="text-primary-foreground/90 text-sm sm:text-base leading-relaxed">
                                    Manage cohort applications at scale. Automatically evaluate every applicant and invite top-scored startups to interview rounds.
                                </p>
                            </div>

                            <div className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-8">
                                <Filter className="w-10 h-10 sm:w-12 sm:h-12 mb-4 opacity-90" />
                                <h3 className="text-lg sm:text-2xl font-bold mb-4">Corporate VCs</h3>
                                <p className="text-primary-foreground/90 text-sm sm:text-base leading-relaxed">
                                    Find strategic acquisitions and partnership opportunities. Filter startups by tech stack, market, and strategic fit.
                                </p>
                            </div>

                            <div className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-8">
                                <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 mb-4 opacity-90" />
                                <h3 className="text-lg sm:text-2xl font-bold mb-4">Angel Networks</h3>
                                <p className="text-primary-foreground/90 text-sm sm:text-base leading-relaxed">
                                    Distribute deal flow across network members. Let AI pre-screen so angels see only relevant, high-quality opportunities.
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
                            <Link href="/features/ai-vc-agents" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">AI VC Agents</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Build custom AI judges for your screening process.</p>
                            </Link>

                            <Link href="/features/investment-programs" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Database className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Investment Programs</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Launch programs that feed into your deal flow.</p>
                            </Link>

                            <Link href="/features/pitch-competitions" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Competitions</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Host competitions to discover top startups.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-8 sm:p-12 text-primary-foreground shadow-2xl">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
                            Automate Your Deal Flow Today
                        </h2>
                        <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8">
                            Stop manually screening every pitch. Let AI surface the best deals.
                        </p>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-background text-foreground rounded-lg font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                            Get Started with AI Screening
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
