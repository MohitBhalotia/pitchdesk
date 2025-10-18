"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Users,
  Rocket,
  Target,
  Mail,
  Sparkles,
  TrendingUp,
  DollarSign,
  Globe,
  Heart
} from "lucide-react";
import Link from "next/link";

export default function CrowdfundingPage() {
  const [email, setEmail] = useState("");
  // const [isSubscribed, setIsSubscribed] = useState(false);

  // const handleSubscribe = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (email) {
  //     console.log("Subscribed email:", email);
  //     setIsSubscribed(true);
  //     setEmail("");
  //   }
  // };

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Powered",
      description: "Leverage collective funding from investors who believe in your vision"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal-Oriented Funding",
      description: "Set clear funding targets and milestones to build investor confidence"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Equity & Rewards",
      description: "Offer equity, rewards, or both to attract different types of backers"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Reach",
      description: "Access investors from around the world with our platform"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Transparent Process",
      description: "Real-time tracking of funding progress with complete transparency"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Investor Engagement",
      description: "Build lasting relationships with your backers through updates"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 py-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full  ">

              <Image
                src="/logo.png"
                alt="PitchDesk Logo"
                width={40}
                height={40}
                className="dark:invert rounded-full"
              />

            </div>
            <span className=" text-xl font-bold ">
              PitchDesk
            </span>
          </Link>
          {/* <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-sm sm:text-base"
          >
            Back to Home
          </Link> */}
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <motion.section
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-3 bg-primary/20 border border-primary/30 px-6 py-3 rounded-full mb-8">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold text-primary">COMING SOON</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            CrowdFunding
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Revolutionizing startup funding through community-powered investment.
            Connect with investors ready to back your vision.
          </p>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Why Choose Our CrowdFunding Platform?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We're creating the most startup-friendly funding platform with features designed for your success.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Newsletter Section */}
        {/* <motion.section 
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-card rounded-xl p-6 sm:p-8 border border-border">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                Get Notified at Launch
              </h2>
              <p className="text-muted-foreground text-sm">
                Be the first to know when we launch and get exclusive early access.
              </p>
            </div>

            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Notify Me
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">You're on the list!</h3>
                <p className="text-muted-foreground text-sm">
                  We'll notify you as soon as we launch.
                </p>
              </motion.div>
            )}
          </div>
        </motion.section> */}
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 sm:px-6 py-8 text-center text-muted-foreground border-t border-border mt-12">
        <p className="text-sm">© 2025 PitchDesk. All rights reserved.</p>
      </footer>
    </div>
  );
}