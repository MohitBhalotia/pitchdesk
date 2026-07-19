import type { Metadata } from 'next';
import Link from 'next/link';
import {
    MessageSquare,
    FileText,
    Mic,
    Trophy,
    BarChart3,
    Building2,
    Bot,
    Target,
    ArrowRight,
    Sparkles,
    Presentation,
    Users,
    UserPlus,
    Lightbulb,
    Search,
    Database,
    LineChart,
    Clock
} from 'lucide-react';
import { generateSEOMetadata, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'Features | Best AI Pitch Practice Tool with Voice Feedback',
    description: 'Explore PitchDesk features: AI pitch simulator, pitch deck generator, multi-VC room simulation, AI co-founder, idea validator, founder community, co-founder matching, investor CRM, and startup metrics dashboard. The complete pitch practice software for founders.',
    canonical: '/features',
    keywords: [
        'best startup pitch practice tool',
        'best AI pitch practice tool',
        'pitch practice software for founders',
        'pitch deck practice platform',
        'startup pitch training platform',
        'AI pitch practice with voice',
        'pitchdeck practice platform',
        'startup idea validation tool',
        'founder community platform',
        'find a co-founder',
        'investor CRM for startups',
        'startup metrics dashboard',
    ],
});

const features = [
    {
        icon: MessageSquare,
        title: 'AI Pitch Simulator',
        description: 'Practice your startup pitch with AI judges that simulate real VC meetings. Get realistic Q&A, tough questions, and instant evaluation.',
        href: '/features/ai-pitch-simulator',
        keywords: 'Interactive pitch practice with AI',
    },
    {
        icon: FileText,
        title: 'Pitch Script Generator',
        description: 'Generate professional investor pitch scripts using AI. Get structured, compelling narratives tailored to your startup and audience.',
        href: '/features/pitch-script-generator',
        keywords: 'AI-powered pitch writing assistant',
    },
    {
        icon: Mic,
        title: 'Real-Time Voice Feedback',
        description: 'Practice pitching out loud with voice-based AI. Get live coaching on delivery, confidence, clarity, and pacing as you speak.',
        href: '/features/real-time-feedback',
        keywords: 'Conversational AI pitch coach',
    },
    {
        icon: Trophy,
        title: 'Pitch Competitions',
        description: 'Join startup pitch competitions, demo days, and tournaments. Compete on leaderboards and get discovered by real investors.',
        href: '/features/pitch-competitions',
        keywords: 'Virtual startup competitions platform',
    },
    {
        icon: BarChart3,
        title: 'VC Deal Flow Automation',
        description: 'For VCs: Automate startup screening with AI. Manage applications, evaluate pitches at scale, and identify top deals faster.',
        href: '/features/vc-deal-flow',
        keywords: 'AI-powered startup screening',
    },
    {
        icon: Building2,
        title: 'Investment Programs',
        description: 'For VCs: Launch digital incubators, accelerators, and investment programs. Manage cohorts, stages, and applications effortlessly.',
        href: '/features/investment-programs',
        keywords: 'Digital incubation platform',
    },
    {
        icon: Bot,
        title: 'Custom AI VC Agents',
        description: 'For VCs: Build personalized AI judges with custom evaluation criteria, investment theses, and sector focus for automated screening.',
        href: '/features/ai-vc-agents',
        keywords: 'Customizable AI investor simulator',
    },
    {
        icon: Target,
        title: 'Pitch Analysis & Scoring',
        description: 'Get detailed AI analysis of your pitch performance. See transcript breakdowns, scoring rubrics, and actionable improvement tips.',
        href: '/features/pitch-analysis',
        keywords: 'AI pitch scoring system',
    },
    {
        icon: Presentation,
        title: 'Pitch Deck Generation',
        description: 'Create investor-ready pitch decks with AI. Generate slides and presentations like on Gamma or Canva—tailored to your startup story.',
        href: '/features/pitch-deck-generation',
        keywords: 'AI pitch deck generator',
    },
    {
        icon: Users,
        title: 'Multi-VC Room Simulation',
        description: 'Practice in a Shark Tank–style virtual room with multiple AI VCs on screen. Get grilled by a panel of investors at once.',
        href: '/features/multi-vc-simulation',
        keywords: 'Shark Tank style pitch simulation',
    },
    {
        icon: UserPlus,
        title: 'AI Virtual Co-Founder',
        description: 'Set up your AI co-founder and talk daily. Discuss strategy, ideas, and decisions with a partner that\'s always available.',
        href: '/features/ai-virtual-cofounder',
        keywords: 'AI co-founder for founders',
    },
    {
        icon: Lightbulb,
        title: 'AI Idea Validator',
        description: 'Validate your startup idea with AI. Discuss market potential, competition, and business viability before building.',
        href: '/features/idea-validator-ai',
        keywords: 'Startup idea validation tool',
    },
    {
        icon: Users,
        title: 'Founder Community',
        description: 'Connect with startup founders worldwide. Share experiences, post blogs, discuss challenges, and grow together.',
        href: '/features/founder-community',
        keywords: 'Founder networking platform',
    },
    {
        icon: Search,
        title: 'Co-Founder Matching',
        description: 'Find your perfect co-founder through smart matching. Connect with complementary founders based on skills and interests.',
        href: '/features/cofounder-matching',
        keywords: 'Find a co-founder platform',
    },
    {
        icon: Database,
        title: 'Founder CRM',
        description: 'Manage investor relationships like a sales pipeline. Track conversations, store meeting notes, and schedule follow-ups.',
        href: '/features/founder-crm',
        keywords: 'Investor CRM for startups',
    },
    {
        icon: LineChart,
        title: 'Startup Metrics Dashboard',
        description: 'Track revenue, growth rate, burn rate, runway, and customer acquisition. Generate investor-ready reports automatically.',
        href: '/features/startup-metrics-dashboard',
        keywords: 'Startup KPI tracker',
    },
];

