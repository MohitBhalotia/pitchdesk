import type { Metadata } from 'next';
import Link from 'next/link';
import { Presentation, Sparkles, LayoutTemplate, CheckCircle2, FileText, Target, Zap, Clock } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'AI Pitch Deck Generator | Create Investor Pitch Decks Online Free',
    description: 'Generate professional startup pitch decks with AI. Create investor-ready slides and presentations like Gamma or Canva. Best free AI pitch deck maker and pitchdeck generator for founders—problem, solution, market, traction, and more.',
    canonical: '/features/pitch-deck-generation',
    keywords: [
        'AI pitch deck generator',
        'create pitch deck online free',
        'startup pitch deck maker',
        'investor pitch deck template AI',
        'pitch deck presentation generator',
        'pitchdeck generator',
        'best pitch deck generator free',
        'free pitch deck maker online',
        'best pitchdeck generator',
    ],
});

export default function PitchDeckGenerationPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'Pitch Deck Generation',
        description: 'AI-powered tool to generate investor-ready pitch decks and slide presentations for startups',
        url: 'https://pitchdesk.in/features/pitch-deck-generation',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'Pitch Deck Generation', url: '/features/pitch-deck-generation' },
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

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-lavender text-lavender-foreground rounded-full text-sm font-medium mb-6">
                            <Presentation className="w-4 h-4" />
                            AI-Powered Deck Builder
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            <span className="text-primary">AI Pitch Deck Generator</span> for Founders
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            Create <strong className="text-foreground">investor-ready pitch decks</strong> in minutes—not days. Like Gamma or Canva, but built for startups. Generate slides for problem, solution, market, traction, team, and ask with one click.
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                            <span className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary/80 text-primary-foreground rounded-lg font-semibold cursor-not-allowed opacity-90">
                                <LayoutTemplate className="w-5 h-5" />
                                Generate My Deck (Coming Soon)
                            </span>
                            <Link
                                href="/features/pitch-script-generator"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300 inline-flex items-center justify-center gap-2"
                            >
                                <FileText className="w-5 h-5" />
                                Generate Pitch Script Now
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Does */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                            What is Pitch Deck Generation?
                        </h2>

                        <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                A <strong className="text-foreground">pitch deck</strong> is the slides you send investors or present in meetings—problem, solution, market size, traction, team, and ask. Building one from scratch takes hours. Our <strong className="text-foreground">AI pitch deck generator</strong> creates a full, editable deck from your startup details so you can focus on storytelling, not design.
                            </p>

                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                Think <strong className="text-foreground">Gamma or Canva for startup pitch decks</strong>: you describe your startup, and AI generates slides you can customize. Export to PDF or PowerPoint and use it for fundraising, accelerators, or demo days. Whether you search &quot;pitchdeck generator&quot;, &quot;best pitch deck generator&quot;, or &quot;how to create a pitch deck&quot;—we automate that structure so you get a <strong className="text-foreground">pitch deck presentation</strong> that looks professional from day one.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
                                <div className="text-center p-4 sm:p-6 bg-mint/25 rounded-xl">
                                    <div className="text-3xl sm:text-4xl font-bold text-ink mb-2">10+</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Slides in one go</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-yellow/25 rounded-xl">
                                    <div className="text-3xl sm:text-4xl font-bold text-ink mb-2">Editable</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Customize every slide</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-pink/25 rounded-xl">
                                    <div className="text-3xl sm:text-4xl font-bold text-ink mb-2">Export</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">PDF & PPT ready</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-secondary/20">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            How Does Pitch Deck Generation Work?
                        </h2>

                        <div className="space-y-6 sm:space-y-8">
                            {[
                                { num: '1', title: 'Enter Your Startup Details', desc: 'Share your problem, solution, market size, traction, team, and funding ask—the same info you\'d use for a pitch script or investor meeting.' },
                                { num: '2', title: 'AI Generates Your Slides', desc: 'The AI structures your story into investor-standard slides: title, problem, solution, market, product, traction, business model, team, and ask.' },
                                { num: '3', title: 'Customize & Edit', desc: 'Every slide is editable. Change copy, add your branding, swap images, or tweak the narrative to match your voice.' },
                                { num: '4', title: 'Export & Share', desc: 'Download your deck as PDF or PowerPoint. Send to investors, use in accelerator applications, or present at demo days.' },
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
                            Who Needs a Pitch Deck Generator?
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { title: 'First-Time Founders', desc: 'No design skills? Generate a professional deck and tweak the content.' },
                                { title: 'Pre-Seed & Seed', desc: 'Get a fundraising-ready deck without hiring a designer.' },
                                { title: 'Accelerator Applicants', desc: 'YC, Techstars, and others often want a deck—create one fast.' },
                                { title: 'Demo Day Presenters', desc: 'Turn your narrative into slides that match your talk.' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{item.title}</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Use It */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Why Use an AI Pitch Deck Generator?
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { icon: Clock, title: 'Save Hours of Work', desc: 'Stop building slides from scratch. Get a full deck in minutes so you can focus on refining the story, not formatting.' },
                                { icon: Zap, title: 'Investor-Standard Structure', desc: 'Slides follow the format VCs and accelerators expect—problem, solution, market, traction, team, ask—so you look prepared.' },
                                { icon: Target, title: 'No Design Skills Needed', desc: 'You don\'t need Canva or PowerPoint expertise. The AI creates clean, professional slides you can customize.' },
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

                {/* When to Use */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-primary/5">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            When to Use Pitch Deck Generation
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { title: 'Before Fundraising', desc: 'Investors often ask for a deck before or after the first call. Have one ready instead of scrambling.' },
                                { title: 'Accelerator Applications', desc: 'YC, Techstars, and most accelerators require a pitch deck. Generate a draft and tailor it to their application.' },
                                { title: 'Demo Day or Pitch Events', desc: 'You need slides that match your talk. Generate a deck, then align your script and delivery to the same narrative.' },
                                { title: 'Updating an Old Deck', desc: 'Pivoted or have new traction? Feed the AI your latest info and get an updated deck without starting from zero.' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 border border-border hover:shadow-md transition-shadow">
                                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{item.title}</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* What's In the Deck */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-secondary/20">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            What Your Generated Deck Includes
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { title: 'Problem & Solution', description: 'Clear slides that articulate the pain point and your solution.' },
                                { title: 'Market Size (TAM/SAM/SOM)', description: 'Investor-standard market slides with room for your numbers.' },
                                { title: 'Product & Traction', description: 'Showcase product, metrics, and early validation.' },
                                { title: 'Business Model', description: 'How you make money and unit economics.' },
                                { title: 'Team', description: 'Founder and team intro that builds credibility.' },
                                { title: 'Ask & Use of Funds', description: 'Funding amount and how you\'ll use the capital.' },
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
                            <Link href="/features/pitch-script-generator" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Script Generator</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Write your narrative first, then turn it into a deck.</p>
                            </Link>

                            <Link href="/features/ai-pitch-simulator" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">AI Pitch Simulator</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Practice presenting your deck to AI VCs.</p>
                            </Link>

                            <Link href="/features/pitch-analysis" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Presentation className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Analysis</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Get scored on how well you present your deck.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-8 sm:p-12 text-primary-foreground shadow-2xl">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
                            Create Your Pitch Deck with AI
                        </h2>
                        <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8">
                            One-click deck generation—coming soon. Until then, generate your pitch script and practice with AI judges.
                        </p>
                        <span className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-primary-foreground/20 text-primary-foreground rounded-lg font-bold text-base sm:text-lg border border-primary-foreground/30 cursor-not-allowed">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                            Generate My Deck (Coming Soon)
                        </span>
                    </div>
                </section>
            </div>
        </>
    );
}
