// app/team/TeamCard.tsx
'use client';

import { Linkedin, Mail, Github } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

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

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

const avatarColors = [
  { solid: "bg-mint", soft: "bg-mint/30" },
  { solid: "bg-yellow", soft: "bg-yellow/30" },
  { solid: "bg-pink", soft: "bg-pink/30" },
  { solid: "bg-lavender", soft: "bg-lavender/30" },
];

export default function TeamCard({ member, index }: TeamCardProps) {
  const [imageError, setImageError] = useState(false);
  const color = avatarColors[index % avatarColors.length];

  return (
    <div
      className="group relative bg-card rounded-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="relative overflow-hidden">
        {/* Avatar Container */}
        <div className={`relative w-full h-72 ${color.soft} flex items-center justify-center overflow-hidden`}>
          {/* Avatar Circle with Actual Image */}
          <div className={`relative z-10 w-40 h-40 ${color.solid} rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden`}>
            <div className="w-36 h-36 rounded-full flex items-center justify-center overflow-hidden">
              {!imageError ? (
                <Image 
                  src={member.image}
                  alt={member.name}
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                  priority={index < 3} // Load first 3 images with priority
                />
              ) : (
                <span className="text-3xl font-bold text-primary">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Social Links */}
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