import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, Rocket, Users, Calendar, TrendingUp, CheckCircle2, ArrowRight, Award } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'Create VC Investment Program | Digital Incubation Platform',
    description: 'Launch digital accelerators, incubators, and investment programs on PitchDesk. Manage startup applications, track cohorts, automate selection, and run online accelerator programs effortlessly.',
    canonical: '/features/investment-programs',
    keywords: [
        'create VC investment program',
        'digital incubation platform',
        'launch startup accelerator online',
        'manage incubator digitally',
        'online accelerator management software',
        'startup accelerator management platform',
    ],
});

export default function InvestmentProgramsPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'Investment Programs',
        description: 'Platform to create and manage digital accelerators, incubators, and VC investment programs',
        url: 'https://pitchdesk.in/features/investment-programs',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'Investment Programs', url: '/features/investment-programs' },
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
                            <Building2 className="w-4 h-4" />
                            For VCs & Institutions
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            <span className="text-primary">Launch Digital Investment Programs</span> & Accelerators
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            Create VC investment programs, launch online accelerators, and manage digital incubators on PitchDesk. Automate applications, track cohorts, and streamline your entire program management.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/dashboard"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Rocket className="w-5 h-5" />
                                Create Your First Program
                            </Link>
                            <Link
                                href="/features/vc-deal-flow"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300"
                            >
                                Automate Deal Flow
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Is */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                            What Are Investment Programs?
                        </h2>

                        <div className="bg-card rounded-2xl p-8 md:p-10 shadow-lg border border-border">
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                Investment Programs on PitchDesk let VCs, accelerators, and institutions <strong>create VC investment programs</strong> and run them entirely online. Think of it as a <strong>digital incubation platform</strong>—from application to cohort management, everything happens on PitchDesk.
                            </p>

                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                Whether you&apos;re running a pre-seed fund, an accelerator cohort, or a corporate innovation program, you can <strong>launch startup accelerator online</strong> and <strong>manage incubator digitally</strong> with full automation and AI support.
                            </p>

                            <div className="grid md:grid-cols-3 gap-6 mt-8">
                                <div className="text-center p-6 bg-primary/5 rounded-xl">
                                    <div className="text-4xl font-bold text-primary mb-2">100%</div>
                                    <p className="text-muted-foreground">Digital program management</p>
                                </div>
                                <div className="text-center p-6 bg-primary/5 rounded-xl">
                                    <div className="text-4xl font-bold text-primary mb-2">AI-Powered</div>
                                    <p className="text-muted-foreground">Automated application screening</p>
                                </div>
                                <div className="text-center p-6 bg-primary/5 rounded-xl">
                                    <div className="text-4xl font-bold text-primary mb-2">Scalable</div>
                                    <p className="text-muted-foreground">Manage any cohort size</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Features */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
                            What You Can Do with Investment Programs
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: 'Create Custom Programs',
                                    description: 'Build accelerators, incubators, fellowship programs, or investment vehicles with custom names, descriptions, criteria, and branding.',
                                },
                                {
                                    title: 'Define Program Stages',
                                    description: 'Set up multi-stage programs (Application → Interview → Selection → Cohort). Move startups through stages as they progress.',
                                },
                                {
                                    title: 'Automate Applications',
                                    description: 'Startups apply through PitchDesk. All applications are automatically collected, organized, and ready for review in your dashboard.',
                                },
                                {
                                    title: 'AI-Powered Screening',
                                    description: 'Use custom AI agents to automatically screen and score applications. Focus only on top-ranked candidates.',
                                },
                                {
                                    title: 'Manage Cohorts',
                                    description: 'Track your cohort members, monitor their progress, communicate with startups, and manage program deliverables all in one place.',
                                },
                                {
                                    title: 'Set Investment Terms',
                                    description: 'Define your program terms: funding amount, equity stake, program duration, deliverables, and expectations.',
                                },
                                {
                                    title: 'Public Program Pages',
                                    description: 'Each program gets a public landing page where founders can learn about your program and apply directly.',
                                },
                                {
                                    title: 'Application Analytics',
                                    description: 'See application stats, conversion rates, applicant demographics, and insights on your program\'s reach and performance.',
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

                {/* How It Works */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-card/50">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
                            How to Launch an Investment Program
                        </h2>

                        <div className="space-y-8">
                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-xl">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Create Your Program</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Name your program, describe it, set investment terms (amount, equity, duration), and define your focus areas (e.g., fintech, SaaS, climate tech).
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-xl">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Configure AI Screening</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Choose or create an AI VC agent to evaluate applications. Set scoring criteria based on what matters to your program.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-xl">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Publish & Promote</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Your program goes live on PitchDesk with a public landing page. Founders can discover it, learn about your terms, and apply directly.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-xl">
                                    4
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Review Applications</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        AI pre-screens and ranks applications. You review top candidates, watch pitch recordings, and decide who moves forward.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-xl">
                                    5
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Manage Your Cohort</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Accept chosen startups into your program. Track their progress, communicate updates, and manage your cohort through PitchDesk.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Program Types */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
                            Types of Programs You Can Launch
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-primary text-primary-foreground rounded-2xl p-8">
                                <Rocket className="w-12 h-12 mb-4 opacity-90" />
                                <h3 className="text-2xl font-bold mb-4">Accelerator Programs</h3>
                                <p className="text-primary-foreground/90 leading-relaxed mb-4">
                                    Run 12-week accelerators with cohort-based learning, mentorship, and demo days. Manage applications, select cohorts, and track progress.
                                </p>
                                <ul className="space-y-2 text-primary-foreground/80 text-sm">
                                    <li>• Y Combinator-style programs</li>
                                    <li>• Vertical-specific accelerators</li>
                                    <li>• Corporate accelerators</li>
                                </ul>
                            </div>

                            <div className="bg-primary text-primary-foreground rounded-2xl p-8">
                                <Building2 className="w-12 h-12 mb-4 opacity-90" />
                                <h3 className="text-2xl font-bold mb-4">Incubator Programs</h3>
                                <p className="text-cyan-50 leading-relaxed mb-4">
                                    Launch long-term incubation programs with rolling admissions. Support early-stage founders with resources, workspace, and guidance.
                                </p>
                                <ul className="space-y-2 text-cyan-100 text-sm">
                                    <li>• University incubators</li>
                                    <li>• Regional innovation hubs</li>
                                    <li>• Government-backed programs</li>
                                </ul>
                            </div>

                            <div className="bg-primary text-primary-foreground rounded-2xl p-8">
                                <Award className="w-12 h-12 mb-4 opacity-90" />
                                <h3 className="text-2xl font-bold mb-4">Investment Vehicles</h3>
                                <p className="text-primary-foreground/90 leading-relaxed mb-4">
                                    Run rolling funds, syndicate deals, or SAFE programs. Accept applications, screen startups, and manage your investment pipeline.
                                </p>
                                <ul className="space-y-2 text-primary-foreground/80 text-sm">
                                    <li>• Pre-seed / seed funds</li>
                                    <li>• Angel syndicates</li>
                                    <li>• Rolling funds</li>
                                </ul>
                            </div>

                            <div className="bg-primary text-primary-foreground rounded-2xl p-8">
                                <Users className="w-12 h-12 mb-4 opacity-90" />
                                <h3 className="text-2xl font-bold mb-4">Fellowship Programs</h3>
                                <p className="text-primary-foreground/90 leading-relaxed mb-4">
                                    Create founder fellowships with stipends, mentorship, and community. Support pre-idea or pre-product founders.
                                </p>
                                <ul className="space-y-2 text-primary-foreground/80 text-sm">
                                    <li>• Founder residencies</li>
                                    <li>• EIR programs</li>
                                    <li>• Research fellowships</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-primary">
                    <div className="max-w-4xl mx-auto text-primary-foreground">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                            Why Launch Programs on PitchDesk?
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
                                <h3 className="text-xl font-bold mb-2">No Technical Setup Required</h3>
                                <p className="text-primary-foreground/90">
                                    Skip building application portals, databases, and infrastructure. PitchDesk provides everything out of the box.
                                </p>
                            </div>

                            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
                                <h3 className="text-xl font-bold mb-2">Reach a Global Founder Audience</h3>
                                <p className="text-primary-foreground/90">
                                    Your program is discoverable by thousands of founders already using PitchDesk. Get quality applications from day one.
                                </p>
                            </div>

                            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
                                <h3 className="text-xl font-bold mb-2">Automate Repetitive Tasks</h3>
                                <p className="text-primary-foreground/90">
                                    Let AI handle application screening, ranking, and filtering. Your team focuses on high-value interactions with top candidates.
                                </p>
                            </div>

                            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
                                <h3 className="text-xl font-bold mb-2">Better Founder Experience</h3>
                                <p className="text-primary-foreground/90">
                                    Founders apply, pitch, and track their status all in one platform. No email chains, no scattered forms—just a smooth experience.
                                </p>
                            </div>

                            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
                                <h3 className="text-xl font-bold mb-2">Full Program Analytics</h3>
                                <p className="text-primary-foreground/90">
                                    Track application volume, acceptance rates, cohort performance, and program ROI with built-in analytics dashboards.
                                </p>
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
                            <Link href="/features/vc-deal-flow" className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <TrendingUp className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">VC Deal Flow</h3>
                                <p className="text-muted-foreground text-sm">Manage applications and deal pipeline.</p>
                            </Link>

                            <Link href="/features/ai-vc-agents" className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Rocket className="w-10 h-10 text-purple-600 mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">AI VC Agents</h3>
                                <p className="text-muted-foreground text-sm">Create custom AI judges for your program.</p>
                            </Link>

                            <Link href="/features/pitch-competitions" className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Award className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">Pitch Competitions</h3>
                                <p className="text-muted-foreground text-sm">Host competitions alongside your program.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-8 sm:p-12 text-primary-foreground shadow-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Launch Your Program Today
                        </h2>
                        <p className="text-xl text-primary-foreground/80 mb-8">
                            Create your first digital accelerator or investment program in minutes.
                        </p>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-background text-foreground rounded-lg font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            <Rocket className="w-6 h-6" />
                            Create Investment Program
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
