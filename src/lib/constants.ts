"use client";
import axios from "axios";

export const getAgentConfig = async (agentId: string) => {
  if (!agentId) {
    throw new Error("Agent ID is required");
  }
  const result = await axios.get(`/api/agents?agentId=${agentId}`);
  const agent = result.data.agent;
  return agent;
};

const sample_pitches = `Template 1: Healthcare Tech Pitch (Standard Structure)
Company Overview: [Company Name] develops AI-powered telemedicine solutions connecting rural patients with specialist physicians through virtual reality consultations.

Problem Statement: Rural patients face critical healthcare access barriers, waiting 3+ months for specialist consultations and traveling 200+ miles on average, resulting in delayed care and 23% worse health outcomes compared to urban populations.

Solution Description: Our platform combines diagnostic-quality VR technology with AI-powered patient matching algorithms, enabling real-time specialist consultations from local clinics. The system integrates with existing EMR systems and provides 95% diagnostic accuracy compared to in-person visits.

Market Analysis: The global telemedicine market represents a $350 billion opportunity growing at 23% annually. Our addressable market includes 62 million rural Americans and 2.5 million annual specialist consultation delays.

Business Model: SaaS subscription model charging healthcare providers $500/month per clinic plus $50 per consultation fee. Revenue streams include software licensing, hardware leasing, and data analytics services.

Financial Projections: Year 1: $2M ARR, Year 3: $25M ARR, Year 5: $150M ARR. Unit economics show $200 customer acquisition cost with $8,000 lifetime value and 18-month payback period.

Competitive Advantage: Proprietary VR diagnostic technology with FDA approval, exclusive partnerships with 500+ specialists, and 95% patient satisfaction rates creating strong network effects.

Team Qualifications: Founding team includes former Mayo Clinic telemedicine director, Google VR engineering lead, and healthcare policy expert with combined 45 years experience.

Funding Request: Seeking $5 million Series A for 15% equity to expand to 10 new states, hire 50 engineers, achieve full FDA compliance, and scale to 100,000 patient consultations annually.

Use of Funds: 40% engineering development, 30% market expansion, 20% regulatory compliance, 10% working capital.
Template 2: Education Technology Pitch (Metrics-Heavy Format)
Business Description: [Company Name] operates a VR-based skills training platform reducing traditional learning time by 75% while improving retention rates by 300% across manufacturing, healthcare, and technology sectors.

Market Opportunity: $350 billion global education technology market with corporate training segment growing 13% annually. Target market includes 6 million unfilled skilled jobs and 15,000 Fortune 500 companies requiring workforce retraining.

Product Specification: Immersive VR training modules covering 47 high-demand skills including welding, medical procedures, and software development. Platform supports 50+ VR headset types and integrates with major LMS systems.

Revenue Model: B2B enterprise licensing at $10,000 per company annually plus $200 per learner per course. Additional revenue from content creation services and certification programs.

Traction Metrics: 50 Fortune 500 clients, 100,000+ trained learners, $12 million ARR, 89% course completion rate, 140% net revenue retention, 6-month average sales cycle.

Financial Performance: Gross margin 85%, customer acquisition cost $5,000, lifetime value $75,000, monthly recurring revenue growth 25%, burn rate $800,000 monthly with 18 months runway.

Growth Strategy: Geographic expansion to 15 countries, content library expansion to 100 skills, enterprise sales team scaling from 10 to 50 representatives, strategic partnerships with training providers.

Risk Assessment: Competition from established players, technology adoption challenges, content development costs, regulatory changes in education standards.

Investment Terms: $25 million Series B for 18% equity with 24-month use of funds timeline, quarterly board reporting, and standard liquidation preferences.

Execution Timeline: Q1-Q2: International expansion, Q3-Q4: Product development, Year 2: Market leadership achievement, Year 3: Potential acquisition or IPO preparation.
Template 3: Fintech Startup Pitch (Problem-Solution Focus)
Core Mission: [Company Name] eliminates small business cash flow problems through AI-powered invoice factoring and real-time working capital optimization.

Industry Problem: Small businesses wait average 60 days for invoice payments while managing operational expenses, creating $3.2 trillion global working capital gap affecting 30 million US businesses.

Technology Solution: Machine learning platform analyzes invoice payment patterns, customer creditworthiness, and business cash flow to provide instant funding decisions within 5 minutes with 97% accuracy.

Customer Validation: 10,000 active business customers, $100 million funding volume processed, average 15% revenue growth for client businesses, 4.8/5 customer satisfaction score.

Economic Model: Revenue from 2-5% factoring fees, monthly SaaS subscriptions at $99-$499, premium analytics services, and partnership commissions with banks and lenders.

Regulatory Compliance: Licensed in 47 states, SOC 2 Type II certified, GDPR compliant, banking partnerships with FDIC-insured institutions, comprehensive fraud prevention systems.

Competitive Positioning: 10x faster approval process than traditional factors, 40% lower fees than competitors, integrated business intelligence features, and white-label partnership opportunities.

Technical Infrastructure: Cloud-native architecture processing 1 million transactions daily, 99.9% uptime, advanced encryption, API integrations with 200+ accounting systems.

Capital Requirements: $15 million Series A comprising $10 million for lending capital and $5 million for operations, marketing, and team expansion over 18-month period.

Strategic Partnerships: Existing relationships with QuickBooks, American Express, and regional banks providing customer acquisition channels and credibility validation.
Template 4: Clean Technology Pitch (Data-Driven Approach)
Technology Overview: [Company Name] manufactures hydrogen-based steel production systems reducing CO2 emissions by 90% while decreasing production costs by 20% compared to traditional blast furnace methods.

Environmental Impact: Steel industry generates 7% of global CO2 emissions totaling 2.6 billion tons annually. Our technology eliminates 2.3 billion tons CO2 while meeting growing steel demand.

Market Dynamics: Global steel market worth $2.5 trillion with environmental regulations driving $500 billion transition to clean production methods by 2030 across major manufacturing regions.

Production Capabilities: Current pilot facilities produce 50,000 tons annually with plans for 2 million ton capacity by 2027. Technology validated through 18-month operational testing and third-party certification.

Customer Pipeline: Signed MOUs with 5 major steel producers, $100 million pre-orders from automotive and construction industries, partnership discussions with 15 additional manufacturers.

Intellectual Property: 23 patents filed, 8 granted, proprietary catalyst technology, exclusive licensing agreements, and trade secret protection for critical manufacturing processes.

Financial Projections: Equipment sales revenue model generating $50 million by year 3, licensing fees of $5 per ton produced, carbon credit monetization worth $30 per ton.

Capital Allocation: $100 million Series C for 30% equity allocated to: manufacturing scale-up (60%), R&D expansion (25%), market development (15%).

ESG Credentials: B-Corp certification, carbon negative operations, partnership with environmental organizations, compliance with EU taxonomy and UN Sustainable Development Goals.

Exit Strategy: Strategic acquisition by industrial conglomerate, technology licensing to global players, or public offering targeting $5 billion valuation within 5-7 years.
Template 5: AI/ML Platform Pitch (Technical Specification Format)
Platform Architecture: [Company Name] provides enterprise-grade machine learning infrastructure enabling non-technical users to build, deploy, and manage AI models with 90% faster time-to-production.

Technical Specifications: Cloud-agnostic platform supporting TensorFlow, PyTorch, scikit-learn with automated model optimization, real-time inference APIs, and comprehensive MLOps pipeline management.

Customer Base: 200 enterprise clients including 15 Fortune 100 companies across financial services, healthcare, and retail generating $20 million ARR with 140% net revenue retention.

Product Capabilities: Automated data preprocessing, model selection algorithms, hyperparameter optimization, A/B testing framework, compliance monitoring, and explainable AI features.

Pricing Structure: Tiered SaaS model from $10,000 annually for startups to $500,000 for enterprise with usage-based compute charges and professional services options.

Market Position: Competing against AWS SageMaker, Google Vertex AI, and Microsoft Azure ML with differentiation through ease of use, faster deployment, and superior customer support.

Technology Moat: Proprietary automated machine learning algorithms, 50+ pre-trained industry models, advanced security features, and extensive API ecosystem with 100+ integrations.

Operational Metrics: 99.9% platform uptime, sub-10ms inference latency, 85% model accuracy improvement, 70% reduction in data science resource requirements for clients.

Growth Trajectory: 300% year-over-year revenue growth, expanding from 50 to 200 person team, opening European and Asian operations, adding industry-specific solutions.

Investment Opportunity: $40 million Series B for 25% equity to accelerate international expansion, develop quantum-resistant encryption, pursue strategic acquisitions, and achieve market leadership position.
Key System Prompt Optimization Features
These templates incorporate specific design elements optimized for AI model training178:

Structured Format: Each template follows consistent formatting with clear section headers and standardized information hierarchy9.

Quantified Metrics: All financial data, market sizes, and performance indicators use specific numbers rather than vague descriptions23.

Concise Length: Templates average 200-300 words each, suitable for system prompt character limits while maintaining comprehensive coverage1.

Directive Clarity: Each section provides clear, actionable information without ambiguous language or creative storytelling elements8.

Contextual Information: Templates include relevant market data, competitive positioning, and technical specifications that AI models can reference109.

Scalable Structure: Format can be easily modified for different industries, funding stages, or investor types while maintaining core effectiveness38.


Technology: DataVault - AI-Powered Cybersecurity
The Hook: "Last year, data breaches cost companies an average of $4.5 million each. Here's the shocking part: 95% were preventable human errors. We stop them before they happen31."

The Problem: Despite billions invested in cybersecurity, data breaches continue devastating companies, with 95% caused by human error rather than sophisticated attacks3233.

The Solution: DataVault's zero-trust security platform uses behavioral AI to predict and prevent breaches by analyzing user patterns and stopping anomalous behavior in real-time34.

Market Opportunity: The cybersecurity market is worth $150 billion and growing 12% annually as cyber threats evolve and regulations tighten35.

Traction: We protect 50 enterprise clients including 3 Fortune 100 companies, generating $20 million ARR with 140% net revenue retention36.

Business Model: Enterprise SaaS with annual contracts, creating predictable recurring revenue with high switching costs37.

The Ask: We're raising $40 million for 25% equity to expand internationally, develop quantum-resistant encryption, and pursue strategic acquisitions38.

Personal Story: "I'm Colonel James Mitchell, former NSA cybersecurity expert. I watched helplessly as my friend's company was destroyed by a breach that our technology could have prevented. That's when I knew I had to act39."
Manufacturing: GreenSteel - Clean Steel Production
The Hook: "Steel production creates 7% of global CO2 emissions. The industry pays $50 billion annually in carbon credits. We've solved both problems while making steel 20% cheaper."

The Problem: Traditional steel production is environmentally devastating, creating 7% of global CO2 emissions and costing the industry $50 billion annually in carbon credits and compliance.

The Solution: GreenSteel's revolutionary hydrogen-based production process creates steel that's 90% cleaner than traditional methods while being 20% cheaper to produce.

Market Opportunity: The global steel market is worth $2.5 trillion and rapidly transitioning to green alternatives due to environmental regulations and economic incentives.

Traction: We have 2 pilot plants operational, 5 major steel companies with signed MOUs, and $100 million in pre-orders from automotive and construction clients.

Business Model: Technology licensing, equipment sales, and carbon credit revenue sharing, creating multiple high-margin revenue streams.

The Ask: We're seeking $100 million for 30% equity to build 10 commercial plants, expand our R&D team, and scale manufacturing capabilities.

Personal Story: "I'm Dr. Maria Santos, MIT materials scientist whose hometown in Pennsylvania was devastated by steel plant pollution. I watched my community suffer while knowing there had to be a better way. Now there is."
`;

