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
      linkedin: "https://linkedin.com/in/sarahchen",
      // email: "sarah@company.com"
    }
  },
  {
    id: 2,
    name: "Daksh Mehta",
    role: "Founder",
    bio: "Turning innovative ideas into scalable products.",
    image: "/daksh.jpg",
    social: {
      linkedin: "https://linkedin.com/in/marcusrodriguez",
      // github: "https://github.com/marcusrodriguez"
    }
  },
  {
    id: 3,
    name: "Mohit Bhalotia",
    role: "Software Engineer",
    bio: "Specializes in  AI-powered features and integration.",
    image: "/mohit.jpg",
    social: {
      linkedin: "https://linkedin.com/in/emilywatson",
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
    name: "Prathmesh Ghoremore",
    role: "Fullstack Developer",
    bio: "Creates seamless user experiences across frontend and backend. Focused on product excellence.",
    image: "/prathmesh.jpg",
    social: {
      linkedin: "https://linkedin.com/in/priyapatel",
      github: "https://github.com/Prathamesh0415"
    }
  }
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users size={16} />
            Meet the Team
          </div>
          <h1 className="p-2 text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
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
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Target size={16} />
            Our Values
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-12">
            What Drives Us Forward
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ValueCard 
              icon={<Sparkles className="w-8 h-8" />}
              title="Innovation" 
              description="We constantly push boundaries and explore new possibilities to deliver cutting-edge solutions that shape the future."
            />
            <ValueCard 
              icon={<Users className="w-8 h-8" />}
              title="Collaboration" 
              description="Great things happen when we work together. We value every voice and perspective in our journey."
            />
            <ValueCard 
              icon={<Target className="w-8 h-8" />}
              title="Excellence" 
              description="We're committed to delivering the highest quality in everything we build and every interaction we have."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Value Card Component (can stay as Server Component)
function ValueCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="group relative bg-card p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl">
      {/* Hover Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Icon Container */}
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        
        <h3 className="text-xl font-bold text-card-foreground mb-4 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}