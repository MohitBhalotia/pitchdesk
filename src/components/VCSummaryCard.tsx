import React from 'react';

interface VCSummaryCardProps {
  name: string;
  title: string;
  tagline: string;
  image: string;
  onClick: () => void;
}

import Image from 'next/image';

const AVATAR_PLACEHOLDER = '/ai-vc-avatar.svg';

const VCSummaryCard: React.FC<VCSummaryCardProps> = ({ name, title, tagline, image, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-[#18181b] text-[#fafafa] rounded-2xl shadow-lg border border-[#27272a] p-6 hover:shadow-2xl hover:scale-105 transition-all group cursor-pointer flex flex-col text-center items-center"
    >
      <Image
        src={image || AVATAR_PLACEHOLDER}
        alt={name}
        className="w-28 h-28 rounded-full border-4 border-teal-400/60 shadow-lg bg-white object-cover mb-4"
      />
      <h2 className="text-xl font-bold bg-gradient-to-r from-teal-500 to-violet-500 bg-clip-text text-transparent mb-1">
        {name}
      </h2>
      <p className="text-teal-700 dark:text-teal-300 font-semibold text-md mb-3">{title}</p>
      <p className="text-muted-foreground text-sm italic flex-grow">
        &ldquo;{tagline}&rdquo;
      </p>
    </div>
  );
};

export default VCSummaryCard;