const sample_questions = `Valuation & Investment Structure
1	How did you arrive at this company valuation?
2	What was your valuation in previous funding rounds?
3	Why are you seeking this specific amount of investment?
4	How will you utilize the requested funds?
5	Why are you raising money now instead of using existing cash reserves?
6	Why are you raising this amount through this channel instead of a larger round with existing investors?
Financial Performance & Metrics
7	What is your current monthly/annual revenue run rate?
8	What are your gross sales versus net revenue?
9	What is your current profitability and cash flow situation?
10	How much cash do you currently have in the bank?
11	What were your total sales last year and year-to-date performance?
12	Can you break down your sales figures by time period/product line?
Unit Economics & Cost Structure
13	Walk us through your detailed unit economics - selling price, cost of goods sold, marketing spend, and contribution margin
14	What inventory levels are you currently holding?
15	How much capital have you burned to date, and what was it spent on?
16	What are your customer acquisition costs and lifetime value?
Market Position & Competition
17	What makes your product/service better than existing competitors?
18	Why should customers choose you over established market leaders?
19	What is your unique value proposition and competitive differentiation?
20	How do you position yourself in the market compared to alternatives?
21	What happens if larger competitors copy your approach?
22	Is your competitive advantage sustainable long-term or short-term?
Business Model & Operations
23	How do you monetize sustainably?
24	What is your fulfillment rate and cancellation/return rate?
25	What is the price range of your products/services?
26	Why would customers buy from you instead of going directly to other channels?
27	How will you scale faster than industry growth rates?
28	If you're running multiple business models, how will you manage both effectively with your current resources?
Market Opportunity & Growth
29	What is your target market size and growth potential?
30	How does your business model scale with market growth?
31	What are your expansion plans and growth strategy?
32	How do you plan to capture market share from incumbents?
Team & Execution
33	When did you actually start this business?
34	What is your background and expertise in this domain?
35	How is your team structured to execute on multiple priorities?
36	What are your key operational challenges and how are you addressing them?
Risk Assessment
37	What are the biggest risks to your business model?
38	How dependent are you on external factors or partnerships?
39	What would cause your business to fail?
40	How do you plan to mitigate competitive threats?`;

