import type { Metadata } from 'next';
import Link from 'next/link';
import { Bot, Settings, Zap, Brain, Target, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'Build AI VC Judge | Custom AI Investor Simulator - PitchDesk',
    description: 'Create personalized AI VC agents with custom evaluation criteria, investment theses, and sector focus. Build AI VC judges for automated startup screening and pitch evaluation. The ultimate customizable VC avatar.',
    canonical: '/features/ai-vc-agents',
    keywords: [
        'build AI VC judge',
        'customizable AI investor simulator',
        'personalized AI VC agent',
        'custom AI investor avatar',
        'AI VC simulator platform',
    ],
});

export default function AIVCAgentsPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'AI VC Agents',
        description: 'Build custom AI VC judges with personalized evaluation criteria and investment theses',
        url: 'https://pitchdesk.in/features/ai-vc-agents',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'AI VC Agents', url: '/features/ai-vc-agents' },
    ]);

    return (
        <>
            <script type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(featureSchema) }} />
            <script type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50">
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-16 md:py-20">
                    <div className="max-w-4xl mx-auto">
                        <Link
                            href="/features"
                            className="inline-flex items-center text-violet-600 hover:text-violet-700 mb-6 font-medium"
                        >
                            ← Back to Features
                        </Link>

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-6">
                            <Bot className="w-4 h-4" />
                            For VCs & Institutions
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">Build AI VC Judges</span> Tailored to Your Thesis
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                            Create <strong>custom AI VC agents</strong> with your investment criteria, evaluation priorities, and sector expertise. Build <strong>customizable VC avatars</strong> that screen pitches exactly how you would—at scale.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/vc"
                                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
                            >
                                <Bot className="w-5 h-5" />
                                Create Your AI VC Agent
                            </Link>
                            <Link
                                href="/features/vc-deal-flow"
                                className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-200 hover:border-violet-600 hover:text-violet-600 transition-all duration-300"
                            >
                                Automate Deal Flow
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Is */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            What Are AI VC Agents?
                        </h2>

                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100">
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                AI VC Agents are <strong>personalized AI judges</strong> that represent your unique investment philosophy. They&apos;re not generic evaluators—they&apos;re trained on your criteria, focus areas, and evaluation priorities to screen startups exactly how you would.
                            </p>

                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                Think of them as <strong>AI VC simulators</strong> that embody your fund&apos;s personality. A fintech-focused VC builds an agent that prioritizes regulatory compliance and unit economics. A climate tech investor builds one focused on impact metrics and sustainability.
                            </p>

                            <div className="grid md:grid-cols-3 gap-6 mt-8">
                                <div className="text-center p-6 bg-violet-50 rounded-xl">
                                    <div className="text-4xl font-bold text-violet-600 mb-2">100%</div>
                                    <p className="text-gray-700">Customizable to your thesis</p>
                                </div>
                                <div className="text-center p-6 bg-purple-50 rounded-xl">
                                    <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                                    <p className="text-gray-700">Autonomous screening</p>
                                </div>
                                <div className="text-center p-6 bg-violet-50 rounded-xl">
                                    <div className="text-4xl font-bold text-violet-600 mb-2">Consistent</div>
                                    <p className="text-gray-700">No bias or fatigue</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What You Can Customize */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                            What You Can Customize in Your AI Agent
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: 'Investment Thesis',
                                    description: 'Define what you look for: market size, traction, team, tech innovation, business model, defensibility, or growth potential. Prioritize what matters most to your fund.',
                                },
                                {
                                    title: 'Sector Focus',
                                    description: 'Set industry expertise: SaaS, fintech, climate tech, healthcare, deeptech, consumer, B2B, etc. Your AI will ask sector-specific questions.',
                                },
                                {
                                    title: 'Stage Preferences',
                                    description: 'Pre-seed, seed, Series A, or growth stage? Your AI will evaluate startups based on expectations appropriate for their stage.',
                                },
                                {
                                    title: 'Evaluation Criteria (Personality)',
                                    description: 'Customize scoring rubrics: market (30%), team (25%), traction (20%), tech (15%), pitch quality (10%). Weight what matters to you.',
                                },
                                {
                                    title: 'Question Style',
                                    description: 'Friendly and supportive, or tough and interrogative? Set the AI\'s questioning tone to match your approach.',
                                },
                                {
                                    title: 'Geographic Focus',
                                    description: 'Target specific regions or go global. Your AI can prioritize startups from your target markets.',
                                },
                                {
                                    title: 'Deal Flow Filters',
                                    description: 'Set automatic filters: minimum revenue, team size, funding raised, or customer count. Screen out non-fits automatically.',
                                },
                                {
                                    title: 'Special Priorities',
                                    description: 'Add unique priorities: diversity, impact metrics, profitability, or any custom factors that align with your fund\'s mission.',
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start gap-3">
                                        <Settings className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
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
                            How to Build Your AI VC Agent
                        </h2>

                        <div className="space-y-8">
                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Define Your Investment Criteria</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Start by defining what you look for in startups. Set your thesis, focus areas, stage preferences, and deal flow priorities.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Customize Evaluation Rubric</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Set scoring weights for each evaluation dimension: market opportunity, team, traction, product, business model, pitch quality, etc.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Set Agent Personality</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Choose the AI&apos;s tone and questioning style. Go supportive and encouraging, or tough and critical—whatever matches your style.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                                    4
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Deploy & Use</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Your AI agent is ready. Use it in pitch competitions, investment programs, or for general deal flow screening. Startups pitch to your agent, and it evaluates them based on your criteria.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                                    5
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Refine Over Time</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Continuously improve your AI agent based on results. Adjust weights, add new criteria, or change focus as your investment strategy evolves.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Use Cases */}
                <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-violet-600 to-purple-600">
                    <div className="max-w-4xl mx-auto text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                            How VCs Use AI Agents
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-2">Screening Cold Inbound Pitches</h3>
                                <p className="text-violet-50">
                                    Instead of manually reviewing every cold email pitch, let your AI agent do the initial screening. It scores every pitch and surfaces only the top 10%.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-2">Running Accelerator Applications</h3>
                                <p className="text-violet-50">
                                    Deploy your AI agent to evaluate accelerator or incubator applications. Let it score hundreds of applicants and rank them automatically.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-2">Hosting Pitch Competitions</h3>
                                <p className="text-violet-50">
                                    Your AI agent acts as the judge for virtual pitch competitions. Founders compete for top scores, and you see the winners on a leaderboard.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-2">Sector-Specific Screening</h3>
                                <p className="text-violet-50">
                                    Build multiple agents for different sectors. A healthcare-focused agent for medtech startups, a fintech agent for payment companies, etc.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-2">Partner-Specific Evaluation</h3>
                                <p className="text-violet-50">
                                    Different partners in your fund have different priorities. Each partner can build their own AI agent that reflects their unique perspective.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                            Why Build Custom AI VC Agents?
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                <Brain className="w-12 h-12 text-violet-600 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Your Thesis, Your Agent</h3>
                                <p className="text-gray-600">
                                    Generic AI screening doesn&apos;t work. Your agent evaluates startups based on what matters to YOUR fund, not generic criteria.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                <Zap className="w-12 h-12 text-purple-600 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Consistent Evaluation</h3>
                                <p className="text-gray-600">
                                    Human evaluators get tired, biased, or inconsistent. AI agents apply the same criteria to every pitch, every time.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                <Target className="w-12 h-12 text-blue-600 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Scale Your Screening</h3>
                                <p className="text-gray-600">
                                    Review 100x more startups without increasing team size. Your AI agent never sleeps, never gets overwhelmed.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Examples */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                            Example AI Agent Personalities
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-6 border border-violet-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">The Fintech Focused Agent</h3>
                                <p className="text-gray-700 mb-4">
                                    Prioritizes regulatory compliance, unit economics, customer acquisition costs, and banking partnerships. Asks tough questions about fraud prevention and security.
                                </p>
                                <p className="text-sm text-gray-600 italic">Used by: Fintech-focused seed funds</p>
                            </div>

                            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-purple-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">The Impact-First Agent</h3>
                                <p className="text-gray-700 mb-4">
                                    Evaluates environmental impact, social ROI, and sustainability metrics alongside financials. Focuses on mission-driven founders and measurable impact.
                                </p>
                                <p className="text-sm text-gray-600 italic">Used by: Climate tech and impact investors</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-pink-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">The Enterprise SaaS Agent</h3>
                                <p className="text-gray-700 mb-4">
                                    Looks for enterprise sales experience, long sales cycles, ARR growth, logo acquisition, and product-market fit in B2B markets.
                                </p>
                                <p className="text-sm text-gray-600 italic">Used by: B2B SaaS-focused VCs</p>
                            </div>

                            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-rose-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">The DeepTech Agent</h3>
                                <p className="text-gray-700 mb-4">
                                    Evaluates technical innovation, IP strength, research publications, PhD-level expertise, and time-to-market for hard tech startups.
                                </p>
                                <p className="text-sm text-gray-600 italic">Used by: DeepTech and hard-science investors</p>
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
                            <Link href="/features/vc-deal-flow" className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Target className="w-10 h-10 text-indigo-600 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">VC Deal Flow</h3>
                                <p className="text-gray-600 text-sm">Use your AI agents to automate deal flow screening.</p>
                            </Link>

                            <Link href="/features/investment-programs" className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Sparkles className="w-10 h-10 text-teal-600 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Investment Programs</h3>
                                <p className="text-gray-600 text-sm">Deploy agents in your accelerator programs.</p>
                            </Link>

                            <Link href="/features/pitch-competitions" className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                                <CheckCircle2 className="w-10 h-10 text-green-600 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Pitch Competitions</h3>
                                <p className="text-gray-600 text-sm">Use agents as judges for competitions.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-16 pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Build Your AI VC Agent
                        </h2>
                        <p className="text-xl text-violet-100 mb-8">
                            Create a custom AI judge that screens startups your way.
                        </p>
                        <Link
                            href="/vc"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-violet-600 rounded-lg font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            <Bot className="w-6 h-6" />
                            Create Your First AI Agent
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
