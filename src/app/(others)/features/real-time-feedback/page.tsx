import type { Metadata } from 'next';
import Link from 'next/link';
import { Mic, Radio, Zap, MessageCircle, TrendingUp, CheckCircle2, ArrowRight, Volume2 } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'Voice-Based Pitch Practice | Real-Time AI Pitch Coaching',
    description: 'Practice pitching out loud with voice-based AI feedback. Get real-time pitch coaching, conversational AI investor responses, and live feedback on delivery, pacing, and confidence. The only interactive pitch simulator with voice.',
    canonical: '/features/real-time-feedback',
    keywords: [
        'voice based pitch practice',
        'conversational AI investor',
        'real-time pitch coaching AI',
        'speak your pitch to AI',
        'AI pitch coach for founders',
        'live pitch feedback software',
    ],
});

export default function RealTimeFeedbackPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'Real-Time Voice Feedback',
        description: 'Voice-based AI pitch coaching with real-time feedback on delivery and confidence',
        url: 'https://pitchdesk.in/features/real-time-feedback',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'Real-Time Voice Feedback', url: '/features/real-time-feedback' },
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
                            <Radio className="w-4 h-4" />
                            Live AI Coaching
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            <span className="text-primary">Voice-Based Pitch Practice</span> with Real-Time AI Feedback
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            The only <strong className="text-foreground">conversational AI investor</strong> that listens as you speak. Get <strong className="text-foreground">live pitch feedback software</strong> on delivery, confidence, pacing, and tone—while you&apos;re pitching, not after.
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                            <Link
                                href="/start-a-pitch"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Mic className="w-5 h-5" />
                                Try Voice Practice Now
                            </Link>
                            <Link
                                href="/features/ai-pitch-simulator"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300"
                            >
                                Learn About AI Simulator
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What Makes It Unique */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                            Why Voice-Based Practice is Different
                        </h2>

                        <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                Most pitch practice tools are text-based. You type your answers, read feedback, and never actually <em>speak</em> your pitch out loud. That&apos;s like learning to swim by reading about it.
                            </p>

                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                PitchDesk&apos;s <strong className="text-foreground">voice-based pitch practice</strong> feature is different. You speak, the AI listens and responds in real-time, and you get instant feedback on how you sound, not just what you say. It&apos;s the closest thing to a real VC meeting.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-8">
                                <div className="p-4 sm:p-6 bg-destructive/5 rounded-xl border border-destructive/20">
                                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                                        <span className="text-destructive">✗</span> Traditional Practice Tools
                                    </h3>
                                    <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                                        <li>→ Type written responses</li>
                                        <li>→ No voice interaction</li>
                                        <li>→ Can&apos;t assess delivery</li>
                                        <li>→ No real-time pacing feedback</li>
                                        <li>→ Doesn&apos;t build speaking confidence</li>
                                    </ul>
                                </div>

                                <div className="p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                                        <span className="text-primary">✓</span> PitchDesk Voice Practice
                                    </h3>
                                    <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                                        <li>→ Speak naturally like a real meeting</li>
                                        <li>→ AI listens and responds by voice</li>
                                        <li>→ Real-time delivery feedback</li>
                                        <li>→ Live pacing and confidence analysis</li>
                                        <li>→ Builds actual speaking skills</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who It's For */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Who Benefits from Voice-Based Practice?
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                            <div className="bg-card text-card-foreground rounded-2xl p-6 sm:p-8 border border-border hover:shadow-lg transition-all hover:border-primary/50">
                                <Mic className="w-10 h-10 sm:w-12 sm:h-12 mb-4 text-primary" />
                                <h3 className="text-lg sm:text-2xl font-bold mb-4">Nervous Presenters</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Overcome pitch anxiety by practicing speaking out loud in a judgment-free environment. Build confidence before your real investor meetings. Our <strong className="text-foreground">real-time pitch coaching AI</strong> tracks your nervousness and helps you improve.
                                </p>
                            </div>

                            <div className="bg-card text-card-foreground rounded-2xl p-6 sm:p-8 border border-border hover:shadow-lg transition-all hover:border-primary/50">
                                <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 mb-4 text-primary" />
                                <h3 className="text-lg sm:text-2xl font-bold mb-4">Non-Native English Speakers</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Practice pronunciation, fluency, and natural conversational flow. The <strong className="text-foreground">conversational AI investor</strong> adapts to your speaking style and helps you refine your delivery in real-time.
                                </p>
                            </div>

                            <div className="bg-card text-card-foreground rounded-2xl p-6 sm:p-8 border border-border hover:shadow-lg transition-all hover:border-primary/50">
                                <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 mb-4 text-primary" />
                                <h3 className="text-lg sm:text-2xl font-bold mb-4">Introverted Founders</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Not naturally outgoing? Practice speaking confidently without the pressure of a live audience. Get comfortable thinking on your feet in a safe, private space.
                                </p>
                            </div>

                            <div className="bg-card text-card-foreground rounded-2xl p-6 sm:p-8 border border-border hover:shadow-lg transition-all hover:border-primary/50">
                                <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 mb-4 text-primary" />
                                <h3 className="text-lg sm:text-2xl font-bold mb-4">Demo Day Presenters</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Preparing for a high-stakes demo day? Use our <strong className="text-foreground">AI voice judge platform</strong> to practice your delivery, timing, and stage presence until it&apos;s second nature.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-secondary/20">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            How Real-Time Voice Feedback Works
                        </h2>

                        <div className="space-y-6 sm:space-y-8">
                            {/* Step 1 */}
                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">Allow Microphone Access</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Grant permission for PitchDesk to use your microphone. All voice processing happens securely, and your pitches are private and encrypted.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">Start Speaking Your Pitch</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Talk naturally, as if you&apos;re in a real investor meeting. The AI listens, processes your speech in real-time, and understands both your content and delivery style.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">Get Live Vocal Feedback</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        As you speak, the AI analyzes your pacing, filler words, pauses, tone, and confidence. You&apos;ll see real-time indicators like &quot;Too fast,&quot; &quot;Good pacing,&quot; or &quot;Low energy.&quot;
                                    </p>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    4
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">AI Asks Follow-Up Questions</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        The <strong className="text-foreground">conversational AI investor</strong> responds by voice, asking realistic follow-up questions about your business. Engage in a natural back-and-forth conversation, just like a real VC meeting.
                                    </p>
                                </div>
                            </div>

                            {/* Step 5 */}
                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    5
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">Review Detailed Analysis</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        After your pitch, review a detailed breakdown of your delivery: speech rate, confidence score, filler word count, pause patterns, energy levels, and areas for improvement.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What You Get Feedback On */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            What the AI Analyzes in Real-Time
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                {
                                    title: 'Speech Pacing',
                                    description: 'Are you speaking too fast, too slow, or just right? The AI tracks your words per minute and alerts you if you need to slow down or speed up.',
                                },
                                {
                                    title: 'Filler Words',
                                    description: 'Counts "um," "uh," "like," "you know," and other filler words that weaken your pitch. Get instant alerts when you use them too often.',
                                },
                                {
                                    title: 'Confidence Level',
                                    description: 'Voice analysis detects hesitation, stammering, and uncertainty in your tone. Build confidence by seeing your improvement over multiple sessions.',
                                },
                                {
                                    title: 'Energy & Enthusiasm',
                                    description: 'Pitch needs energy! The AI measures your vocal energy and passion. It will tell you if you sound flat or disengaged.',
                                },
                                {
                                    title: 'Clarity & Pronunciation',
                                    description: 'Ensure every word is clear. Especially useful for non-native English speakers or technical founders explaining complex products.',
                                },
                                {
                                    title: 'Pause Patterns',
                                    description: 'Strategic pauses are powerful. The AI tracks where you pause and whether you use silence effectively for emphasis.',
                                },
                                {
                                    title: 'Articulation',
                                    description: 'Are you mumbling or enunciating clearly? The AI provides feedback on vocal clarity and diction.',
                                },
                                {
                                    title: 'Question Handling',
                                    description: 'How well do you answer tough questions? The AI scores your responses on relevance, clarity, and confidence.',
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{item.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-primary/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-foreground">
                            Why Voice Practice is Critical
                        </h2>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                                <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Your Pitch Deck Won&apos;t Save You</h3>
                                <p className="text-muted-foreground">
                                    A beautiful slide deck means nothing if you can&apos;t articulate your vision confidently. VCs invest in founders, not PowerPoint. Practice your <em>delivery</em>, not just your content.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                                <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">First Impressions Are Everything</h3>
                                <p className="text-muted-foreground">
                                    You have 30 seconds to grab a VC&apos;s attention. If you sound nervous, unprepared, or unclear, the meeting is over before it starts. Voice practice builds the confidence needed to nail that first impression.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                                <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Written Practice Doesn&apos;t Transfer to Speaking</h3>
                                <p className="text-muted-foreground">
                                    You might know your pitch by heart on paper, but speaking it out loud is a totally different skill. Voice practice bridges the gap between knowing and delivering.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                                <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Build Muscle Memory</h3>
                                <p className="text-muted-foreground">
                                    The more you <em>speak</em> your pitch, the more natural it becomes. By the time you&apos;re in front of real VCs, your pitch will flow effortlessly because your brain and mouth have rehearsed it hundreds of times.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Real Use Cases */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            When to Use Voice-Based Practice
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border hover:border-primary/30 transition-colors">
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Before Your First VC Meeting</h3>
                                <p className="text-muted-foreground">
                                    Run through your pitch 10-20 times with voice feedback to eliminate nervousness and build fluency. Walk into your meeting calm and confident.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border hover:border-primary/30 transition-colors">
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Demo Day Rehearsals</h3>
                                <p className="text-muted-foreground">
                                    Practice your stage pitch with live voice feedback. Fine-tune your pacing, eliminate filler words, and master the art of speaking to a large audience.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border hover:border-primary/30 transition-colors">
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Pitch Competition Prep</h3>
                                <p className="text-muted-foreground">
                                    Sharpen your delivery for high-pressure pitch contests. Practice speaking under time constraints and get feedback on your energy and enthusiasm.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border hover:border-primary/30 transition-colors">
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Overcoming Stage Fright</h3>
                                <p className="text-muted-foreground">
                                    Build confidence by practicing speaking in a private, judgment-free environment. Track your nervousness score and watch it drop over time.
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
                            <Link href="/features/ai-pitch-simulator" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">AI Pitch Simulator</h3>
                                <p className="text-muted-foreground text-sm">Full pitch simulation with AI judges and Q&A.</p>
                            </Link>

                            <Link href="/features/pitch-analysis" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Analysis</h3>
                                <p className="text-muted-foreground text-sm">Detailed scoring and transcript analysis after each session.</p>
                            </Link>

                            <Link href="/features/pitch-competitions" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Competitions</h3>
                                <p className="text-muted-foreground text-sm">Test your voice skills in live competitions.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-8 sm:p-12 text-primary-foreground shadow-2xl">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
                            Start Speaking Your Pitch Out Loud
                        </h2>
                        <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8">
                            Build real speaking confidence with voice-based AI feedback.
                        </p>
                        <Link
                            href="/start-a-pitch"
                            className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-background text-foreground rounded-lg font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
                            Practice with Voice Now
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
