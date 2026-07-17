import type { Metadata } from 'next';
import Link from 'next/link';
import { Users, MessageCircle, FileText, Calendar, Award, Heart, ArrowRight, Sparkles, TrendingUp, CheckCircle2, Globe, Lightbulb } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'Founder Community | Connect with Startup Founders Online',
    description: 'Join the PitchDesk founder community. Connect with startup founders, share experiences, post blogs, discuss challenges, and grow together. The best entrepreneur community platform for founders.',
    canonical: '/features/founder-community',
    keywords: [
        'founder community platform',
        'startup founder network',
        'entrepreneur community online',
        'founder networking platform',
        'startup community for founders',
        'connect with other founders',
        'founder discussion forum',
        'startup peer support community',
        'entrepreneur networking site',
        'founder support network',
    ],
});

export default function FounderCommunityPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'Founder Community',
        description: 'Connect with startup founders, share experiences, and grow together in our entrepreneur community',
        url: 'https://pitchdesk.in/features/founder-community',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'Founder Community', url: '/features/founder-community' },
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

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-mint text-mint-foreground rounded-full text-sm font-medium mb-6">
                            <Users className="w-4 h-4" />
                            Startup Founder Network
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            Join the <span className="text-primary">Founder Community</span> — Connect, Share, Grow
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            Building a startup is hard—but you don&apos;t have to do it alone. Join our <strong className="text-foreground">founder community platform</strong> to connect with other entrepreneurs, share experiences, post blogs, discuss challenges, and learn from those who&apos;ve been there.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <span className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary/80 text-primary-foreground rounded-lg font-semibold cursor-not-allowed opacity-90">
                                <Users className="w-5 h-5" />
                                Join Community (Coming Soon)
                            </span>
                            <Link
                                href="/features/cofounder-matching"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300 inline-flex items-center justify-center gap-2"
                            >
                                Find a Co-Founder
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Is */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                            What is the Founder Community?
                        </h2>

                        <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                The <strong className="text-foreground">founder community</strong> is a professional <strong className="text-foreground">entrepreneur community online</strong> built specifically for startup founders. It&apos;s not just another social network—it&apos;s a dedicated space where founders share real experiences, post valuable content, discuss problems openly, and support each other through the startup journey.
                            </p>

                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                Whether you&apos;re looking to <strong className="text-foreground">connect with other founders</strong>, share your latest learnings, get feedback on a challenge, or simply find people who understand what you&apos;re going through—our <strong className="text-foreground">startup founder network</strong> is the place. It&apos;s the <strong className="text-foreground">founder networking platform</strong> built by founders, for founders.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
                                <div className="text-center p-4 sm:p-6 bg-mint/25 rounded-xl">
                                    <div className="text-3xl sm:text-4xl font-bold text-ink mb-2">Share</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Blogs, tips & learnings</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-yellow/25 rounded-xl">
                                    <div className="text-3xl sm:text-4xl font-bold text-ink mb-2">Discuss</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Problems & solutions</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-pink/25 rounded-xl">
                                    <div className="text-3xl sm:text-4xl font-bold text-ink mb-2">Connect</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">With fellow founders</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Community Features */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-secondary/20">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            What You Can Do in the Community
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { icon: FileText, title: 'Post Blogs & Articles', desc: 'Share your startup journey, lessons learned, and insights with the community.' },
                                { icon: MessageCircle, title: 'Discussion Forums', desc: 'Start or join conversations on fundraising, growth, product, hiring, and more.' },
                                { icon: Lightbulb, title: 'Ask for Advice', desc: 'Stuck on a problem? Post it and get perspectives from founders who\'ve faced similar challenges.' },
                                { icon: Heart, title: 'Give & Get Support', desc: 'Celebrate wins, commiserate losses, and find emotional support from people who get it.' },
                                { icon: Calendar, title: 'Events & Meetups', desc: 'Discover virtual and in-person founder events, AMAs, and networking sessions.' },
                                { icon: Award, title: 'Showcase Your Startup', desc: 'Share what you\'re building, get feedback, and find early adopters or collaborators.' },
                            ].map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                                        <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
                                        <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground">{feature.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Who It's For */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Who Is the Founder Community For?
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { title: 'First-Time Founders', desc: 'New to startups? Connect with experienced founders and learn from their journeys.' },
                                { title: 'Solo Founders', desc: 'Building alone? Find peer support, accountability partners, and potential co-founders.' },
                                { title: 'Early-Stage Teams', desc: 'Get feedback on ideas, find beta users, and learn from others at your stage.' },
                                { title: 'Scaling Founders', desc: 'Share your scaling challenges and connect with founders who\'ve been through it.' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{item.title}</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Discussion Topics */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-primary/5">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Popular Discussion Topics
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                'Fundraising & Investors',
                                'Product Development',
                                'Growth & Marketing',
                                'Hiring & Team Building',
                                'Founder Mental Health',
                                'Revenue & Monetization',
                                'Pivots & Failures',
                                'Tech & Tools',
                                'Legal & Compliance',
                                'Remote Work',
                                'Industry-Specific',
                                'Founder Life Balance',
                            ].map((topic, idx) => (
                                <div key={idx} className="bg-card rounded-lg p-3 sm:p-4 text-center border border-border hover:border-primary/50 transition-colors">
                                    <span className="text-sm sm:text-base font-medium text-foreground">{topic}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Why Join the Founder Community?
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { icon: Globe, title: 'Global Network', desc: 'Connect with founders worldwide. Different markets, same challenges, shared solutions.' },
                                { icon: TrendingUp, title: 'Accelerate Growth', desc: 'Learn shortcuts from others\' experiences. Avoid common mistakes. Move faster.' },
                                { icon: CheckCircle2, title: 'Peer Accountability', desc: 'Find accountability partners who understand startup life and keep you on track.' },
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

                {/* Community Guidelines Preview */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                                A Community Built on Trust
                            </h2>
                            
                            <div className="space-y-4 text-muted-foreground">
                                <div className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
                                    <p><strong className="text-foreground">Founders Only:</strong> Verified founder profiles to ensure quality conversations.</p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
                                    <p><strong className="text-foreground">No Self-Promotion Spam:</strong> Share value first. Genuine engagement over sales pitches.</p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
                                    <p><strong className="text-foreground">Safe Space:</strong> Be vulnerable about failures. We celebrate learning, not just winning.</p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
                                    <p><strong className="text-foreground">Give Before You Take:</strong> Help others. The community thrives when everyone contributes.</p>
                                </div>
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
                            <Link href="/features/cofounder-matching" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Co-Founder Matching</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Find your perfect co-founder through community connections.</p>
                            </Link>

                            <Link href="/features/ai-virtual-cofounder" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">AI Virtual Co-Founder</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Talk strategy daily with your AI partner.</p>
                            </Link>

                            <Link href="/features/pitch-competitions" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Award className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Competitions</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Compete and get discovered by investors.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-8 sm:p-12 text-primary-foreground shadow-2xl">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
                            Join the Founder Community
                        </h2>
                        <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8">
                            Connect with founders who understand your journey. Share, learn, and grow together.
                        </p>
                        <span className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-primary-foreground/20 text-primary-foreground rounded-lg font-bold text-base sm:text-lg border border-primary-foreground/30 cursor-not-allowed">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                            Join Community (Coming Soon)
                        </span>
                    </div>
                </section>
            </div>
        </>
    );
}
