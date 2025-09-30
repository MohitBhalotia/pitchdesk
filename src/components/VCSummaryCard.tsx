import React from "react";

interface VCSummaryCardProps {
  name: string;
  title: string;
  tagline: string;
  image: string;
  agentLink: string;
  onClick: () => void;
}

import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";

const AVATAR_PLACEHOLDER = "/avatar-placeholder.svg";

const VCSummaryCard: React.FC<VCSummaryCardProps> = ({
  name,
  title,
  tagline,
  image,
  agentLink,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative bg-background rounded-2xl shadow-lg border border-border p-6 hover:shadow-2xl hover:scale-105 transition-all group cursor-pointer flex flex-col text-center items-center"
    >
      <Image
        width={1200}
        height={1200}
        src={image || AVATAR_PLACEHOLDER}
        alt={name}
        className="w-28 h-28 rounded-full border-4 border-primary/40 shadow-lg bg-white object-cover mb-4"
      />
      <h2 className="text-xl text-foreground font-bold  bg-clip-text  mb-1">
        {name}
      </h2>
      <p className="text-foreground font-semibold text-md mb-3">{title}</p>
      <p className="text-muted-foreground text-sm italic flex-grow">
        &ldquo;{tagline}&rdquo;
      </p>
      <a href={`/start-pitch?agentId=${agentLink}`} target="_blank" >
        <Button className="mt-4 font-semibold py-4 flex items-center justify-center" variant="default" type="button" size="default">
          <span className="text-base">Start</span>
        <ArrowUpRight className="w-4 h-4 ml-2" />
        </Button>
      </a>
    </div>
  );
};

export default VCSummaryCard;
