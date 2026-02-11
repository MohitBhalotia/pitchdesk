import type { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3, Filter, Zap, Database, TrendingUp, CheckCircle2, ArrowRight, Inbox } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'VC Deal Flow Automation Software | AI Startup Screening - PitchDesk',
    description: 'Automate startup screening and deal flow management with PitchDesk. AI-powered pitch screening for VCs, automated startup evaluation, and intelligent application management. Scale your deal flow effortlessly.',
    canonical: '/features/vc-deal-flow',
    keywords: [
        'VC deal flow automation software',
        'AI startup screening',
        'automated pitch screening',
        'AI startup evaluation system',
        'deal flow management for VCs',
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

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50">
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-16 md:py-20">
                    <div className="max-w-4xl mx-auto">
                        <Link
                            href="/features"
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6 font-medium"
                        >
                            ← Back to Features
                        </Link>

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
                            <BarChart3 className="w-4 h-4" />
                            For VCs & Investors
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">VC Deal Flow Automation</span> with AI Screening
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                            Automate startup screening with <strong>VC deal flow automation software</strong>. Use AI-powered pitch analysis to evaluate hundreds of startups, filter top deals, and manage applications effortlessly.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/vc"
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
                            >
                                <Zap className="w-5 h-5" />
                                Start Automating Deal Flow
                            </Link>
                            <Link
                                href="/features/ai-vc-agents"
                                className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-200 hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300"
                            >
                                Build Custom AI Agents
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Is */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            What is VC Deal Flow Automation?
                        </h2>

                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100">
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                PitchDesk&apos;s <strong>automated pitch screening</strong> system helps VCs evaluate, filter, and manage startup applications at scale using AI. Instead of manually watching every pitch, let AI pre-screen startups and surface only the top candidates.
                            </p>

                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                Our <strong>AI startup evaluation system</strong> analyzes pitch content, team, market, traction, and business models—then scores and ranks startups automatically. You review the best performers, not every application.
                            </p>

                            <div className="grid md:grid-cols-3 gap-6 mt-8">
                                <div className="text-center p-6 bg-indigo-50 rounded-xl">
                                    <div className="text-4xl font-bold text-indigo-600 mb-2">10x</div>
                                    <p className="text-gray-700">More applications screened</p>
                                </div>
                                <div className="text-center p-6 bg-blue-50 rounded-xl">
                                    <div className="text-4xl font-bold text-blue-600 mb-2">90%</div>
                                    <p className="text-gray-700">Reduction in screening time</p>
                                </div>
                                <div className="text-center p-6 bg-indigo-50 rounded-xl">
                                    <div className="text-4xl font-bold text-indigo-600 mb-2">100%</div>
                                    <p className="text-gray-700">Consistent evaluation</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Features */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                            Key Features of Deal Flow Automation
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
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
                                <div key={idx} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                            <p className="text-gray-600 leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="container mx-auto px-4 py-16 bg-white/50">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                            How Deal Flow Automation Works
                        </h2>

                        <div className="space-y-8">
                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Create AI VC Agents</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Build custom AI judges with your investment thesis, evaluation criteria, and focus areas. Each agent represents your unique screening process.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Startups Pitch to Your AI</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Founders pitch to your AI agent through competitions, programs, or direct applications. The AI evaluates each pitch consistently.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Scores & Ranks Applications</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Every pitch is scored and ranked automatically. Top performers appear in your dashboard, ready for human review.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                                    4
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Make Decisions</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Review top-scored startups, watch pitch recordings, read transcripts, and make investment decisions. Accept, reject, or request more information.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-indigo-600 to-blue-600">
                    <div className="max-w-4xl mx-auto text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                            Why Automate Your Deal Flow?
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-2">Scale Without Adding Headcount</h3>
                                <p className="text-indigo-50">
                                    Evaluate 10x more startups without hiring more analysts. AI does the initial screening, so your team focuses only on the best deals.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-2">Never Miss a Great Deal</h3>
                                <p className="text-indigo-50">
                                    Manual screening means great startups slip through the cracks. AI evaluates every application consistently, ensuring no diamond goes unnoticed.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-2">Reduce Bias in Screening</h3>
                                <p className="text-indigo-50">
                                    Human bias affects decision-making. AI evaluates objectively based on predefined criteria, ensuring fair assessment for every startup.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-2">Faster Time-to-Decision</h3>
                                <p className="text-indigo-50">
                                    Founders hate waiting weeks for a response. With automated screening, you can respond to top deals within days, not months.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-2">Data-Driven Investment Decisions</h3>
                                <p className="text-indigo-50">
                                    Every pitch is scored with detailed metrics. Make investment decisions backed by data, not just gut feeling.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Use Cases */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                            Who Uses Deal Flow Automation?
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl p-8">
                                <Database className="w-12 h-12 mb-4 opacity-90" />
                                <h3 className="text-2xl font-bold mb-4">VC Firms</h3>
                                <p className="text-indigo-50 leading-relaxed">
                                    Screen hundreds of inbound pitches monthly. Use AI to filter signal from noise and focus your team on high-quality deals.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-8">
                                <Inbox className="w-12 h-12 mb-4 opacity-90" />
                                <h3 className="text-2xl font-bold mb-4">Accelerators & Incubators</h3>
                                <p className="text-blue-50 leading-relaxed">
                                    Manage cohort applications at scale. Automatically evaluate every applicant and invite top-scored startups to interview rounds.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-700 to-purple-700 text-white rounded-2xl p-8">
                                <Filter className="w-12 h-12 mb-4 opacity-90" />
                                <h3 className="text-2xl font-bold mb-4">Corporate VCs</h3>
                                <p className="text-purple-50 leading-relaxed">
                                    Find strategic acquisitions and partnership opportunities. Filter startups by tech stack, market, and strategic fit.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-700 to-cyan-700 text-white rounded-2xl p-8">
                                <TrendingUp className="w-12 h-12 mb-4 opacity-90" />
                                <h3 className="text-2xl font-bold mb-4">Angel Networks</h3>
                                <p className="text-cyan-50 leading-relaxed">
                                    Distribute deal flow across network members. Let AI pre-screen so angels see only relevant, high-quality opportunities.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Features */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Related Features
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            <Link href="/features/ai-vc-agents" className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Zap className="w-10 h-10 text-purple-600 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">AI VC Agents</h3>
                                <p className="text-gray-600 text-sm">Build custom AI judges for your screening process.</p>
                            </Link>

                            <Link href="/features/investment-programs" className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Database className="w-10 h-10 text-green-600 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Investment Programs</h3>
                                <p className="text-gray-600 text-sm">Launch programs that feed into your deal flow.</p>
                            </Link>

                            <Link href="/features/pitch-competitions" className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                                <TrendingUp className="w-10 h-10 text-blue-600 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Pitch Competitions</h3>
                                <p className="text-gray-600 text-sm">Host competitions to discover top startups.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-16 pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl p-12 text-white shadow-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Automate Your Deal Flow Today
                        </h2>
                        <p className="text-xl text-indigo-100 mb-8">
                            Stop manually screening every pitch. Let AI surface the best deals.
                        </p>
                        <Link
                            href="/vc"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-600 rounded-lg font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            <Zap className="w-6 h-6" />
                            Get Started with AI Screening
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
