import type { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3, TrendingUp, DollarSign, Users, Clock, FileText, ArrowRight, Sparkles, Target, CheckCircle2, LineChart, PieChart, Calendar, Download } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'Startup Metrics Dashboard | Track KPIs, Burn Rate & Runway',
    description: 'Track your startup metrics with our founder dashboard. Monitor revenue, growth rate, burn rate, runway, and customer acquisition. Generate investor-ready reports and progress updates automatically.',
    canonical: '/features/startup-metrics-dashboard',
    keywords: [
        'startup metrics dashboard',
        'startup KPI tracker',
        'founder dashboard analytics',
        'track startup growth metrics',
        'burn rate calculator startup',
        'runway calculator for startups',
        'investor update generator',
        'startup traction dashboard',
        'startup analytics tool',
        'founder metrics tracking',
    ],
});

export default function StartupMetricsDashboardPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'Startup Metrics Dashboard',
        description: 'Track startup metrics like revenue, growth rate, burn rate, runway, and generate investor-ready reports',
        url: 'https://pitchdesk.in/features/startup-metrics-dashboard',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'Startup Metrics Dashboard', url: '/features/startup-metrics-dashboard' },
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
                            <BarChart3 className="w-4 h-4" />
                            Founder Analytics
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            <span className="text-primary">Startup Metrics Dashboard</span> — Track What Matters
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            Know your numbers. Our <strong className="text-foreground">startup metrics dashboard</strong> helps you track revenue, growth rate, <strong className="text-foreground">burn rate</strong>, <strong className="text-foreground">runway</strong>, and customer acquisition in one place. Generate <strong className="text-foreground">investor-ready reports</strong> and progress updates automatically.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <span className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary/80 text-primary-foreground rounded-lg font-semibold cursor-not-allowed opacity-90">
                                <BarChart3 className="w-5 h-5" />
                                Start Tracking (Coming Soon)
                            </span>
                            <Link
                                href="/features/founder-crm"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300 inline-flex items-center justify-center gap-2"
                            >
                                <Users className="w-5 h-5" />
                                Manage Investor Pipeline
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Is */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                            What is the Startup Metrics Dashboard?
                        </h2>

                        <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                The <strong className="text-foreground">startup metrics dashboard</strong> is your command center for tracking key performance indicators. It&apos;s a <strong className="text-foreground">startup KPI tracker</strong> designed specifically for founders—not enterprise executives. Track the metrics that matter for early-stage startups: MRR, growth rate, churn, CAC, LTV, burn rate, and runway.
                            </p>

                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                Beyond tracking, it&apos;s an <strong className="text-foreground">investor update generator</strong>. Automatically create monthly investor updates with key metrics, milestones achieved, and asks—all pulled from your dashboard data. It&apos;s the <strong className="text-foreground">founder dashboard analytics</strong> tool that keeps you and your investors informed.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Metrics</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Revenue, growth, churn</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Runway</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Burn rate & cash position</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Reports</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Investor-ready updates</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Metrics */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-secondary/20">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Key Startup Metrics You Can Track
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { icon: DollarSign, title: 'Monthly Recurring Revenue (MRR)', desc: 'Track your predictable monthly revenue from subscriptions and recurring customers.' },
                                { icon: TrendingUp, title: 'Growth Rate', desc: 'Monitor month-over-month and year-over-year growth across revenue, users, and engagement.' },
                                { icon: LineChart, title: 'Burn Rate', desc: 'Know exactly how much cash you\'re spending each month. The burn rate calculator shows your runway.' },
                                { icon: Clock, title: 'Runway', desc: 'See how many months of cash you have left at current burn rate. Plan your next fundraise accordingly.' },
                                { icon: Users, title: 'Customer Acquisition Cost (CAC)', desc: 'Calculate how much it costs to acquire each customer across different channels.' },
                                { icon: PieChart, title: 'Lifetime Value (LTV)', desc: 'Understand the total value of a customer over their entire relationship with your startup.' },
                            ].map((metric, idx) => {
                                const Icon = metric.icon;
                                return (
                                    <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                                        <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
                                        <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{metric.title}</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground">{metric.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Additional Metrics */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                            More Metrics for Growing Startups
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                'Active Users (DAU/MAU)',
                                'Churn Rate',
                                'Net Revenue Retention',
                                'Activation Rate',
                                'Conversion Rate',
                                'Average Revenue Per User',
                                'Payback Period',
                                'Gross Margin',
                                'Customer Count',
                                'Trial to Paid Conversion',
                                'Support Ticket Volume',
                                'NPS Score',
                            ].map((metric, idx) => (
                                <div key={idx} className="bg-card rounded-lg p-3 sm:p-4 text-center border border-border hover:border-primary/50 transition-colors">
                                    <span className="text-sm sm:text-base font-medium text-foreground">{metric}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Dashboard Features */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-primary/5">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Dashboard Features
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { icon: LineChart, title: 'Visual Charts & Graphs', desc: 'See trends over time with beautiful, interactive charts. Spot patterns and anomalies instantly.' },
                                { icon: Target, title: 'Goal Tracking', desc: 'Set targets for key metrics and track progress. Know if you\'re on track to hit milestones.' },
                                { icon: Calendar, title: 'Historical Comparison', desc: 'Compare current performance to previous periods. See how far you\'ve come and where you\'re heading.' },
                                { icon: Download, title: 'Export & Share', desc: 'Export data to CSV or generate PDF reports. Share with co-founders, advisors, and investors.' },
                            ].map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border">
                                        <div className="flex items-start gap-4">
                                            <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary flex-shrink-0" />
                                            <div>
                                                <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                                                <p className="text-sm sm:text-base text-muted-foreground">{feature.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Investor Reports */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                            Generate Investor-Ready Reports
                        </h2>

                        <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
                                Stop spending hours creating investor updates. Our <strong className="text-foreground">investor update generator</strong> automatically creates professional reports with your key metrics, milestones, challenges, and asks—pulled directly from your dashboard data.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">Monthly Investor Updates Include:</h3>
                                    <ul className="space-y-3">
                                        {[
                                            'Key metrics snapshot (MRR, growth, runway)',
                                            'Highlights & wins this month',
                                            'Challenges & learnings',
                                            'Goals for next month',
                                            'Specific asks from investors',
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                <span className="text-sm sm:text-base">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">Why Regular Updates Matter:</h3>
                                    <ul className="space-y-3">
                                        {[
                                            'Keep investors engaged and supportive',
                                            'Build trust through transparency',
                                            'Get help faster when you need it',
                                            'Strengthen relationships for future rounds',
                                            'Document your journey for reference',
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                <span className="text-sm sm:text-base">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who It's For */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-secondary/20">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Who Should Use the Metrics Dashboard?
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { title: 'SaaS Founders', desc: 'Track MRR, churn, LTV, and all the metrics SaaS investors care about most.' },
                                { title: 'Funded Startups', desc: 'Keep investors informed with regular updates. Know your runway and plan accordingly.' },
                                { title: 'Pre-Revenue Startups', desc: 'Track user growth, engagement, and burn rate while you find product-market fit.' },
                                { title: 'Data-Driven Founders', desc: 'Make decisions based on data, not gut feelings. Track experiments and outcomes.' },
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
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Why Track Your Startup Metrics?
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { icon: Target, title: 'Make Better Decisions', desc: 'Data-driven decisions beat gut feelings. Know what\'s working and what\'s not.' },
                                { icon: TrendingUp, title: 'Impress Investors', desc: 'Founders who know their numbers get funded. Show investors you run a tight ship.' },
                                { icon: Clock, title: 'Never Run Out of Cash', desc: 'Runway tracking ensures you never get surprised. Start fundraising with enough time.' },
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

                {/* Related Features */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8 text-center">
                            Related Features
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <Link href="/features/founder-crm" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Founder CRM</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Manage investor relationships alongside your metrics.</p>
                            </Link>

                            <Link href="/features/ai-pitch-simulator" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">AI Pitch Simulator</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Practice pitching your metrics to AI VCs.</p>
                            </Link>

                            <Link href="/features/pitch-analysis" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Analysis</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Get feedback on how you present your metrics.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-8 sm:p-12 text-primary-foreground shadow-2xl">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
                            Know Your Numbers
                        </h2>
                        <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8">
                            Track the metrics that matter. Make data-driven decisions. Impress your investors.
                        </p>
                        <span className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-primary-foreground/20 text-primary-foreground rounded-lg font-bold text-base sm:text-lg border border-primary-foreground/30 cursor-not-allowed">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                            Start Tracking (Coming Soon)
                        </span>
                    </div>
                </section>
            </div>
        </>
    );
}
