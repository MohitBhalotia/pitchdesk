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

export default function TeamCard({ member, index }: TeamCardProps) {
  const [imageError, setImageError] = useState(false);

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
          
          {/* Avatar Circle with Actual Image */}
          <div className="relative z-10 w-40 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center border-4 border-white/10 group-hover:border-white/20 transition-all duration-500 shadow-2xl overflow-hidden">
            <div className="w-36 h-36 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
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