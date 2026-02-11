import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageSquare, Mic, Target, TrendingUp, CheckCircle2, ArrowRight, Play } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'Practice Startup Pitch with AI Judges Online | AI Pitch Simulator - PitchDesk',
    description: 'Simulate real VC meetings with PitchDesk\'s AI pitch simulator. Practice your startup pitch with AI judges online, get realistic Q&A, instant feedback, and improve your fundraising success.',
    canonical: '/features/ai-pitch-simulator',
    keywords: [
        'practice startup pitch with AI judges online',
        'AI shark tank simulator',
        'simulate VC meeting online',
        'interactive pitch simulator',
        'AI pitch practice',
        'virtual pitch room',
    ],
});

export default function AIPitchSimulatorPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'AI Pitch Simulator',
        description: 'Practice your startup pitch with AI judges that simulate real VC meetings',
        url: 'https://pitchdesk.in/features/ai-pitch-simulator',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'AI Pitch Simulator', url: '/features/ai-pitch-simulator' },
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
                            <MessageSquare className="w-4 h-4" />
                            Interactive Pitch Practice
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            Practice Startup Pitch with <span className="text-primary">AI Judges Online</span>
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            Simulate real VC meetings with our <strong className="text-foreground">AI pitch simulator</strong>. Get realistic investor Q&A, tough questions, and instant evaluation—without risking your real pitch opportunities.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/start-a-pitch"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Play className="w-5 h-5" />
                                Start Your First Simulation
                            </Link>
                            <Link
                                href="/features/pitch-script-generator"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300"
                            >
                                Generate Pitch Script First
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Does */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                            What is the AI Pitch Simulator?
                        </h2>

                        <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                The <strong className="text-foreground">AI pitch simulator</strong> is your virtual pitch room where you can practice presenting your startup to AI-powered VC judges. Unlike static practice, our simulator creates a <strong className="text-foreground">realistic, interactive pitch simulator</strong> experience that mirrors actual investor meetings.
                            </p>

                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                Think of it as an <strong className="text-foreground">AI shark tank simulator for founders</strong>—you pitch, the AI asks tough questions, challenges your assumptions, and evaluates your responses in real-time.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">24/7</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Available anytime</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Real</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">VC-style questions</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Safe</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Risk-free practice</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who It's For */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Who Should Use the AI Pitch Simulator?
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { title: 'First-time Founders', desc: 'Never pitched before? Practice until you\'re confident.' },
                                { title: 'Pre-Seed Startups', desc: 'Prepare for your first investor meetings.' },
                                { title: 'Accelerator Applicants', desc: 'Nail your Y Combinator or Techstars pitch.' },
                                { title: 'Demo Day Prep', desc: 'Perfect your pitch before the big stage.' },
                                { title: 'Fundraising Teams', desc: 'Align your team on messaging and delivery.' },
                                { title: 'International Founders', desc: 'Practice pitching in English with AI feedback.' },
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
                            How It Works
                        </h2>

                        <div className="space-y-6 sm:space-y-8">
                            {[
                                { num: '1', title: 'Start Your Simulation', desc: 'Click "Start a Pitch" and choose your pitch type (text or voice).' },
                                { num: '2', title: 'Present Your Pitch', desc: 'Introduce your startup, explain the problem, solution, market, and business model.' },
                                { num: '3', title: 'Answer AI Questions', desc: 'The AI judge asks follow-up questions just like a real VC would.' },
                                { num: '4', title: 'Get Instant Feedback', desc: 'Receive a detailed score, transcript, and actionable improvement tips.' },
                                { num: '5', title: 'Iterate & Improve', desc: 'Practice again, track your progress, and watch your scores improve.' },
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

                {/* Benefits */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Why Use AI Pitch Simulator?
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { icon: Target, title: 'Risk-Free Practice', desc: 'Make mistakes privately before real investor meetings.' },
                                { icon: TrendingUp, title: 'Improve Faster', desc: 'Get instant feedback instead of waiting weeks for meetings.' },
                                { icon: CheckCircle2, title: 'Build Confidence', desc: 'Practice until you\'re pitch-perfect and ready to impress.' },
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
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
                            Related Features
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <Link href="/features/pitch-script-generator" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Script Generator</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Generate your pitch script before practicing.</p>
                            </Link>

                            <Link href="/features/real-time-feedback" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Voice Feedback</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Get live coaching on your delivery.</p>
                            </Link>

                            <Link href="/features/pitch-analysis" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Analysis</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">See detailed scoring and transcripts.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-8 sm:p-12 text-primary-foreground shadow-2xl">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
                            Ready to Practice Your Pitch?
                        </h2>
                        <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8">
                            Start simulating VC meetings today—completely free.
                        </p>
                        <Link
                            href="/start-a-pitch"
                            className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-background text-foreground rounded-lg font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                            Start Your First Simulation
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
