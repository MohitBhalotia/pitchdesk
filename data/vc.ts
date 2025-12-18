export interface VC {
  id: string;
  name: string;
  title: string;
  tagline: string;
  shortDescription: string;
  highlights: string[];
  image: string;
  agentLink: string;
  tags?: string[];
}

export const vcs: VC[] = [
  {
    id: "sanjay-khanna",
    name: "Sanjay Khanna",
    title: "The Big daddy of all VCs",
    tagline: "He doesn’t believe pitches — he believes pressure.If your startup has a weak spot, Sanjay will find it.",
    shortDescription:
      "Sanjay Khanna is a relentless, high-intensity investor who specializes in exposing the real pain points behind ambitious ideas. He doesn’t let founders hide behind buzzwords, slides, or optimistic projections. Every answer you give invites another question — deeper, sharper, and harder to dodge.",
    highlights: [
      "Obsessively hunts for the core pain point your startup claims to solve",
      "Challenges assumptions, not just answers",
      "Pushes founders until clarity replaces confidence",
      "Uncomfortable silence is part of his strategy",
      "Believes real businesses are forged under scrutiny, not praise",
      "Measures resilience, logic, and honesty over charm"
    ],
    image: "https://res.cloudinary.com/mohitbhalotia/image/upload/v1765818140/WhatsApp_Image_2025-12-14_at_4.28.04_PM_dhtfej.jpg",
    agentLink: "69403f71c00caa45dfa94b6e",
    tags: ["Grilling Agent"],
  },
  {
    id: "rohan-oberoi",
    name: "Rohan Oberoi",
    title: "The Tech-Savvy Disruptor",
    tagline: "He’s not just looking for a good pitch — he wants proof that your business can grow and win.",
    shortDescription:
      "Rohan Oberoi is a sharp, logical investor who thrives on data, disruption, and execution. Known for his direct style and quick decisions, he supports founders who are deeply informed and ready to scale.",
    highlights: [
      "Believes in data-driven, scalable business models",
      "Demands founders who know their numbers inside-out",
      "Rejects hype — focuses on traction and real results",
      "Known for asking tough, analytical questions",
      "Offers more than capital — brings strategic value and vision"
    ],
    image: "https://res.cloudinary.com/mohitbhalotia/image/upload/v1755015127/Mark_Cuban_bctoyu.jpg",
    agentLink: "689a45f989f40f995de7356b",
    tags: ["Most Popular"],
  },
  {
    id: "vikram-desai",
    name: "Vikram Desai",
    title: "Mr. Wonderful",
    tagline: "I’m here to make money, not friends.",
    shortDescription:
      "Vikram Desai is a brutally honest investor who prioritizes profit, cash flow, and return on investment. Behind his tough persona lies a strategic mind that values structure, control, and proven models.",
    highlights: [
      "Demands businesses with immediate cash flow or dividends",
      "Insists on clear, conservative valuations based on current performance",
      "Prefers strong unit economics and profitability over growth",
      "Known for aggressive yet fair negotiations with creative deal structures",
      "Uses strategic silence and tough questions to uncover real truths",
      "Believes in emotional intelligence and win-win deals",
      "Delivers harsh truths to save entrepreneurs from bigger failures",
      "Communicates directly — no sugar-coating"
    ],
    image: "https://res.cloudinary.com/mohitbhalotia/image/upload/v1755015127/Kevin_qd6hox.jpg",
    agentLink: "689b10c587ca77bb1ee1e293"
  },
  {
    id: "diya-nair",
    name: "Diya Nair",
    title: "The Queen of VCs",
    tagline: "I turn ideas into household names.",
    shortDescription:
      "Diya Nair blends retail savvy with deep empathy for founders. With a knack for spotting everyday products that win mass appeal, she leverages her QVC empire and retail relationships to launch consumer brands.",
    highlights: [
      "Specializes in single-product companies with mass retail appeal",
      "Looks for practical products that solve real-world problems",
      "Makes quick decisions based on retail intuition and gut",
      "Focuses on entrepreneurs with integrity and passion",
      "Leverages QVC and retail partnerships to scale fast",
      "Emphasizes market testing and customer validation",
      "Asks practical, consumer-first questions",
      "Builds long-term, collaborative relationships"
    ],
    image: "https://res.cloudinary.com/mohitbhalotia/image/upload/v1755015127/Lori_cmumd0.jpg",
    agentLink: "689b111c87ca77bb1ee1e295"
  },
  {
    id: "aanya-kapoor",
    name: "Aanya Kapoor",
    title: "The People-Person Powerhouse",
    tagline: "I bet on people, not products.",
    shortDescription:
      "Aanya Kapoor is a street-smart investor who backs bold, resilient founders. She believes emotional intelligence, storytelling, and personal character matter more than perfect business plans.",
    highlights: [
      "Invests based on the entrepreneur's character and grit",
      "Values street smarts and emotional intelligence over polish",
      "Uses storytelling to build emotional connection and clarity",
      "Focuses on natural sales ability and personal resilience",
      "Asks personal, psychological questions to assess mindset",
      "Believes success comes from people, not just products",
      "Offers tough love and radical honesty",
      "Builds trust-based relationships with founders"
    ],
    image: "https://res.cloudinary.com/mohitbhalotia/image/upload/v1755015127/Barbara_iaidsx.jpg",
    agentLink: "689b116687ca77bb1ee1e297"
  },
  {
    id: "karan-bhatia",
    name: "Karan Bhatia",
    title: "The People’s Shark",
    tagline: "Hustle, heart, and smart branding win the game.",
    shortDescription:
      "Karan Bhatia invests in founders who reflect his own story—gritty, driven, and grounded. With a focus on branding, fashion, and consumer goods, he looks for people-first partnerships built for the long haul.",
    highlights: [
      "Invests in people, not just products",
      "Values hustle, work ethic, and resilience",
      "Prefers markets and industries he understands (fashion, branding)",
      "Looks for proof of concept and real-world sales traction",
      "Builds long-term relationships with high-integrity founders",
      "Takes thoughtful time before making offers",
      "Offers mentorship and strategic branding guidance",
      "Communicates with empathy, patience, and personal insight"
    ],
    image: "https://res.cloudinary.com/mohitbhalotia/image/upload/v1755015127/Daymond_glmsjl.jpg",
    agentLink: "689b0fae87ca77bb1ee1e28f"
  },
  {
    id: "arjun-mehta",
    name: "Arjun Mehta",
    title: "The Technology Optimist",
    tagline: "Solve real problems with integrity, precision, and purpose.",
    shortDescription:
      "Arjun Mehta invests in hardworking, authentic founders who blend passion with precision. With deep roots in cybersecurity and entrepreneurship, he values real-world solutions, strong fundamentals, and people willing to push through challenges.",
    highlights: [
      "Invests in businesses solving real market problems",
      "Prioritizes authenticity, passion, and work ethic in founders",
      "Expects founders to know their numbers and be financially literate",
      "Looks for purpose-driven businesses beyond just profit",
      "Asks detailed questions about financials, tech, and market fit",
      "Brings both technical and business expertise to the table",
      "Supports entrepreneurs through long-term relationships and mentorship",
      "Communicates with warmth, professionalism, and clarity"
    ],
    image: "https://res.cloudinary.com/mohitbhalotia/image/upload/v1755015127/Robert_yelk0t.jpg",
    agentLink: "689b105987ca77bb1ee1e291"
  },
  
  
  

  
  
];
