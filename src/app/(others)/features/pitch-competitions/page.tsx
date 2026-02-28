import type { Metadata } from 'next';
import Link from 'next/link';
import { Trophy, Users, Star, Target, TrendingUp, CheckCircle2, ArrowRight, Award } from 'lucide-react';
import { generateSEOMetadata, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
    title: 'Online Pitch Competition Platform | Virtual Startup Tournaments - PitchDesk',
    description: 'Join startup pitch competitions, virtual demo days, and funding tournaments on PitchDesk. Host pitch competitions, compete on leaderboards, and get discovered by VCs. The complete pitch competition platform.',
    canonical: '/features/pitch-competitions',
    keywords: [
        'online pitch competition platform',
        'virtual demo day hosting',
        'startup pitch competition platform',
        'platform to host startup pitch competition',
        'demo day management software',
    ],
});

export default function PitchCompetitionsPage() {
    const featureSchema = generateSoftwareApplicationSchema({
        name: 'Pitch Competitions',
        description: 'Online platform for startup pitch competitions and virtual demo days',
        url: 'https://pitchdesk.in/features/pitch-competitions',
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'Pitch Competitions', url: '/features/pitch-competitions' },
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
                            <Trophy className="w-4 h-4" />
                            Compete & Get Discovered
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            Join <span className="text-primary">Pitch Competitions</span> & Get Funded
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            Compete in <strong className="text-foreground">online pitch competitions</strong>, virtual demo days, and startup tournaments. Climb leaderboards, win funding, and get discovered by real VCs—all on PitchDesk&apos;s <strong className="text-foreground">startup pitch competition platform</strong>.
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                            <Link
                                href="/incubations"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Trophy className="w-5 h-5" />
                                Browse Competitions
                            </Link>
                            <Link
                                href="/vc"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-border hover:bg-accent transition-all duration-300"
                            >
                                Host a Competition (VCs)
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Is */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                            What Are PitchDesk Competitions?
                        </h2>

                        <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                PitchDesk Competitions are <strong className="text-foreground">virtual startup tournaments</strong> where founders compete by pitching to AI judges. Scores are ranked on public leaderboards, and top performers get discovered by VCs, incubators, and investors watching the platform.
                            </p>

                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                                It&apos;s like a <strong className="text-foreground">virtual demo day</strong> that runs 24/7. Institutions can host their own competitions with custom judging criteria, and founders can compete for funding, prizes, and visibility.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">24/7</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Compete anytime</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">AI-Judged</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Fair & consistent scoring</p>
                                </div>
                                <div className="text-center p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">Real VCs</div>
                                    <p className="text-sm sm:text-base text-muted-foreground">Watching the leaderboard</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* For Founders */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            For Founders: Compete & Get Discovered
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                {
                                    title: 'Join Virtual Pitch Competitions',
                                    description: 'Browse active competitions hosted by VCs, accelerators, and institutions. Find ones that match your industry, stage, or region and submit your pitch.',
                                },
                                {
                                    title: 'Pitch to AI Judges',
                                    description: 'Present your startup to AI judges with custom evaluation criteria set by the competition host. Get scored on market, traction, team, and pitch quality.',
                                },
                                {
                                    title: 'Climb the Leaderboard',
                                    description: 'Your score determines your rank. Top performers appear at the top of the leaderboard where VCs and investors are watching.',
                                },
                                {
                                    title: 'Win Funding & Prizes',
                                    description: 'Many competitions offer cash prizes, funding, mentorship, or accelerator spots for top-ranked startups.',
                                },
                                {
                                    title: 'Get Discovered by VCs',
                                    description: 'High leaderboard scores attract attention. VCs and investors actively browse competitions to find top startups to invest in.',
                                },
                                {
                                    title: 'Gain Exposure',
                                    description: 'Even if you don\'t win, leaderboard visibility helps you get noticed. It\'s like a public demo day for your startup.',
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{item.title}</h3>
                                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* For Institutions */}
                <section className="container mx-auto px-4 py-12 sm:py-16 bg-primary">
                    <div className="max-w-5xl mx-auto text-primary-foreground">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">
                            For VCs & Institutions: Host Competitions
                        </h2>

                        <p className="text-lg sm:text-xl opacity-90 mb-8 sm:mb-12 text-center max-w-3xl mx-auto">
                            Use PitchDesk as your <strong>platform to host startup pitch competition</strong> and <strong>demo day management software</strong>. Run virtual tournaments, discover top startups, and streamline your deal flow.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-primary-foreground/20">
                                <h3 className="text-lg sm:text-xl font-bold mb-3">Launch Virtual Demo Days</h3>
                                <p className="text-primary-foreground/90 text-sm sm:text-base">
                                    Host online demo days where startups pitch to AI judges. No scheduling conflicts—founders can pitch anytime, and you review the best performers.
                                </p>
                            </div>

                            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-primary-foreground/20">
                                <h3 className="text-lg sm:text-xl font-bold mb-3">Custom Judging Criteria</h3>
                                <p className="text-primary-foreground/90 text-sm sm:text-base">
                                    Set your own evaluation criteria. Focus on what matters to your fund: market size, traction, team, tech innovation, or domain expertise.
                                </p>
                            </div>

                            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-primary-foreground/20">
                                <h3 className="text-lg sm:text-xl font-bold mb-3">Automated Screening</h3>
                                <p className="text-primary-foreground/90 text-sm sm:text-base">
                                    AI judges evaluate every pitch consistently. No human bias, no fatigue, just fair, data-driven scoring that filters top startups automatically.
                                </p>
                            </div>

                            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-primary-foreground/20">
                                <h3 className="text-lg sm:text-xl font-bold mb-3">Leaderboard Management</h3>
                                <p className="text-primary-foreground/90 text-sm sm:text-base">
                                    Public leaderboards rank startups by score. You see the best performers at a glance and can invite top-ranked teams to proceed.
                                </p>
                            </div>

                            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-primary-foreground/20">
                                <h3 className="text-lg sm:text-xl font-bold mb-3">Brand Exposure</h3>
                                <p className="text-primary-foreground/90 text-sm sm:text-base">
                                    Hosting competitions builds your brand. Founders across the platform will see your competition, increasing your visibility and deal flow.
                                </p>
                            </div>

                            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-primary-foreground/20">
                                <h3 className="text-lg sm:text-xl font-bold mb-3">Scalable Evaluation</h3>
                                <p className="text-primary-foreground/90 text-sm sm:text-base">
                                    Evaluate 100+ pitches in the time it would take to watch 10 manually. Scale your deal flow without scaling your team.
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-8 sm:mt-10">
                            <Link
                                href="/vc"
                                className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-background text-foreground rounded-lg font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                                Create Your First Competition
                            </Link>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            How Pitch Competitions Work
                        </h2>

                        <div className="space-y-6 sm:space-y-8">
                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">Find a Competition</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        Browse active competitions on PitchDesk. Filter by industry, region, stage, or prize amount to find ones that match your startup.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">Submit Your Pitch</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        Pitch to the competition&apos;s AI judge. The AI uses custom criteria set by the host to evaluate your pitch fairly and consistently.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">Get Ranked on the Leaderboard</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        Your score is posted to the public leaderboard. Top performers appear at the top, where VCs and investors are actively watching.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 sm:gap-6 items-start">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl">
                                    4
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">Get Discovered or Win Prizes</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        Top-ranked teams get noticed by VCs, may win cash prizes or funding, and could get invited to accelerator programs or follow-up meetings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                            Why Compete on PitchDesk?
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <div className="bg-card rounded-xl p-4 sm:p-6 shadow-lg border border-border text-center">
                                <Star className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Visibility</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    Leaderboard rankings give your startup public exposure and attract investor attention.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-4 sm:p-6 shadow-lg border border-border text-center">
                                <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Win Funding</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    Top performers win cash prizes, investment, or fast-track access to accelerators.
                                </p>
                            </div>

                            <div className="bg-card rounded-xl p-4 sm:p-6 shadow-lg border border-border text-center">
                                <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Practice & Improve</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    Competing sharpens your pitch skills. Get better with every competition you enter.
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
                                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">AI Pitch Simulator</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Practice before entering competitions.</p>
                            </Link>

                            <Link href="/features/investment-programs" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Investment Programs</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Apply to VC programs and accelerators.</p>
                            </Link>

                            <Link href="/features/pitch-analysis" className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all">
                                <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pitch Analysis</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">Understand your competition scores.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-8 sm:p-12 text-primary-foreground shadow-2xl">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
                            Ready to Compete?
                        </h2>
                        <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8">
                            Browse active pitch competitions and start climbing the leaderboard.
                        </p>
                        <Link
                            href="/incubations"
                            className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-background text-foreground rounded-lg font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
                            Browse Competitions Now
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
