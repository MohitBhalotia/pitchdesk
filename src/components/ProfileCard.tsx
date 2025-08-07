import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProfileCardProps {
  name: string;
  title: string;
  tagline: string;
  shortDescription: string;
  highlights: string[];
  image: string;
}

const AVATAR_PLACEHOLDER = '/ai-vc-avatar.svg';

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  tagline,
  shortDescription,
  highlights,
  image,
}) => {
  return (
    <div className="bg-[#18181b] text-[#fafafa] rounded-2xl shadow-xl border border-[#27272a] p-8 hover:shadow-2xl transition-all group flex flex-col">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={image || AVATAR_PLACEHOLDER}
          alt={name}
          className="w-24 h-24 rounded-full border-4 border-teal-400/60 shadow-lg bg-white object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold text-[#fafafa] mb-1">
            {name}
          </h2>
          <p className="text-teal-700 dark:text-teal-300 font-semibold text-lg">{title}</p>
        </div>
      </div>

      <div className="flex-grow space-y-4">
        <p className="text-muted-foreground italic text-center border-t border-b border-border/20 py-3 my-3">
          &ldquo;{tagline}&rdquo;
        </p>

        <div>
          <p className="text-muted-foreground text-sm">{shortDescription}</p>
        </div>

        <div>
          <h3 className="font-semibold text-violet-600 dark:text-violet-300 mb-2">Key Traits & Philosophy</h3>
          <ul className="space-y-2">
            {highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