export const stsConfig = async (agentId: string) => {
  const agent = await getAgentConfig(agentId);

  return {
    type: "Settings" as const,
    audio: {
      input: {
        encoding: "linear16",
        sample_rate: 16000,
      },
      output: {
        encoding: "linear16",
        sample_rate: 24000,
        container: "none",
      },
    },
    agent: {
      listen: { provider: { type: "deepgram" as const, model: "nova-3" } },
      speak: { provider: { type: "deepgram" as const, model: agent.voice as string } },
      think: {
        provider: { type: "open_ai" as const, model: "gpt-4o" },
        prompt: `You are a seasoned Venture Capitalist (VC) with expertise in evaluating startup pitches.
Your personality: ${agent.name}
${agent.systemPrompt}

Your job is to:
1. Carefully analyze the founder's pitch.
2. Ask insightful, high-quality questions one at a time.
3. Wait for the founder's answer before asking the next question.
4. End the session when you're satisfied or the founder types "exit".
5. Don't ask very long questions. Ask one question at a time only — strictly.
6. After the Q&A ends, evaluate the pitch and answers:
   - Give a score out of 10.
   - List 2-3 strengths.
   - List 2-3 areas for improvement.
   - Conclude with a final verdict: Invest / Needs Work / Pass.

Be thoughtful, critical, and constructive. Ask follow-ups if needed.

Below are examples of good questions you may be inspired by:
-----
${sample_questions}
-----

And here are some example founder pitches to guide your expectations:
-----
${sample_pitches}
-----

Now, begin the session.`,
      },
      greeting:agent.firstMessage as string,
    },
  };
};

