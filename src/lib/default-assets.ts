/**
 * Default assets for VC bot creation
 * These provide quick options for VCs who want to skip custom recording/upload
 */


export const DEFAULT_AVATARS = [
  "https://res.cloudinary.com/mohitbhalotia/image/upload/v1765818140/WhatsApp_Image_2025-12-14_at_4.28.04_PM_dhtfej.jpg",
  "https://res.cloudinary.com/df40dztju/image/upload/v1769513400/vc-bot-avatars/Pavan%20Raut-avatar-1769513395337.jpg",
  "https://res.cloudinary.com/df40dztju/image/upload/v1769600308/vc-bot-avatars/fvghjk-avatar-1769600304571.jpg",
  "https://res.cloudinary.com/mohitbhalotia/image/upload/v1765818140/WhatsApp_Image_2025-12-14_at_4.28.04_PM_dhtfej.jpg",
  "https://res.cloudinary.com/df40dztju/image/upload/v1769513400/vc-bot-avatars/Pavan%20Raut-avatar-1769513395337.jpg"
];

// Default Cartesia voices with metadata
export interface DefaultVoice {
  id: string;
  name: string;
  description: string;
  gender: "Male" | "Female";
}

export const DEFAULT_VOICES: DefaultVoice[] = [
  {
    id: "81db94f2-ea76-4e5a-94bf-c92be997270d",
    name: "Jeff",
    description: "A deep, resonating American male voice great for narrating content.",
    gender: "Male",
  },
  {
    id: "5c29d7e3-a133-4c7e-804a-1d9c6dea83f6",
    name: "Marta",
    description: "A smooth, casual South American Spanish-speaking woman.",
    gender: "Female",
  },
  {
    id: "0afd8614-31cb-438c-8a46-80650e19c29c",
    name: "Teresa",
    description: "A casual Spanish voice, great for phone calls.",
    gender: "Female",
  },
];

// Preview text for voice samples
export const VOICE_PREVIEW_TEXT = "Hello, I'm excited to evaluate innovative startups. Please share your vision, traction, and how you plan to scale your business.";
