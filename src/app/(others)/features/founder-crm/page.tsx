import type { Metadata } from 'next';
import Link from 'next/link';
import { Database, Users, Calendar, FileText, Mail, Target, ArrowRight, Sparkles, TrendingUp, CheckCircle2, BarChart3, Clock, Bell, FolderKanban } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'Founder CRM | Investor Relationship Management for Startups',
    description: 'Manage investor relationships with Founder CRM. Track fundraising pipelines, store meeting notes, schedule follow-ups, and organize your investor conversations. The best investor CRM for startups.',
    canonical: '/features/founder-crm',
    keywords: [
        'investor CRM for startups',
        'fundraising CRM tool',
        'investor relationship management',
        'startup CRM for founders',
        'VC tracking software',
        'investor pipeline management',
        'fundraising pipeline tracker',
        'manage investor conversations',
        'startup fundraising tool',
        'investor outreach CRM',
    ],
});

export default function FounderCRMPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'Founder CRM',
        description: 'Manage investor relationships, track fundraising pipelines, and organize your fundraising process like a sales pipeline',
        url: 'https://pitchdesk.in/features/founder-crm',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'Founder CRM', url: '/features/founder-crm' },
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
                            <Database className="w-4 h-4" />
                            Investor Relationship Management
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            <span className="text-primary">Founder CRM</span> — Manage Investors Like a Sales Pipeline
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            Fundraising is sales. Our <strong className="text-foreground">investor CRM for startups</strong> helps you <strong className="text-foreground">track investor conversations</strong>, manage your fundraising pipeline, store meeting notes, and never miss a follow-up. Turn your chaotic investor outreach into an organized <strong className="text-foreground">fundraising pipeline tracker</strong>.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <span className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary/80 text-primary-foreground rounded-lg font-semibold cursor-not-allowed opacity-90">
                                <Database className="w-5 h-5" />
                                Start Using CRM (Coming Soon)
                            </span>
                            <Link
                                href="/features/startup-metrics-dashboard"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300 inline-flex items-center justify-center gap-2"
                            >
                                <BarChart3 className="w-5 h-5" />
                                Track Startup Metrics
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Is */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                            What is Founder CRM?
                        </h2>

                        <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                <strong className="text-foreground">Founder CRM</strong> is a <strong className="text-foreground">fundraising CRM tool</strong> built specifically for startup founders. Unlike generic CRMs designed for enterprise sales, this is purpose-built for the unique workflow of startup fundraising—tracking investors through stages, managing warm intros, storing pitch feedback, and scheduling follow-ups.
                            </p>

                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                Think of it as <strong className="text-foreground">investor pipeline management</strong> for founders. Every investor conversation, email thread, meeting note, and commitment lives in one place. No more scattered spreadsheets, lost emails, or forgotten follow-ups. The <strong className="text-foreground">best startup CRM for founders</strong> who want to run their fundraise like professionals.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Pipeline</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Visual deal stages</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Notes</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Meeting & feedback logs</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Follow-ups</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Never miss a touchpoint</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Features */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-secondary/20">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Founder CRM Features
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { icon: FolderKanban, title: 'Kanban Pipeline View', desc: 'Visual pipeline stages: Researching, Warm Intro, First Meeting, Partner Meeting, Term Sheet, Closed. Drag and drop investors through stages.' },
                                { icon: Users, title: 'Investor Profiles', desc: 'Store investor details, thesis, check size, portfolio companies, and relationship history all in one place.' },
                                { icon: FileText, title: 'Meeting Notes', desc: 'Log every meeting, call, and email. Capture feedback, questions asked, and action items for each interaction.' },
                                { icon: Calendar, title: 'Follow-up Scheduling', desc: 'Set reminders for follow-ups. Never let a warm lead go cold because you forgot to reach out.' },
                                { icon: Mail, title: 'Email Integration', desc: 'Connect your inbox to automatically track investor correspondence and maintain communication history.' },
                                { icon: Bell, title: 'Smart Reminders', desc: 'Get notified when it\'s time to follow up, when deals go stale, or when you need to provide updates.' },
                            ].map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                                        <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
                                        <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground">{feature.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Pipeline Stages */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Fundraising Pipeline Stages
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { stage: '1. Researching', desc: 'Identifying potential investors who match your stage, sector, and geography.' },
                                { stage: '2. Warm Intro', desc: 'Seeking warm introductions through your network or direct outreach.' },
                                { stage: '3. First Meeting', desc: 'Initial pitch meeting scheduled or completed. Awaiting feedback.' },
                                { stage: '4. Partner Meeting', desc: 'Advancing to partner meeting or deeper due diligence phase.' },
                                { stage: '5. Term Sheet', desc: 'Negotiating terms and finalizing investment documentation.' },
                                { stage: '6. Closed', desc: 'Deal completed, money wired. Investor is now on your cap table.' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-card rounded-lg p-4 sm:p-5 border border-border hover:border-primary/50 transition-colors">
                                    <h3 className="text-base sm:text-lg font-bold text-primary mb-2">{item.stage}</h3>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-primary/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            How Does Founder CRM Work?
                        </h2>

                        <div className="space-y-6 sm:space-y-8">
                            {[
                                { num: '1', title: 'Add Investors to Your Pipeline', desc: 'Import investor contacts or add them manually. Set their current stage and any relevant notes.' },
                                { num: '2', title: 'Log Every Interaction', desc: 'After each meeting, call, or email—log it. Capture key feedback, questions, and next steps.' },
                                { num: '3', title: 'Move Through Stages', desc: 'As relationships progress, drag investors through pipeline stages. See your funnel at a glance.' },
                                { num: '4', title: 'Set Follow-up Reminders', desc: 'Never let a conversation die. Schedule follow-ups and get reminded when it\'s time to reach out.' },
                                { num: '5', title: 'Track Your Fundraise', desc: 'See metrics: meetings this week, pipeline value, conversion rates, and time in each stage.' },
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

                {/* Who It's For */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Who Should Use Founder CRM?
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { title: 'Pre-Seed & Seed Founders', desc: 'Running your first fundraise? Organize investor conversations from day one instead of scrambling later.' },
                                { title: 'Series A+ Founders', desc: 'Larger rounds mean more investors to track. Keep your fundraising organized at scale.' },
                                { title: 'Repeat Fundraisers', desc: 'Building relationships for future rounds? Maintain investor relationships over time with historical context.' },
                                { title: 'Founders with Co-Founders', desc: 'Multiple people talking to investors? Centralize notes so everyone knows every conversation.' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-lg border border-border">
                                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{item.title}</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-secondary/20">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Why Use a Founder CRM?
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { icon: Target, title: 'Stay Organized', desc: 'No more scattered spreadsheets or lost emails. Everything in one place.' },
                                { icon: Clock, title: 'Save Time', desc: 'Spend less time tracking and more time building relationships that close deals.' },
                                { icon: TrendingUp, title: 'Close Faster', desc: 'Professional follow-up cadence increases conversion rates and shortens fundraising cycles.' },
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

                {/* What You Can Track */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                            What You Can Track in Founder CRM
                        </h2>

                        <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-lg border border-border">
                            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                                {[
                                    'Investor contact details & thesis',
                                    'Warm intro sources & connectors',
                                    'Meeting dates & attendees',
                                    'Pitch feedback & objections',
                                    'Follow-up tasks & deadlines',
                                    'Email correspondence history',
                                    'Investment commitment amounts',
                                    'Due diligence document requests',
                                    'Term sheet negotiations',
                                    'Closing timeline & milestones',
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <span className="text-sm sm:text-base text-muted-foreground">{item}</span>
                                    </div>
                                ))}
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
                            <Link href="/features/startup-metrics-dashboard" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Metrics Dashboard</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Track your startup metrics alongside your fundraise.</p>
                            </Link>

                            <Link href="/features/ai-pitch-simulator" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">AI Pitch Simulator</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Practice your pitch before investor meetings.</p>
                            </Link>

                            <Link href="/features/pitch-script-generator" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Script Generator</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Generate compelling pitch scripts for each meeting.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-8 sm:p-12 text-primary-foreground shadow-2xl">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
                            Organize Your Fundraise
                        </h2>
                        <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8">
                            Stop losing deals to disorganization. Manage your investor pipeline like a pro.
                        </p>
                        <span className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-primary-foreground/20 text-primary-foreground rounded-lg font-bold text-base sm:text-lg border border-primary-foreground/30 cursor-not-allowed">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                            Start Using CRM (Coming Soon)
                        </span>
                    </div>
                </section>
            </div>
        </>
    );
}
