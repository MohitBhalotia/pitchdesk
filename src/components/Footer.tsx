"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Twitter, Linkedin, Github, Mail, Instagram } from 'lucide-react';

export default function Footer() {
    const { theme } = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-950 dark:bg-slate-950 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full">
                                <Image
                                    src="/logo.png"
                                    alt="PitchDesk Logo"
                                    width={40}
                                    height={40}
                                    className="invert rounded-full"
                                />
                            </div>
                            <span className="text-2xl font-bold">PitchDesk</span>
                        </Link>
                        <p className="text-slate-400 mb-4 max-w-sm">
                            AI-powered pitch practice platform for startup founders and VCs. Practice your pitch, get discovered by investors, and accelerate your fundraising journey.
                        </p>
                        <div className="flex gap-4">
                            {/* <a href="https://twitter.com/pitchdesk" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
                                <Twitter className="w-5 h-5" />
                            </a> */}
                            <a href="https://linkedin.com/company/pitch-desk" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="https://www.instagram.com/pitchdesk.in/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
                                <Instagram className="w-5 h-5" />
                            </a>
                            {/* <a href="https://github.com/pitchdesk" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
                                <Github className="w-5 h-5" />
                            </a> */}
                            <a href="mailto:info@pitchdesk.in" className="text-slate-400 hover:text-white transition">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* For Founders */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">For Founders</h3>
                        <ul className="space-y-2 text-slate-400">
                            <li>
                                <Link href="/features/ai-pitch-simulator" className="hover:text-white transition">
                                    AI Pitch Simulator
                                </Link>
                            </li>
                            <li>
                                <Link href="/features/pitch-script-generator" className="hover:text-white transition">
                                    Script Generator
                                </Link>
                            </li>
                            <li>
                                <Link href="/features/real-time-feedback" className="hover:text-white transition">
                                    Voice Feedback
                                </Link>
                            </li>
                            <li>
                                <Link href="/features/pitch-analysis" className="hover:text-white transition">
                                    Pitch Analysis
                                </Link>
                            </li>
                            <li>
                                <Link href="/features/pitch-competitions" className="hover:text-white transition">
                                    Pitch Competitions
                                </Link>
                            </li>
                            <li>
                                <Link href="/start-a-pitch" className="hover:text-white transition">
                                    Start Pitching
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For VCs & Institutions */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">For VCs</h3>
                        <ul className="space-y-2 text-slate-400">
                            <li>
                                <Link href="/features/ai-vc-agents" className="hover:text-white transition">
                                    AI VC Agents
                                </Link>
                            </li>
                            <li>
                                <Link href="/features/vc-deal-flow" className="hover:text-white transition">
                                    Deal Flow Automation
                                </Link>
                            </li>
                            <li>
                                <Link href="/features/investment-programs" className="hover:text-white transition">
                                    Investment Programs
                                </Link>
                            </li>
                            <li>
                                <Link href="/features/pitch-competitions" className="hover:text-white transition">
                                    Host Competitions
                                </Link>
                            </li>
                            <li>
                                <Link href="/vc" className="hover:text-white transition">
                                    VC Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/incubations" className="hover:text-white transition">
                                    Incubations
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Company</h3>
                        <ul className="space-y-2 text-slate-400">
                            <li>
                                <Link href="/about" className="hover:text-white transition">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/features" className="hover:text-white transition">
                                    All Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/payment" className="hover:text-white transition">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/competitions" className="hover:text-white transition">
                                    Competitions
                                </Link>
                            </li>
                            <li>
                                <Link href="/advisors" className="hover:text-white transition">
                                    Advisors
                                </Link>
                            </li>
                            <li>
                                <Link href="/support" className="hover:text-white transition">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm">
                        © {currentYear} PitchDesk. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-slate-400">
                        <Link href="/privacy" className="hover:text-white transition">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-white transition">
                            Terms of Service
                        </Link>
                        <Link href="/sitemap.xml" className="hover:text-white transition">
                            Sitemap
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
