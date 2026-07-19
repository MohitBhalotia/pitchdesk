import type { Metadata } from 'next';
import Link from 'next/link';
import { UserPlus, MessageCircle, Lightbulb, CheckCircle2, Target, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'AI Virtual Co-Founder | Talk to Your AI Partner Daily',
    description: 'Set up your AI virtual co-founder and talk daily. Discuss strategy, ideas, decisions, and execution. Your always-available partner for thinking through startup challenges—solo founders and teams.',
    canonical: '/features/ai-virtual-cofounder',
    keywords: [
        'AI virtual co-founder',
        'AI co-founder for startups',
        'talk to AI about startup',
        'AI business partner founder',
        'solo founder AI assistant',
        'AI strategy partner',
        'startup sounding board AI',
    ],
});

export default function AIVirtualCofounderPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'AI Virtual Co-Founder',
        description: 'Set up an AI co-founder to talk with daily—discuss strategy, ideas, and decisions for your startup',
        url: 'https://pitchdesk.in/features/ai-virtual-cofounder',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'AI Virtual Co-Founder', url: '/features/ai-virtual-cofounder' },
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

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink text-pink-foreground rounded-full text-sm font-medium mb-6">
                            <UserPlus className="w-4 h-4" />
                            Your AI Partner
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            <span className="text-primary">AI Virtual Co-Founder</span> — Talk Daily, Decide Smarter
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            Founders need a sounding board. Set up your <strong className="text-foreground">AI virtual co-founder</strong>, then talk every day: strategy, product, hiring, fundraising, or just thinking out loud. Your partner is always there—no scheduling, no judgment, just clarity.
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                            <span className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary/80 text-primary-foreground rounded-lg font-semibold cursor-not-allowed opacity-90">
                                <UserPlus className="w-5 h-5" />
                                Set Up My AI Co-Founder (Coming Soon)
                            </span>
                            <Link
                                href="/features/ai-pitch-simulator"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300 inline-flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Practice Pitch with AI Now
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Is */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                            What is an AI Virtual Co-Founder?
                        </h2>

                        <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                A <strong className="text-foreground">virtual co-founder</strong> is an AI you configure to match your startup—stage, market, goals. You don’t just ask one-off questions; you <strong className="text-foreground">talk regularly</strong>: daily standups, idea dumps, “what would you do?” moments, and decision checks. It remembers context so conversations build over time.
                            </p>

                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                Whether you&apos;re <strong className="text-foreground">solo</strong> and need a partner to think with, or in a team and want a neutral sparring partner, the AI co-founder is there to challenge assumptions, reflect your thinking back, and help you see options you might miss alone. People searching for &quot;AI co-founder for startups&quot; or &quot;solo founder support&quot; are looking for exactly this: a <strong className="text-foreground">startup sounding board</strong> that&apos;s always available.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
                                <div className="text-center p-4 sm:p-6 bg-mint/25 rounded-xl">
                                    <div className="text-3xl sm:text-4xl font-bold text-ink mb-2">Daily</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Conversations that compound</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-yellow/25 rounded-xl">
                                    <div className="text-3xl sm:text-4xl font-bold text-ink mb-2">Context</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Remembers your startup</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-pink/25 rounded-xl">
                                    <div className="text-3xl sm:text-4xl font-bold text-ink mb-2">Always on</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">No scheduling needed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who It's For */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Who Benefits from an AI Co-Founder?
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { title: 'Solo Founders', desc: 'No co-founder yet? Get a thinking partner for strategy, product, and tough calls.' },
                                { title: 'Early-Stage Teams', desc: 'Use the AI as a neutral third perspective when you and your co-founder disagree.' },
                                { title: 'Remote or Async Teams', desc: 'When your co-founder is in another time zone, the AI is there when you need to talk.' },
                                { title: 'First-Time Founders', desc: 'Someone to ask “is this normal?” and “what would you do?” without feeling judged.' },
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
                            How Does the AI Virtual Co-Founder Work?
                        </h2>

                        <div className="space-y-6 sm:space-y-8">
                            {[
                                { num: '1', title: 'Set Up Your AI Co-Founder', desc: 'Configure your startup context—stage, market, goals. The AI uses this so conversations stay relevant to your situation.' },
                                { num: '2', title: 'Talk Whenever You Need', desc: 'Chat or talk daily: morning check-ins, idea dumps, &quot;what would you do?&quot; moments, or decision framing. No scheduling required.' },
                                { num: '3', title: 'Build on Previous Conversations', desc: 'Your AI co-founder remembers context. Refer back to earlier discussions so your thinking compounds over time.' },
                                { num: '4', title: 'Get Challenged & Reflected', desc: 'The AI doesn\'t just agree—it asks questions, plays devil\'s advocate, and reflects your reasoning so you see blind spots.' },
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

                {/* Why Use It */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Why Use an AI Virtual Co-Founder?
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { icon: Clock, title: 'Always Available', desc: 'No scheduling, no time zones. When you need to think out loud at 2 AM or before a big meeting, your AI co-founder is there.' },
                                { icon: TrendingUp, title: 'Better Decisions', desc: 'Talking through options with a partner—even an AI—surfaces assumptions and gaps. You make fewer impulsive or unclear calls.' },
                                { icon: Target, title: 'Solo Founder Support', desc: 'If you don\'t have a co-founder yet, the AI fills the &quot;someone to talk to&quot; gap for strategy and sanity checks.' },
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

                {/* What You Can Do */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-primary/5">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            What You Can Do with Your AI Co-Founder
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { title: 'Daily Check-ins', description: 'Share wins, blockers, and priorities. Get structure without the formality of a human standup.' },
                                { title: 'Strategy Discussions', description: 'Talk through positioning, go-to-market, or pivots with a partner that knows your context.' },
                                { title: 'Idea Pressure-Testing', description: 'Dump half-baked ideas and get questions back—no embarrassment, just clarity.' },
                                { title: 'Decision Framing', description: '“Here’s the situation, here are options”—get your thinking reflected and challenged.' },
                                { title: 'Fundraising Prep', description: 'Rehearse narratives, anticipate investor questions, and refine your story over time.' },
                                { title: 'Mental Load Sharing', description: 'Offload the “who do I even ask?” feeling. Your AI co-founder is always available.' },
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

                {/* When to Use */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            When to Talk to Your AI Co-Founder
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { title: 'Daily Standups', desc: 'Quick wins, blockers, and priorities. Structure your day without the formality of a team meeting.' },
                                { title: 'Before Big Decisions', desc: 'Hiring, pricing, pivot, or partnership? Talk it through and get your reasoning stress-tested.' },
                                { title: 'After Tough Meetings', desc: 'Debrief after an investor no, a hard customer call, or internal conflict. Process and plan next steps.' },
                                { title: 'Fundraising Prep', desc: 'Rehearse narratives, anticipate questions, and refine your story before you hit the road.' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 border border-border hover:shadow-md transition-shadow">
                                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{item.title}</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
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
                                <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">AI Pitch Simulator</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Practice your pitch with AI VCs.</p>
                            </Link>

                            <Link href="/features/pitch-script-generator" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Script Generator</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Turn your narrative into a script.</p>
                            </Link>

                            <Link href="/features/pitch-analysis" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Analysis</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Get scored and improve over time.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-8 sm:p-12 text-primary-foreground shadow-2xl">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
                            Your AI Co-Founder Is Coming
                        </h2>
                        <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8">
                            Set up your virtual co-founder and start talking daily—soon. Until then, practice your pitch with our AI simulator.
                        </p>
                        <span className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-primary-foreground/20 text-primary-foreground rounded-lg font-bold text-base sm:text-lg border border-primary-foreground/30 cursor-not-allowed">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                            Set Up My AI Co-Founder (Coming Soon)
                        </span>
                    </div>
                </section>
            </div>
        </>
    );
}
