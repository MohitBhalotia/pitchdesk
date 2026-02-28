import type { Metadata } from 'next';
import Link from 'next/link';
import { Users, MessageSquare, Mic, CheckCircle2, Target, Zap, TrendingUp, Shield } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'Multi-VC Room Simulation | Shark Tank Style AI Pitch Practice - PitchDesk',
    description: 'Practice your pitch in a virtual room with multiple AI VCs on screen—Shark Tank style. Get grilled by a panel of investors at once. The most realistic multi-judge pitch simulation for founders.',
    canonical: '/features/multi-vc-simulation',
    keywords: [
        'multi VC pitch simulation',
        'Shark Tank style pitch practice',
        'panel of AI investors',
        'virtual pitch room multiple VCs',
        'AI investor panel simulator',
        'pitch to multiple judges',
    ],
});

export default function MultiVCSimulationPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'Multi-VC Room Simulation',
        description: 'Shark Tank style virtual room where founders pitch to multiple AI VCs on screen at once',
        url: 'https://pitchdesk.in/features/multi-vc-simulation',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'Multi-VC Room Simulation', url: '/features/multi-vc-simulation' },
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
                            <Users className="w-4 h-4" />
                            Shark Tank Style Practice
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            <span className="text-primary">Multi-VC Room Simulation</span> — Pitch to a Panel of AI Investors
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            Today you practice with <strong className="text-foreground">one</strong> AI VC. Soon: a <strong className="text-foreground">virtual room with multiple AI VCs on screen</strong>—like Shark Tank. Get questioned from different angles, handle competing concerns, and build the confidence to face a real panel.
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                            <span className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary/80 text-primary-foreground rounded-lg font-semibold cursor-not-allowed opacity-90">
                                <Users className="w-5 h-5" />
                                Enter Multi-VC Room (Incoming)
                            </span>
                            <Link
                                href="/start-a-pitch"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300 inline-flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Practice with One AI VC Now
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Is */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                            What is Multi-VC Room Simulation?
                        </h2>

                        <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                In real life, <strong className="text-foreground">demo days and partner meetings</strong> often put you in front of several investors at once. They interrupt, build on each other&apos;s questions, and push different aspects of your business. Our <strong className="text-foreground">multi-VC room simulation</strong> brings that into a virtual room: multiple AI VCs on screen, each with a voice and a perspective.
                            </p>

                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                Think <strong className="text-foreground">Shark Tank style</strong>—but you&apos;re in the hot seat. One AI might focus on market size, another on traction, another on the team. You learn to pivot between questions, hold the room, and stay clear under pressure. Founders searching for &quot;how to practice pitch with multiple investors&quot; or &quot;panel pitch practice&quot; are exactly who this is for: <strong className="text-foreground">multi-judge pitch simulation</strong> that mirrors real partner meetings and demo days.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">2–5+</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">AI VCs in the room</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Panel</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Realistic dynamics</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Safe</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Practice before the real panel</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who It's For */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Who Benefits from Multi-VC Practice?
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { title: 'Demo Day Founders', desc: 'Rehearse for events where 3–5 investors are in the room or on the call.' },
                                { title: 'Accelerator Interviews', desc: 'YC, Techstars, and others often use panel formats—get ready for it.' },
                                { title: 'Partner Meetings', desc: 'When multiple partners from one fund are on the call, practice the dynamic.' },
                                { title: 'Pitch Competitions', desc: 'Many competitions use a judge panel—simulate that pressure safely.' },
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
                            How Does Multi-VC Room Simulation Work?
                        </h2>

                        <div className="space-y-6 sm:space-y-8">
                            {[
                                { num: '1', title: 'Enter the Virtual Room', desc: 'You\'ll see multiple AI VC avatars on screen—each representing a different judge or partner in the room.' },
                                { num: '2', title: 'Present to the Panel', desc: 'Pitch as you would in a real meeting. The AI VCs listen and can interrupt, ask follow-ups, or build on each other\'s questions.' },
                                { num: '3', title: 'Handle Different Angles', desc: 'One might drill into market size, another into traction or team. You practice switching context and keeping everyone engaged.' },
                                { num: '4', title: 'Get Panel Feedback', desc: 'After the session, see how you did across the panel—where you were strong and where each &quot;investor&quot; had concerns.' },
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

                {/* Why Multiple VCs Change the Game / Benefits */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Why Use Multi-VC Pitch Practice?
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { icon: Shield, title: 'Practice Before the Real Panel', desc: 'Make mistakes in a safe space. When you face 3–5 real VCs, you\'ll have already felt the pressure and learned to stay calm.' },
                                { icon: TrendingUp, title: 'Closer to Real Dynamics', desc: 'Single-VC practice is great; panel practice is the next step. Interruptions, competing questions, and room control are different skills.' },
                                { icon: Target, title: 'Build Panel Confidence', desc: 'The more you practice with multiple AI judges, the more natural it feels to address a room full of investors.' },
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

                {/* Why Multiple VCs Change the Game - details */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-secondary/20">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Why Multiple VCs Change the Game
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { title: 'Different Angles', description: 'Each AI VC can focus on market, product, team, or traction—like real panelists.' },
                                { title: 'Interruptions & Follow-ups', description: 'Simulate being cut off, challenged, or asked to clarify on the spot.' },
                                { title: 'Room Control', description: 'Learn to acknowledge one question while keeping others engaged.' },
                                { title: 'Confidence Under Pressure', description: 'Build the composure you need when multiple people are watching and judging.' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">{item.title}</h3>
                                            <p className="text-sm sm:text-base text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                            <Link href="/features/ai-pitch-simulator" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">AI Pitch Simulator</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Practice with one AI VC today.</p>
                            </Link>

                            <Link href="/features/real-time-feedback" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Real-Time Voice Feedback</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Get live coaching on delivery and clarity.</p>
                            </Link>

                            <Link href="/features/pitch-analysis" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Analysis</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">See how you perform and where to improve.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-8 sm:p-12 text-primary-foreground shadow-2xl">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
                            Get Ready for the Panel
                        </h2>
                        <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8">
                            Multi-VC room simulation is on the way. Until then, build confidence with our single AI VC simulator.
                        </p>
                        <span className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-primary-foreground/20 text-primary-foreground rounded-lg font-bold text-base sm:text-lg border border-primary-foreground/30 cursor-not-allowed">
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                            Enter Multi-VC Room (Incoming)
                        </span>
                    </div>
                </section>
            </div>
        </>
    );
}
