// app/team/page.tsx
import { Linkedin, Mail, Github, Sparkles, Users, Target } from 'lucide-react';

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
    name: "Sarah Chen",
    role: "CEO & Founder",
    bio: "Visionary leader with 10+ years in tech entrepreneurship. Passionate about building products that make a difference.",
    image: "/team/sarah.jpg",
    social: {
      linkedin: "https://linkedin.com/in/sarahchen",
      email: "sarah@company.com"
    }
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "CTO",
    bio: "Full-stack developer and system architect. Loves solving complex technical challenges and mentoring engineering teams.",
    image: "/team/marcus.jpg",
    social: {
      linkedin: "https://linkedin.com/in/marcusrodriguez",
      github: "https://github.com/marcusrodriguez"
    }
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Lead Designer",
    bio: "Creative designer focused on user experience and beautiful interfaces. Believes good design should be accessible to everyone.",
    image: "/team/emily.jpg",
    social: {
      linkedin: "https://linkedin.com/in/emilywatson",
      github: "https://github.com/emilywatson"
    }
  },
  {
    id: 4,
    name: "Alex Thompson",
    role: "Senior Developer",
    bio: "Backend specialist and database wizard. Enjoys optimizing performance and building scalable systems.",
    image: "/team/alex.jpg",
    social: {
      linkedin: "https://linkedin.com/in/alexthompson",
      github: "https://github.com/alexthompson"
    }
  },
  {
    id: 5,
    name: "Priya Patel",
    role: "Product Manager",
    bio: "Bridge between users and developers. Passionate about creating products that solve real problems and delight users.",
    image: "/team/priya.jpg",
    social: {
      linkedin: "https://linkedin.com/in/priyapatel",
      email: "priya@company.com"
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
          <h1 className="text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Our Amazing Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're a passionate group of innovators, creators, and problem-solvers 
            dedicated to building amazing experiences for our users. Together, we turn 
            ideas into reality.
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

// Team Card Component
function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <div 
      className="group relative bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-border/50 hover:border-primary/20"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative overflow-hidden">
        {/* Avatar Container */}
        <div className="relative w-full h-72 bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary rounded-full translate-x-1/2 translate-y-1/2" />
          </div>
          
          {/* Avatar Circle */}
          <div className="relative z-10 w-40 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center border-4 border-white/10 group-hover:border-white/20 transition-all duration-500 shadow-2xl">
            <div className="w-36 h-36 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl font-bold text-primary">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
        </div>
        
        {/* Social Links - Improved positioning and styling */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-background/80 backdrop-blur-md rounded-full px-4 py-2 border border-border/50 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          {member.social.linkedin && (
            <a 
              href={member.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-300 hover:scale-110"
            >
              <Linkedin size={18} />
            </a>
          )}
          {member.social.github && (
            <a 
              href={member.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all duration-300 hover:scale-110"
            >
              <Github size={18} />
            </a>
          )}
          {member.social.email && (
            <a 
              href={`mailto:${member.social.email}`}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-300 hover:scale-110"
            >
              <Mail size={18} />
            </a>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-7 bg-card">
        <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {member.name}
        </h3>
        <p className="text-primary font-semibold mb-4 text-sm uppercase tracking-wide">
          {member.role}
        </p>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {member.bio}
        </p>
      </div>
    </div>
  );
}

// Value Card Component
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