// The first 8 are live in the product today. The remaining 8 have
// marketing/preview pages describing what's coming, but aren't wired into
// the product workspace yet — kept separate below so we're not overstating
// what's actually usable right now.
const liveFeatures = features.slice(0, 8);
const upcomingFeatures = features.slice(8);

const iconColors = [
    "bg-mint text-mint-foreground",
    "bg-yellow text-yellow-foreground",
    "bg-pink text-pink-foreground",
    "bg-lavender text-lavender-foreground",
];

export default function FeaturesPage() {
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
    ]);

    // Generate ItemList schema for features
    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: features.map((feature, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'SoftwareApplication',
                name: feature.title,
                description: feature.description,
                url: `https://pitchdesk.in${feature.href}`,
                applicationCategory: 'BusinessApplication',
            },
        })),
    };

    return (
        <>
            <script type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-lavender text-lavender-foreground rounded-full text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            Complete Pitch Training Platform
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl mb-6 leading-tight">
                            Everything You Need to <span className="text-primary">Master Your Pitch</span>
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                            From AI simulations to real competitions, PitchDesk provides the complete toolkit for founders and VCs to practice, evaluate, and perfect startup pitches.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/start-a-pitch"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Try It Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/about"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300"
                            >
                                About PitchDesk
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-8 sm:mb-10">
                            <h2 className="text-2xl sm:text-3xl mb-2">
                                Live in the Product
                            </h2>
                            <p className="text-muted-foreground max-w-2xl">
                                Ready to use today — jump in and start practicing.
                            </p>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                            {liveFeatures.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <Link
                                        key={index}
                                        href={feature.href}
                                        className="group bg-card rounded-2xl p-6 sm:p-7 hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-5 ${iconColors[index % iconColors.length]}`}>
                                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>

                                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                            {feature.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                            {feature.description}
                                        </p>

                                        <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                                            Explore Feature
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Coming Soon */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-8 sm:mb-10 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium mb-4">
                                <Clock className="w-3.5 h-3.5" />
                                In the Lab
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                                Building the Future of Fundraising
                            </h2>
                            <p className="text-muted-foreground">
                                These are next up on our roadmap. Take a look at what&apos;s
                                coming, and stay tuned — we&apos;re building fast.
                            </p>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                            {upcomingFeatures.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <Link
                                        key={index}
                                        href={feature.href}
                                        className="group relative bg-card/60 rounded-xl p-5 sm:p-6 border border-dashed border-border hover:border-primary/30 transition-all duration-300"
                                    >
                                        <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent text-accent-foreground">
                                            Coming Soon
                                        </span>
                                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                                            <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>

                                        <h3 className="text-base font-bold text-foreground mb-1.5 pr-16">
                                            {feature.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* For Founders vs For VCs */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-8 sm:mb-12">
                            Built for Founders & VCs
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                            {/* For Founders */}
                            <div className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-8">
                                <h3 className="text-xl sm:text-2xl font-bold mb-4">For Startup Founders</h3>
                                <ul className="space-y-3 opacity-90 text-sm sm:text-base">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1">✓</span>
                                        <span>Practice with AI judges anytime, anywhere</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1">✓</span>
                                        <span>Generate professional pitch scripts instantly</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1">✓</span>
                                        <span>Get real-time voice feedback on delivery</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1">✓</span>
                                        <span>Compete in pitch competitions for funding</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1">✓</span>
                                        <span>Track improvement with detailed analytics</span>
                                    </li>
                                </ul>
                                <Link
                                    href="/start-a-pitch"
                                    className="mt-6 inline-block px-6 py-3 bg-background text-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
                                >
                                    Start Practicing
                                </Link>
                            </div>

                            {/* For VCs */}
                            <div className="bg-secondary text-secondary-foreground rounded-2xl p-6 sm:p-8 border border-border">
                                <h3 className="text-xl sm:text-2xl font-bold mb-4">For VCs & Institutions</h3>
                                <ul className="space-y-3 text-muted-foreground text-sm sm:text-base">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>Build custom AI judges for screening</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>Automate deal flow and pitch evaluation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>Launch digital incubation programs</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>Host virtual pitch competitions</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>Discover top startups at scale</span>
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
                <section className="bg-primary py-12 sm:py-16 mb-0">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-primary-foreground mb-4 sm:mb-6">
                            Ready to Transform Your Pitch?
                        </h2>
                        <p className="text-lg sm:text-xl text-primary-foreground/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
                            Join thousands of founders and VCs using PitchDesk to practice, evaluate, and perfect their pitches.
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
