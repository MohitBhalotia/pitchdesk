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

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-16 md:py-20">
                    <div className="max-w-4xl mx-auto">
                        <Link
                            href="/features"
                            className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 font-medium"
                        >
                            ← Back to Features
                        </Link>

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                            <Trophy className="w-4 h-4" />
                            Compete & Get Discovered
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Pitch Competitions</span> & Get Funded
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                            Compete in <strong>online pitch competitions</strong>, virtual demo days, and startup tournaments. Climb leaderboards, win funding, and get discovered by real VCs—all on PitchDesk&apos;s <strong>startup pitch competition platform</strong>.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/incubations"
                                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
                            >
                                <Trophy className="w-5 h-5" />
                                Browse Competitions
                            </Link>
                            <Link
                                href="/vc"
                                className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-200 hover:border-green-600 hover:text-green-600 transition-all duration-300"
                            >
                                Host a Competition (VCs)
                            </Link>
                        </div>
                    </div>
                </section>

                {/* What It Is */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            What Are PitchDesk Competitions?
                        </h2>

                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100">
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                PitchDesk Competitions are <strong>virtual startup tournaments</strong> where founders compete by pitching to AI judges. Scores are ranked on public leaderboards, and top performers get discovered by VCs, incubators, and investors watching the platform.
                            </p>

                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                It&apos;s like a <strong>virtual demo day</strong> that runs 24/7. Institutions can host their own competitions with custom judging criteria, and founders can compete for funding, prizes, and visibility.
                            </p>

                            <div className="grid md:grid-cols-3 gap-6 mt-8">
                                <div className="text-center p-6 bg-green-50 rounded-xl">
                                    <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
                                    <p className="text-gray-700">Compete anytime</p>
                                </div>
                                <div className="text-center p-6 bg-emerald-50 rounded-xl">
                                    <div className="text-4xl font-bold text-emerald-600 mb-2">AI-Judged</div>
                                    <p className="text-gray-700">Fair & consistent scoring</p>
                                </div>
                                <div className="text-center p-6 bg-green-50 rounded-xl">
                                    <div className="text-4xl font-bold text-green-600 mb-2">Real VCs</div>
                                    <p className="text-gray-700">Watching the leaderboard</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* For Founders */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                            For Founders: Compete & Get Discovered
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
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
                                <div key={idx} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                            <p className="text-gray-600 leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* For Institutions */}
                <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-green-600 to-emerald-600">
                    <div className="max-w-5xl mx-auto text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                            For VCs & Institutions: Host Competitions
                        </h2>

                        <p className="text-xl text-green-100 mb-12 text-center max-w-3xl mx-auto">
                            Use PitchDesk as your <strong>platform to host startup pitch competition</strong> and <strong>demo day management software</strong>. Run virtual tournaments, discover top startups, and streamline your deal flow.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-3">Launch Virtual Demo Days</h3>
                                <p className="text-green-50">
                                    Host online demo days where startups pitch to AI judges. No scheduling conflicts—founders can pitch anytime, and you review the best performers.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-3">Custom Judging Criteria</h3>
                                <p className="text-green-50">
                                    Set your own evaluation criteria. Focus on what matters to your fund: market size, traction, team, tech innovation, or domain expertise.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-3">Automated Screening</h3>
                                <p className="text-green-50">
                                    AI judges evaluate every pitch consistently. No human bias, no fatigue, just fair, data-driven scoring that filters top startups automatically.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-3">Leaderboard Management</h3>
                                <p className="text-green-50">
                                    Public leaderboards rank startups by score. You see the best performers at a glance and can invite top-ranked teams to proceed.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-3">Brand Exposure</h3>
                                <p className="text-green-50">
                                    Hosting competitions builds your brand. Founders across the platform will see your competition, increasing your visibility and deal flow.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-3">Scalable Evaluation</h3>
                                <p className="text-green-50">
                                    Evaluate 100+ pitches in the time it would take to watch 10 manually. Scale your deal flow without scaling your team.
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-10">
                            <Link
                                href="/vc"
                                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-green-600 rounded-lg font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                <Award className="w-6 h-6" />
                                Create Your First Competition
                            </Link>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                            How Pitch Competitions Work
                        </h2>

                        <div className="space-y-8">
                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Find a Competition</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Browse active competitions on PitchDesk. Filter by industry, region, stage, or prize amount to find ones that match your startup.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Submit Your Pitch</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Pitch to the competition&apos;s AI judge. The AI uses custom criteria set by the host to evaluate your pitch fairly and consistently.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Ranked on the Leaderboard</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Your score is posted to the public leaderboard. Top performers appear at the top, where VCs and investors are actively watching.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                                    4
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Discovered or Win Prizes</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Top-ranked teams get noticed by VCs, may win cash prizes or funding, and could get invited to accelerator programs or follow-up meetings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                            Why Compete on PitchDesk?
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Visibility</h3>
                                <p className="text-gray-600">
                                    Leaderboard rankings give your startup public exposure and attract investor attention.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                                <Trophy className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Win Funding</h3>
                                <p className="text-gray-600">
                                    Top performers win cash prizes, investment, or fast-track access to accelerators.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Practice & Improve</h3>
                                <p className="text-gray-600">
                                    Competing sharpens your pitch skills. Get better with every competition you enter.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Features */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Related Features
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            <Link href="/features/ai-pitch-simulator" className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Target className="w-10 h-10 text-blue-600 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Pitch Simulator</h3>
                                <p className="text-gray-600 text-sm">Practice before entering competitions.</p>
                            </Link>

                            <Link href="/features/investment-programs" className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Users className="w-10 h-10 text-purple-600 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Investment Programs</h3>
                                <p className="text-gray-600 text-sm">Apply to VC programs and accelerators.</p>
                            </Link>

                            <Link href="/features/pitch-analysis" className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                                <TrendingUp className="w-10 h-10 text-green-600 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Pitch Analysis</h3>
                                <p className="text-gray-600 text-sm">Understand your competition scores.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-16 pb-24">
                    <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-12 text-white shadow-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Ready to Compete?
                        </h2>
                        <p className="text-xl text-green-100 mb-8">
                            Browse active pitch competitions and start climbing the leaderboard.
                        </p>
                        <Link
                            href="/incubations"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-green-600 rounded-lg font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            <Trophy className="w-6 h-6" />
                            Browse Competitions Now
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
