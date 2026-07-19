// app/team/page.tsx
import { /*Linkedin, Mail, Github,*/ Sparkles, Users, Target } from 'lucide-react';
import TeamCard from '@/components/TeamCard'; // We'll create this as a separate client component

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Ayush Ajgaonkar",
    role: "Founder",
    bio: "Leads technical development and platform architecture. Passionate about building scalable Solutions.",
    image: "/aayush.jpg",
    social: {
      linkedin: "https://www.linkedin.com/in/ayush080105?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      github: "https://github.com/Ayush080105"
    }
  },
  {
    id: 2,
    name: "Daksh Mehta",
    role: "Founder",
    bio: "Turning innovative ideas into scalable products.",
    image: "/daksh.jpg",
    social: {
      linkedin: "https://www.linkedin.com/in/daksh-mehta-35a5832b8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      github: "https://github.com/duckhhh"
    }
  },
  {
    id: 3,
    name: "Mohit Bhalotia",
    role: "Software Engineer",
    bio: "Specializes in  AI-powered features and integration.",
    image: "/mohit.jpg",
    social: {
      linkedin: "https://www.linkedin.com/in/mohit-bhalotia/",
      github: "https://github.com/MohitBhalotia"
    }
  },
  {
    id: 4,
    name: "Naresh Mahiya",
    role: "Backend Engineer",
    bio: "Builds robust server infrastructure & Ensures system reliability and performance.",
    image: "/naresh.jpg",
    social: {
      linkedin: "https://www.linkedin.com/in/naresh-mahiya-1ba039254",
      github: "https://github.com/naresh-mahiya"
    }
  },
  {
    id: 5,
    name: "Prathamesh Ghormare",
    role: "Fullstack Developer",
    bio: "Creates seamless user experiences across frontend and backend. Focused on product excellence.",
    image: "/prathmesh.jpg",
    social: {
      linkedin: "https://www.linkedin.com/in/prathamesh-ghormare-64a601339/",
      github: "https://github.com/Prathamesh0415"
    }
  }
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-pink text-pink-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users size={16} />
            Meet the Team
          </div>
          <h1 className="p-2 text-5xl mb-6 text-ink">
            Our Amazing Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {`We're a passionate group of innovators, creators, and problem-solvers 
            dedicated to building amazing experiences for our users. Together, we turn 
            ideas into reality.`}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {teamMembers.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </div>

        {/* Values Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-yellow text-yellow-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Target size={16} />
            Our Values
          </div>
          <h2 className="text-4xl mb-12 text-ink">
            What Drives Us Forward
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ValueCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Innovation"
              description="We constantly push boundaries and explore new possibilities to deliver cutting-edge solutions that shape the future."
              color="bg-mint text-mint-foreground"
            />
            <ValueCard
              icon={<Users className="w-8 h-8" />}
              title="Collaboration"
              description="Great things happen when we work together. We value every voice and perspective in our journey."
              color="bg-yellow text-yellow-foreground"
            />
            <ValueCard
              icon={<Target className="w-8 h-8" />}
              title="Excellence"
              description="We're committed to delivering the highest quality in everything we build and every interaction we have."
              color="bg-pink text-pink-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Value Card Component (can stay as Server Component)
function ValueCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="group relative bg-card p-8 rounded-2xl transition-all duration-500 hover:-translate-y-1">
      <div className="relative z-10">
        {/* Icon Container */}
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500 ${color}`}>
          {icon}
        </div>

        <h3 className="text-xl font-bold text-card-foreground mb-4">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}