import type { Metadata } from 'next';
import Link from 'next/link';
import { Target, Users, Rocket, TrendingUp, Building2, Sparkles, ArrowRight } from 'lucide-react';
import { generateSEOMetadata, generateOrganizationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'About PitchDesk | AI-Powered Pitch Practice & VC Simulation Platform',
    description: 'Discover how PitchDesk helps startup founders practice pitches with AI judges, simulate VC meetings, and connect with real investors. Your virtual pitch practice platform for fundraising success.',
    canonical: '/about',
    keywords: [
        'AI pitch simulator',
        'virtual pitch practice platform',
        'AI investor feedback tool',
        'startup pitch training',
        'VC simulation software',
    ],
});

export default function AboutPage() {
    const organizationSchema = generateOrganizationSchema();
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
    ]);

    return (
        <>
            <script type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
            <script type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            The Future of Startup Pitching
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            What is <span className="text-primary">PitchDesk</span>?
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            PitchDesk is an <strong className="text-foreground">AI-powered virtual pitch practice platform</strong> that helps startup founders master their investor pitches through realistic AI simulations, instant feedback, and connections to real VCs.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/start-a-pitch"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Start Practicing Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/features"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300"
                            >
                                Explore Features
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Why PitchDesk Exists */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-8 sm:mb-12">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Why PitchDesk Exists
                            </h2>
                            <p className="text-lg sm:text-xl text-muted-foreground">
                                We're solving the hardest problem founders face: <strong className="text-foreground">getting pitch-ready without wasting investor time</strong>
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                            {/* Problem Card */}
                            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-destructive/10 rounded-xl flex items-center justify-center mb-6">
                                    <Target className="w-6 h-6 sm:w-7 sm:h-7 text-destructive" />
                                </div>

                                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">The Problem</h3>

                                <div className="space-y-4 text-muted-foreground">
                                    <div className="flex gap-3">
                                        <span className="text-destructive font-bold">→</span>
                                        <p><strong className="text-foreground">Founders lack realistic practice.</strong> Most pitch for the first time in front of real VCs—and lose their shot.</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <span className="text-destructive font-bold">→</span>
                                        <p><strong className="text-foreground">VCs waste time on unprepared pitches.</strong> 90% of pitches don't meet basic standards.</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <span className="text-destructive font-bold">→</span>
                                        <p><strong className="text-foreground">No access to instant, quality feedback.</strong> Traditional pitch coaches are expensive and hard to find.</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <span className="text-destructive font-bold">→</span>
                                        <p><strong className="text-foreground">Getting noticed is nearly impossible.</strong> Breaking into top accelerators or VC networks feels like a closed system.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Solution Card */}
                            <div className="bg-primary/5 rounded-2xl p-6 sm:p-8 shadow-lg border border-primary/20 hover:shadow-xl transition-shadow">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
                                </div>

                                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">The Solution</h3>

                                <div className="space-y-4 text-muted-foreground">
                                    <div className="flex gap-3">
                                        <span className="text-primary font-bold">✓</span>
                                        <p><strong className="text-foreground">AI investor feedback tool</strong> that simulates real VC conversations with voice-based interaction.</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <span className="text-primary font-bold">✓</span>
                                        <p><strong className="text-foreground">Instant, actionable feedback</strong> on pitch clarity, storytelling, financials, and confidence.</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <span className="text-primary font-bold">✓</span>
                                        <p><strong className="text-foreground">Real investment opportunities.</strong> Get discovered by VCs hosting programs and competitions on PitchDesk.</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <span className="text-primary font-bold">✓</span>
                                        <p><strong className="text-foreground">Script generation + deal flow automation</strong> for founders and VCs alike.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Motivation & Vision */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-card rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl border border-border">
                            <div className="flex items-center gap-3 mb-6">
                                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                                    Our Motivation & Vision
                                </h2>
                            </div>

                            <div className="space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
                                <p>
                                    Every great startup begins with a pitch. But the reality? <strong className="text-foreground">Most founders never get the chance to improve</strong> before their big moment.
                                </p>

                                <p>
                                    PitchDesk was born from a simple belief: <strong className="text-primary">preparation should be accessible to everyone</strong>, not just those with networks or money for expensive coaches.
                                </p>

                                <p>
                                    We built a <strong className="text-foreground">startup pitch evaluation software</strong> that levels the playing field—using AI to give every founder the same quality of practice that accelerator-backed teams get.
                                </p>

                                <p className="text-lg sm:text-xl font-semibold text-foreground border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded">
                                    Our vision: Make pitch perfection inevitable, not accidental.
                                </p>

                                <p>
                                    Beyond founders, we empower <strong className="text-foreground">VCs and institutions</strong> to automate deal flow, launch digital incubation programs, and discover top startups through AI-judged competitions.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who We Serve */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-8 sm:mb-12">
                            Who PitchDesk Serves
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                            {/* Founders */}
                            <div className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-8 hover:scale-105 transition-transform duration-300">
                                <Users className="w-10 h-10 sm:w-12 sm:h-12 mb-4 opacity-90" />
                                <h3 className="text-xl sm:text-2xl font-bold mb-4">For Startup Founders</h3>
                                <ul className="space-y-3 opacity-90 text-sm sm:text-base">
                                    <li className="flex gap-2">
                                        <span>✓</span>
                                        <span>Practice pitches with AI judges anytime</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span>✓</span>
                                        <span>Get instant feedback on your pitch performance</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span>✓</span>
                                        <span>Generate professional pitch scripts using AI</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span>✓</span>
                                        <span>Compete in pitch competitions for funding</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span>✓</span>
                                        <span>Connect with VCs and incubators directly</span>
                                    </li>
                                </ul>
                                <Link
                                    href="/start-a-pitch"
                                    className="mt-6 inline-block px-6 py-3 bg-background text-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
                                >
                                    Start Your First Pitch
                                </Link>
                            </div>

                            {/* VCs & Institutions */}
                            <div className="bg-secondary text-secondary-foreground rounded-2xl p-6 sm:p-8 hover:scale-105 transition-transform duration-300 border border-border">
                                <Building2 className="w-10 h-10 sm:w-12 sm:h-12 mb-4 text-primary" />
                                <h3 className="text-xl sm:text-2xl font-bold mb-4">For VCs & Institutions</h3>
                                <ul className="space-y-3 text-muted-foreground text-sm sm:text-base">
                                    <li className="flex gap-2">
                                        <span className="text-primary">✓</span>
                                        <span>Create custom AI VC agents for screening</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-primary">✓</span>
                                        <span>Launch investment programs and accelerators</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-primary">✓</span>
                                        <span>Host digital pitch competitions</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-primary">✓</span>
                                        <span>Automate deal flow and startup screening</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-primary">✓</span>
                                        <span>Manage applications with AI-powered insights</span>
                                    </li>
                                </ul>
                                <Link
                                    href="/dashboard"
                                    className="mt-6 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                                >
                                    Explore VC Tools
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-primary py-12 sm:py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-primary-foreground mb-4 sm:mb-6">
                            Ready to Master Your Pitch?
                        </h2>
                        <p className="text-lg sm:text-xl text-primary-foreground/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
                            Join thousands of founders using PitchDesk to practice, improve, and raise funding.
                        </p>
                        <Link
                            href="/start-a-pitch"
                            className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-background text-foreground rounded-lg font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
