import type { Metadata } from 'next';
import Link from 'next/link';
import { UserPlus, Search, CheckCircle2, Users, Heart, Target, ArrowRight, Sparkles, MessageCircle, Briefcase, Code, Palette, TrendingUp } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'Find a Co-Founder | Co-Founder Matching Platform for Startups',
    description: 'Find your perfect co-founder with PitchDesk\'s co-founder matching platform. Search for technical co-founders, business partners, and startup team members. The best co-founder finder for entrepreneurs.',
    canonical: '/features/cofounder-matching',
    keywords: [
        'find a co-founder',
        'co-founder matching platform',
        'startup co-founder search',
        'find technical co-founder',
        'co-founder finder',
        'startup partner matching',
        'find business partner startup',
        'co-founder dating for startups',
        'startup team matching',
        'find startup partner',
    ],
});

export default function CofounderMatchingPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'Co-Founder Matching',
        description: 'Find your perfect co-founder through smart matching based on skills, interests, and startup stage',
        url: 'https://pitchdesk.in/features/cofounder-matching',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'Co-Founder Matching', url: '/features/cofounder-matching' },
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
                            <UserPlus className="w-4 h-4" />
                            Startup Partner Matching
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            <span className="text-primary">Find Your Co-Founder</span> — The Right Partner for Your Startup
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            Looking to <strong className="text-foreground">find a co-founder</strong>? Our <strong className="text-foreground">co-founder matching platform</strong> connects you with complementary founders based on skills, interests, and startup stage. Stop searching blindly—find your perfect <strong className="text-foreground">startup partner</strong> through smart matching.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <span className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary/80 text-primary-foreground rounded-lg font-semibold cursor-not-allowed opacity-90">
                                <Search className="w-5 h-5" />
                                Find Co-Founders (Coming Soon)
                            </span>
                            <Link
                                href="/features/founder-community"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300 inline-flex items-center justify-center gap-2"
                            >
                                <Users className="w-5 h-5" />
                                Join Founder Community
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Is */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                            What is Co-Founder Matching?
                        </h2>

                        <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                Our <strong className="text-foreground">co-founder matching platform</strong> is like a professional matchmaking service for startup founders. Whether you&apos;re looking to <strong className="text-foreground">find a technical co-founder</strong>, a business-minded partner, or someone with industry expertise—we help you discover founders whose skills and vision complement yours.
                            </p>

                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                Think of it as <strong className="text-foreground">co-founder dating for startups</strong>—but smarter. Instead of random networking, you browse profiles, see compatibility scores, and connect with founders who match your specific needs. Combined with our <strong className="text-foreground">founder community</strong>, you can vet potential partners through discussions before committing.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Match</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Skills-based pairing</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Connect</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Direct messaging</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Vet</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Through community</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-secondary/20">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            How Does Co-Founder Matching Work?
                        </h2>

                        <div className="space-y-6 sm:space-y-8">
                            {[
                                { num: '1', title: 'Create Your Founder Profile', desc: 'Share your background, skills, startup idea (if any), what you\'re looking for in a co-founder, and your commitment level.' },
                                { num: '2', title: 'Browse Potential Matches', desc: 'See founders who complement your skills. Filter by expertise (technical, business, design), industry, location, and stage.' },
                                { num: '3', title: 'Review Compatibility', desc: 'View match scores based on complementary skills, shared interests, and aligned goals. Read their community posts to understand their thinking.' },
                                { num: '4', title: 'Connect & Chat', desc: 'Reach out to potential co-founders directly. Start conversations, discuss ideas, and see if there\'s chemistry.' },
                                { num: '5', title: 'Vet Through Community', desc: 'See how they engage in the founder community. Their posts, comments, and interactions reveal character and expertise.' },
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

                {/* Who Are You Looking For */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Find the Co-Founder You Need
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { icon: Code, title: 'Technical Co-Founder', desc: 'Engineers, developers, CTOs. Find someone who can build your product and lead tech decisions.' },
                                { icon: Briefcase, title: 'Business Co-Founder', desc: 'Sales, marketing, operations experts. Find someone who can sell, scale, and manage the business side.' },
                                { icon: Palette, title: 'Design Co-Founder', desc: 'UX/UI designers, product designers. Find someone who can make your product beautiful and usable.' },
                                { icon: Target, title: 'Industry Expert', desc: 'Domain specialists with deep industry knowledge. Find someone who knows your market inside out.' },
                                { icon: TrendingUp, title: 'Growth Co-Founder', desc: 'Marketing and growth hackers. Find someone who can acquire customers and drive traction.' },
                                { icon: Users, title: 'Generalist Partner', desc: 'Jack-of-all-trades founders. Find someone versatile who can wear multiple hats.' },
                            ].map((type, idx) => {
                                const Icon = type.icon;
                                return (
                                    <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                                        <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
                                        <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{type.title}</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground">{type.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Who Should Use */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-primary/5">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Who Should Use Co-Founder Matching?
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { title: 'Solo Founders with an Idea', desc: 'Have a startup idea but need a partner with complementary skills to execute it together.' },
                                { title: 'Builders Looking for Business Minds', desc: 'Technical founders who can build but need someone to handle sales, marketing, and business development.' },
                                { title: 'Business People Seeking Tech Talent', desc: 'Have the business acumen and market knowledge but need an engineer to build the product.' },
                                { title: 'Founders Open to New Ideas', desc: 'No specific idea yet, but ready to start something with the right partner and complementary vision.' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-lg border border-border">
                                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{item.title}</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* What Makes a Good Match */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                            What Makes a Great Co-Founder Match?
                        </h2>

                        <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                            <div className="space-y-6">
                                {[
                                    { title: 'Complementary Skills', desc: 'The best co-founder relationships have minimal skill overlap. If you\'re strong in sales, find someone strong in product.' },
                                    { title: 'Shared Values & Vision', desc: 'Skills can complement, but values should align. Work ethic, risk tolerance, and long-term vision need to match.' },
                                    { title: 'Trust & Communication', desc: 'You\'ll disagree. A lot. The ability to have hard conversations and still move forward together is essential.' },
                                    { title: 'Commitment Level Alignment', desc: 'Both full-time? One part-time? Different commitment levels cause friction. Align expectations early.' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">{item.title}</h3>
                                            <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-secondary/20">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Why Use Our Co-Founder Matching?
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { icon: Target, title: 'Smart Matching', desc: 'Algorithm-based matching based on complementary skills, not just random networking.' },
                                { icon: Users, title: 'Community Vetting', desc: 'See potential co-founders in action through their community engagement before committing.' },
                                { icon: Heart, title: 'Founder-Focused', desc: 'Built specifically for startup founders, not generic professional networking.' },
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
                            <Link href="/features/founder-community" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Founder Community</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Connect and vet potential co-founders through community engagement.</p>
                            </Link>

                            <Link href="/features/ai-virtual-cofounder" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">AI Virtual Co-Founder</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Need a thinking partner now? Talk daily with your AI co-founder.</p>
                            </Link>

                            <Link href="/features/idea-validator-ai" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">AI Idea Validator</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Validate your idea before finding a co-founder to build it with.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-8 sm:p-12 text-primary-foreground shadow-2xl">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
                            Find Your Perfect Co-Founder
                        </h2>
                        <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8">
                            The right partner can make or break your startup. Start your search today.
                        </p>
                        <span className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-primary-foreground/20 text-primary-foreground rounded-lg font-bold text-base sm:text-lg border border-primary-foreground/30 cursor-not-allowed">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                            Find Co-Founders (Coming Soon)
                        </span>
                    </div>
                </section>
            </div>
        </>
    );
}
