import React from 'react';
import { Shield, Lock, Eye, Database, FileCheck, Users, Mail, CheckCircle2 } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Data Privacy & Confidentiality
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your Trust, Our Priority
          </p>
        </div>

        {/* Introduction Card */}
        <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8 mb-8">
          <p className="text-lg leading-relaxed text-muted-foreground">
            At PitchDesk, we understand that your startup's information is your most valuable asset. When you share your business ideas, pitch decks, financial data, and strategic plans with our AI-powered platform, you're placing immense trust in us. We take this responsibility seriously and are committed to maintaining the highest standards of data privacy and confidentiality.
          </p>
        </div>

        {/* Commitment Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Lock className="w-7 h-7 text-primary" />
            Our Ironclad Commitment
          </h2>
          
          <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-primary">Complete Confidentiality Guarantee</h3>
            <p className="text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">We solemnly pledge that all information shared on PitchDesk remains strictly confidential.</span> Your startup data, business models, financial projections, market strategies, and any other sensitive information will never be disclosed, shared, sold, or used for any purpose beyond providing you with our AI-powered pitch training and analysis services.
            </p>
          </div>

          <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" />
              What We Protect
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Pitch Content', desc: 'Every word of your pitch, including your unique value propositions and business strategies' },
                { title: 'Financial Data', desc: 'Revenue projections, funding requirements, financial models, and investment terms' },
                { title: 'Business Intelligence', desc: 'Market analysis, competitive advantages, customer insights, and growth strategies' },
                { title: 'Personal Information', desc: 'Founder details, contact information, and professional backgrounds' },
                { title: 'Proprietary Technology', desc: 'Technical specifications, intellectual property details, and innovation concepts' },
                { title: 'Partnership Information', desc: 'Investor relationships, strategic partnerships, and business negotiations' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 p-3 rounded-md bg-muted/50">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Protection Framework */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Database className="w-7 h-7 text-primary" />
            Our Data Protection Framework
          </h2>

          <div className="space-y-6">
            <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">Zero-Disclosure Policy</h3>
              <ul className="space-y-3">
                {[
                  { title: 'No Third-Party Sharing', desc: 'We will never share your information with investors, competitors, partners, or any external parties without your explicit written consent' },
                  { title: 'No Data Mining', desc: 'Your information is not used to train our AI models for other users or create industry reports' },
                  { title: 'No Cross-Contamination', desc: 'Data from one startup is completely isolated from others; your information remains uniquely yours' },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground">{item.title}:</span>
                      <span className="text-muted-foreground"> {item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">Advanced Security Infrastructure</h3>
              <ul className="space-y-3">
                {[
                  { title: 'Secure Cloud Architecture', desc: 'Our platform runs on secure, compliant cloud infrastructure with multiple layers of protection' },
                  { title: 'Access Controls', desc: 'Only authorized personnel with legitimate business needs can access your data, and all access is logged and monitored' },
                  { title: 'Regular Security Audits', desc: 'We conduct comprehensive security assessments to ensure our protection measures remain robust' },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground">{item.title}:</span>
                      <span className="text-muted-foreground"> {item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">Data Minimization & Purpose Limitation</h3>
              <ul className="space-y-3">
                {[
                  { title: 'Only Essential Data', desc: 'We collect only the information necessary to provide our AI pitch training and analysis services' },
                  { title: 'Purpose-Bound Usage', desc: 'Your data is used exclusively for delivering the services you\'ve subscribed to' },
                  { title: 'No Secondary Use', desc: 'We don\'t repurpose your data for marketing, research, or any other activities' },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground">{item.title}:</span>
                      <span className="text-muted-foreground"> {item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Your Rights Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Users className="w-7 h-7 text-primary" />
            Your Rights & Control
          </h2>

          <div className="space-y-6">
            <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">Complete Data Ownership</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'You Own Your Data', desc: 'All information you share remains your intellectual property' },
                  { title: 'Access Rights', desc: 'You can request access to all data we hold about your startup at any time' },
                  { title: 'Correction Rights', desc: 'You can update or correct any information in your account' },
                  { title: 'Deletion Rights', desc: 'You can request complete deletion of your data, and we will permanently remove it from our systems' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 p-3 rounded-md bg-muted/50">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">Transparency & Communication</h3>
              <ul className="space-y-3">
                {[
                  { title: 'Clear Policies', desc: 'Our privacy practices are documented in clear, understandable language' },
                  { title: 'Regular Updates', desc: 'We\'ll notify you of any changes to our privacy policies or data handling practices' },
                  { title: 'Direct Communication', desc: 'Our privacy team is available to address any concerns or questions you may have' },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground">{item.title}:</span>
                      <span className="text-muted-foreground"> {item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Eye className="w-7 h-7 text-primary" />
            Industry Compliance & Standards
          </h2>

          <div className="space-y-6">
            <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">Regulatory Compliance</h3>
              <ul className="space-y-3">
                {[
                  { title: 'Data Protection Laws', desc: 'We comply with applicable data protection regulations including GDPR, CCPA, and Indian data protection laws' },
                  { title: 'Industry Standards', desc: 'Our practices align with international standards for data security and privacy' },
                  { title: 'Regular Compliance Reviews', desc: 'We continuously monitor and update our practices to meet evolving regulatory requirements' },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground">{item.title}:</span>
                      <span className="text-muted-foreground"> {item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">Professional Ethics</h3>
              <ul className="space-y-3">
                {[
                  { title: 'Confidentiality by Design', desc: 'Privacy and confidentiality are built into every aspect of our platform and operations' },
                  { title: 'Ethical AI Practices', desc: 'Our AI systems are designed to respect user privacy and maintain data confidentiality' },
                  { title: 'Professional Integrity', desc: 'Our team adheres to strict professional standards and confidentiality agreements' },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground">{item.title}:</span>
                      <span className="text-muted-foreground"> {item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3">Contact Our Privacy Team</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about our privacy practices or need clarification about how we protect your data, please reach out to our dedicated privacy team:
                </p>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold">Email:</span>
                    <a href="mailto:info@pitchdesk.in" className="text-primary hover:underline">
                      info@pitchdesk.in
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold">Response Time:</span>
                    <span className="text-muted-foreground">Within 24 hours for all privacy-related inquiries</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final Promise */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20 p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Our Promise to You</h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              <span className="font-semibold text-foreground">At PitchDesk, your success is our mission, and your privacy is our foundation.</span> We're not just building AI tools for pitch training - we're creating a trusted ecosystem where founders can safely refine their strategies, practice their presentations, and prepare for funding rounds without compromising their competitive advantage.
            </p>
            <p className="text-muted-foreground mb-4">
              Your confidential information stays confidential. Your strategic plans remain strategic. Your success story is yours to tell, when you're ready to tell it.
            </p>
            <p className="text-lg font-semibold text-primary">
              Trust PitchDesk. Focus on your pitch. We'll handle the privacy.
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground border-t pt-6">
          <p>
            This privacy commitment is effective as of October 29, 2025, and reflects our ongoing dedication to protecting founder privacy and maintaining startup confidentiality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
