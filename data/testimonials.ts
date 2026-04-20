export interface Testimonial {
  text: string;
  name: string;
  role?: string;
  rating?: number;
}

export const defaultTestimonials: Testimonial[] = [
  {
    text: "PitchDesk helped me transform my messy pitch into a compelling story. The AI judges gave me brutally honest feedback that actually helped me secure my first funding!",
    name: "Bhargav bidkar",
    role: "Startup Founder",
    rating: 5,
  },
  {
    text: "As a student with no pitching experience, I was terrified. But practicing with AI judges built my confidence. Now I can pitch my college project to investors without sweating!",
    name: "Priya Patel",
    role: "Student",
    rating: 5,
  },
  {
    text: "The pitch document generator saved me 20+ hours of work. It created investor-ready decks that I could customize. This platform is a game-changer for early-stage founders.",
    name: "Pawan raut",
    role: "Entrepreneur",
    rating: 4,
  },
  {
    text: "I wish the AI could provide more industry-specific feedback for deep tech startups. Great for basic pitching, but needs more customization options for specialized domains.",
    name: "Pankaj quriyal",
    role: "Biotech Founder",
    rating: 3,
  },
  {
    text: "Practicing with different VC personas helped me understand what different investors look for. My pitch success rate improved from 20% to 65% in just 2 months!",
    name: "Suraj bhan",
    role: "Serial Entrepreneur",
    rating: 5,
  },
  {
    text: "The evaluation metrics are super detailed - from body language analysis to content structure. It felt like having a personal pitch coach available 24/7.",
    name: "krish",
    role: " Founder",
    rating: 4,
  },
  {
    text: "The platform is great, but I experienced some lag during peak hours. However, the customer support team was incredibly responsive and fixed the issues quickly.",
    name: "Siddharth Kumar",
    role: "Founder",
    rating: 4,
  },
  {
    text: "Being able to practice anytime without the pressure of real investors was liberating. I refined my pitch through 50+ iterations before my first real VC meeting.",
    name: "Aditi Verma",
    role: "Founder",
    rating: 5,
  },
  {
    text: "Can't wait for the crowdfunding feature! The current platform already helped me connect with 3 potential investors through the 'Meet VCs' program. Life-changing!",
    name: "Debdeep mukharjee",
    role: "Founder",
    rating: 5,
  },
];