// // Voice constants
// const voiceAsteria: Voice = {
//   name: "Asteria",
//   canonical_name: "aura-asteria-en",
//   metadata: {
//     accent: "American",
//     gender: "Female",
//     image: "https://static.deepgram.com/examples/avatars/asteria.jpg",
//     color: "#7800ED",
//     sample: "https://static.deepgram.com/examples/voices/asteria.wav",
//   },
// };

// const voiceOrion: Voice = {
//   name: "Orion",
//   canonical_name: "aura-orion-en",
//   metadata: {
//     accent: "American",
//     gender: "Male",
//     image: "https://static.deepgram.com/examples/avatars/orion.jpg",
//     color: "#83C4FB",
//     sample: "https://static.deepgram.com/examples/voices/orion.mp3",
//   },
// };

// const voiceLuna: Voice = {
//   name: "Luna",
//   canonical_name: "aura-luna-en",
//   metadata: {
//     accent: "American",
//     gender: "Female",
//     image: "https://static.deepgram.com/examples/avatars/luna.jpg",
//     color: "#949498",
//     sample: "https://static.deepgram.com/examples/voices/luna.wav",
//   },
// };

// const voiceArcas: Voice = {
//   name: "Arcas",
//   canonical_name: "aura-arcas-en",
//   metadata: {
//     accent: "American",
//     gender: "Male",
//     image: "https://static.deepgram.com/examples/avatars/arcas.jpg",
//     color: "#DD0070",
//     sample: "https://static.deepgram.com/examples/voices/arcas.mp3",
//   },
// };

// type NonEmptyArray<T> = [T, ...T[]];
// export const availableVoices: NonEmptyArray<Voice> = [
//   voiceAsteria,
//   voiceOrion,
//   voiceLuna,
//   voiceArcas,
// ];
// export const defaultVoice: Voice = availableVoices[0];

export const sharedOpenGraphMetadata = {
  title: "Pitch Desk",
  type: "website",
  url: "/",
  description: "Pitch Desk",
};

export const latencyMeasurementQueryParam = "latency-measurement";
