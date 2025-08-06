import React from "react";

interface ProfileCardProps {
  name: string;
  nickname: string;
  avatar?: string;
  corePersonalityTraits: string;
  investmentPhilosophy: string;
  keyInvestmentCriteria: string[];
  questioningApproach: string;
  dealMakingCharacteristics: string;
  communicationStyle: string;
  decisionMakingTriggers: string[];
}

const AVATAR_PLACEHOLDER = "/ai-vc-avatar.svg";

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  nickname,
  avatar,
  corePersonalityTraits,
  investmentPhilosophy,
  keyInvestmentCriteria,
  questioningApproach,
  dealMakingCharacteristics,
  communicationStyle,
  decisionMakingTriggers,
}) => {
  return (
    <div className="bg-white/80 dark:bg-card/90 rounded-2xl shadow-xl border border-border/30 p-8 max-w-xl mx-auto glass-card hover:shadow-2xl transition-all group">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={avatar || AVATAR_PLACEHOLDER}
          alt={name}
          className="w-20 h-20 rounded-full border-4 border-teal-400/60 shadow-lg bg-white object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-violet-500 bg-clip-text text-transparent mb-1">
            {name}
          </h2>
          <p className="text-teal-700 dark:text-teal-300 font-semibold text-lg">{nickname}</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-teal-600 dark:text-teal-300 mb-1">Personality Traits</h3>
          <p className="text-muted-foreground text-sm">{corePersonalityTraits}</p>
        </div>
        <div>
          <h3 className="font-semibold text-violet-600 dark:text-violet-300 mb-1">Investment Philosophy</h3>
          <p className="text-muted-foreground text-sm">{investmentPhilosophy}</p>
        </div>
        <div>
          <h3 className="font-semibold text-indigo-600 dark:text-indigo-300 mb-1">Key Investment Criteria</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {keyInvestmentCriteria.map((criteria, idx) => (
              <li key={idx}>{criteria}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-pink-600 dark:text-pink-300 mb-1">Questioning Approach</h3>
          <p className="text-muted-foreground text-sm">{questioningApproach}</p>
        </div>
        <div>
          <h3 className="font-semibold text-orange-600 dark:text-orange-300 mb-1">Deal Making</h3>
          <p className="text-muted-foreground text-sm">{dealMakingCharacteristics}</p>
        </div>
        <div>
          <h3 className="font-semibold text-cyan-600 dark:text-cyan-300 mb-1">Communication Style</h3>
          <p className="text-muted-foreground text-sm">{communicationStyle}</p>
        </div>
        <div>
          <h3 className="font-semibold text-emerald-600 dark:text-emerald-300 mb-1">Decision Triggers</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {decisionMakingTriggers.map((trigger, idx) => (
              <li key={idx}>{trigger}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
