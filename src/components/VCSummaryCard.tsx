import React from "react";

interface VCSummaryCardProps {
  name: string;
  title: string;
  tagline: string;
  image: string;
  agentLink: string;
  shortDescription: string;
  highlights: string[];
}

import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowUpRight, Info } from "lucide-react";
import { ButtonGroup } from "./ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const AVATAR_PLACEHOLDER = "/avatar-placeholder.svg";

const VCSummaryCard: React.FC<VCSummaryCardProps> = ({
  name,
  title,
  tagline,
  image,
  agentLink,
  shortDescription,
  highlights,
}) => {
  return (
    <div
      className=" bg-background rounded-2xl shadow-lg border border-border p-6 hover:shadow-2xl hover:scale-105 transition-all group cursor-pointer flex flex-col text-center items-center"
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

      <ButtonGroup className="mt-4 font-semibold py-4 ">
        <Button variant="default" type="button" size="default">
          <a
            className="flex items-center justify-center"
            href={`/start-pitch?agentId=${agentLink}`}
            target="_blank"
          >
            <span className="text-base">Start</span>
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </a>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" type="button" size="icon">
              <Info className="text-white" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{name}</DialogTitle>
            </DialogHeader>
            <DialogDescription>{tagline}</DialogDescription>
            <div className="text-foreground text-base py-4 mb-2">
              {shortDescription}
            </div>
            <DialogFooter>
              <ul className="flex flex-col gap-2">
                {highlights.map((highlight, idx) => (
                  <li key={idx} className="list-disc ml-4">
                    {highlight}
                  </li>
                ))}
              </ul>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ButtonGroup>
    </div>
  );
};

export default VCSummaryCard;
