import type { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3, FileText, Target, CheckCircle2, Eye, Award, UserPlus, TrendingUp, MessageSquare } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'AI Pitch Scoring System | Pitch Transcript Analysis Tool',
    description: 'Get detailed AI pitch scoring and analysis after every pitch. Pitch transcript analysis, scoring rubrics, performance metrics, and actionable improvement tips. AI tool to evaluate startup pitch quality.',
    canonical: '/features/pitch-analysis',
    keywords: [
        'AI pitch scoring system',
        'pitch transcript analysis tool',
        'automated pitch evaluation',
        'AI tool to evaluate startup pitch',
        'pitch performance scoring software',
        'AI feedback on my pitch',
        'pitch refinement AI tool',
    ],
});

export default function PitchAnalysisPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'Pitch Analysis',
        description: 'AI pitch scoring system with detailed transcript analysis, improvement tips, and performance feedback',
        url: 'https://pitchdesk.in/features/pitch-analysis',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'Pitch Analysis', url: '/features/pitch-analysis' },
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

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow text-yellow-foreground rounded-full text-sm font-medium mb-6">
                            <BarChart3 className="w-4 h-4" />
                            Scores + Feedback + Improvement Tips
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            <span className="text-primary">AI Pitch Analysis</span> — Know Exactly Where You Stand
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            After every pitch, PitchDesk gives you a <strong>score out of 100, broken down by category</strong>, with specific feedback on your <strong>strengths, weaknesses, and exactly what to improve</strong> — like having a pitch coach in your pocket.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/start-a-pitch"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Target className="w-5 h-5" />
                                Try a Pitch &amp; Get Analysis
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

                {/* What You Get */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                            What You Get After Every Pitch
                        </h2>

                        <div className="bg-card rounded-2xl p-8 md:p-10 shadow-lg border border-border mb-10">
                            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                                Every pitch on PitchDesk is automatically analyzed by AI. You get a <strong className="text-foreground">comprehensive score, a full transcript, and a detailed breakdown</strong> — not vague feedback, but specific insights: what you did well, where you fell short, and the exact steps to get better.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Think of it as a <strong className="text-foreground">pitch coach who reviews every session</strong> and tells you: &ldquo;Your market sizing was weak — here&apos;s what to say instead&rdquo; or &ldquo;Your delivery was strong but you used too many filler words.&rdquo;
                            </p>

                            <div className="grid sm:grid-cols-3 gap-6 mt-8">
                                <div className="text-center p-6 bg-mint/25 rounded-xl">
                                    <div className="text-4xl font-bold text-ink mb-2">/100</div>
                                    <p className="text-muted-foreground">Comprehensive pitch score</p>
                                </div>
                                <div className="text-center p-6 bg-yellow/25 rounded-xl">
                                    <div className="text-4xl font-bold text-ink mb-2">7+</div>
                                    <p className="text-muted-foreground">Scoring categories</p>
                                </div>
                                <div className="text-center p-6 bg-pink/25 rounded-xl">
                                    <div className="text-4xl font-bold text-ink mb-2">Actionable</div>
                                    <p className="text-muted-foreground">Improvement tips per weakness</p>
                                </div>
                            </div>
                        </div>

                        {/* 6 key things included */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    icon: BarChart3,
                                    title: 'Score Out of 100 — With Category Breakdown',
                                    description: 'Your overall pitch is scored across 7 dimensions: Market Opportunity, Problem & Solution, Team, Traction, Business Model, Competitive Advantage, and Pitch Delivery. See where you excel and where you drop points.',
                                },
                                {
                                    icon: TrendingUp,
                                    title: 'Strengths — What You Did Well',
                                    description: 'The AI highlights what landed: strong storytelling, clear value proposition, impressive traction data, confident delivery, or a well-articulated ask. Know what to keep doing.',
                                },
                                {
                                    icon: Target,
                                    title: 'Weaknesses + Exact Improvement Tips',
                                    description: 'For every area where you scored low, you get specific suggestions: "Your market size was vague — state TAM/SAM/SOM with sources" or "Your ask was unclear — end with a precise funding amount and use of funds."',
                                },
                                {
                                    icon: MessageSquare,
                                    title: 'Full Pitch Transcript',
                                    description: 'Word-for-word transcript of your pitch and the AI\'s questions. Review exactly what you said, how you answered tough questions, and where your responses could be tightened.',
                                },
                                {
                                    icon: Eye,
                                    title: 'Delivery Feedback (Voice Pitches)',
                                    description: 'If you used voice, get metrics on pacing, filler words ("um", "like"), confidence level, energy, and pauses. See where nerves showed and how to sound more assured.',
                                },
                                {
                                    icon: Award,
                                    title: 'Progress Tracking Over Time',
                                    description: 'Compare your scores across multiple sessions. Track improvements week over week — watch your Market score climb from 14/25 to 22/25 as you act on the feedback.',
                                },
                            ].map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <div key={idx} className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                                        <div className="flex items-start gap-3">
                                            <Icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                                                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Scoring Dimensions */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-card/50">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
                            How Your Pitch is Scored
                        </h2>
                        <p className="text-center text-muted-foreground mb-10 text-lg">Each category has a weight. You&apos;ll know exactly where your score came from — and what to fix.</p>

                        <div className="space-y-4">
                            {[
                                { pct: '25%', label: 'Market Opportunity', desc: 'TAM/SAM/SOM, market timing, and customer understanding. Is the opportunity big enough?' },
                                { pct: '20%', label: 'Problem & Solution Fit', desc: 'Pain point clarity, solution effectiveness, and product-market fit.' },
                                { pct: '15%', label: 'Team & Execution', desc: 'Founder expertise, domain knowledge, and execution track record.' },
                                { pct: '15%', label: 'Traction & Validation', desc: 'Revenue, customers, growth metrics, and proof this actually works.' },
                                { pct: '10%', label: 'Business Model', desc: 'Revenue model clarity, unit economics, and path to profitability.' },
                                { pct: '10%', label: 'Competitive Advantage', desc: 'Differentiation, moat, defensibility, and barriers to entry.' },
                                { pct: '5%', label: 'Pitch Quality & Delivery', desc: 'Clarity, storytelling, confidence, energy, and handling tough questions.' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-card rounded-xl p-5 shadow-sm border border-border flex items-center gap-5">
                                    <div className="flex-shrink-0 w-14 h-14 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-sm">
                                        {item.pct}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">{item.label}</h3>
                                        <p className="text-muted-foreground text-sm mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Example Report Preview */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
                            Example Analysis Report
                        </h2>
                        <p className="text-center text-muted-foreground mb-10 text-lg">This is what you&apos;ll see after your pitch — your scores, your gaps, and your next steps.</p>

                        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                            <div className="flex items-center justify-between mb-6 pb-6 border-b">
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground">Your Pitch Score</h3>
                                    <p className="text-muted-foreground">Evaluated on {new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-primary">78</div>
                                    <p className="text-muted-foreground">/100</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                {[
                                    { label: 'Market Opportunity', score: '22/25', pct: '88%' },
                                    { label: 'Problem & Solution', score: '16/20', pct: '80%' },
                                    { label: 'Team & Execution', score: '12/15', pct: '80%' },
                                    { label: 'Traction & Validation', score: '9/15', pct: '60%' },
                                    { label: 'Business Model', score: '8/10', pct: '80%' },
                                    { label: 'Competitive Advantage', score: '8/10', pct: '80%' },
                                    { label: 'Pitch Quality', score: '3/5', pct: '60%' },
                                ].map((row, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between mb-1">
                                            <span className="font-semibold text-foreground text-sm">{row.label}</span>
                                            <span className="text-primary font-bold text-sm">{row.score}</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div className="bg-primary h-2 rounded-full" style={{ width: row.pct }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t">
                                <div>
                                    <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        What You Did Well
                                    </h4>
                                    <ul className="space-y-2 text-muted-foreground text-sm">
                                        <li>• Clear articulation of market size and opportunity</li>
                                        <li>• Strong understanding of customer pain points</li>
                                        <li>• Well-defined revenue model and business logic</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-primary" />
                                        Where to Improve &amp; How
                                    </h4>
                                    <ul className="space-y-2 text-muted-foreground text-sm">
                                        <li>• <strong className="text-foreground">Traction low:</strong> Share exact customer count, MRR, or growth rate</li>
                                        <li>• <strong className="text-foreground">Filler words:</strong> Practice reducing &ldquo;um&rdquo; and &ldquo;like&rdquo; for more confidence</li>
                                        <li>• <strong className="text-foreground">Competitive moat:</strong> Explain specifically why competitors can&apos;t copy you</li>
                                    </ul>
                                </div>
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

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Link href="/features/ai-pitch-simulator" className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Target className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">AI Pitch Simulator</h3>
                                <p className="text-muted-foreground text-sm">Practice pitching to AI VCs — then get your analysis report.</p>
                            </Link>

                            <Link href="/features/real-time-feedback" className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Eye className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">Real-Time Feedback</h3>
                                <p className="text-muted-foreground text-sm">Get live voice coaching during your pitch, not just after.</p>
                            </Link>

                            <Link href="/features/pitch-script-generator" className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <FileText className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">Pitch Script Generator</h3>
                                <p className="text-muted-foreground text-sm">Use AI analysis gaps to write a stronger pitch script.</p>
                            </Link>

                            <Link href="/features/ai-virtual-cofounder" className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <UserPlus className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">AI Virtual Co-Founder</h3>
                                <p className="text-muted-foreground text-sm">Discuss the analysis results and plan your improvements.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-12 text-primary-foreground shadow-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Find Out What&apos;s Holding Your Pitch Back
                        </h2>
                        <p className="text-xl opacity-90 mb-8">
                            Pitch once. Get your score, see your gaps, receive exact improvement steps.
                        </p>
                        <Link
                            href="/start-a-pitch"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-card text-primary rounded-lg font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            <Target className="w-6 h-6" />
                            Start Pitching &amp; Get Analysis
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
