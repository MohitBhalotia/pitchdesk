/**
 * Default assets for VC bot creation
 * These provide quick options for VCs who want to skip custom recording/upload
 */

// Default avatar images (Cloudinary URLs)
// These are professional, generic avatars suitable for VC bots
// TODO: Replace these with your actual Cloudinary URLs hosting professional avatar images
// For now using placeholder service - replace with actual Cloudinary URLs
export const DEFAULT_AVATARS = [
  "https://res.cloudinary.com/demo/image/upload/w_512,h_512,c_fill,g_face,r_max/v1/default-avatars/professional-avatar-1.jpg",
  "https://res.cloudinary.com/demo/image/upload/w_512,h_512,c_fill,g_face,r_max/v1/default-avatars/professional-avatar-2.jpg",
  "https://res.cloudinary.com/demo/image/upload/w_512,h_512,c_fill,g_face,r_max/v1/default-avatars/professional-avatar-3.jpg",
  "https://res.cloudinary.com/demo/image/upload/w_512,h_512,c_fill,g_face,r_max/v1/default-avatars/professional-avatar-4.jpg",
  "https://res.cloudinary.com/demo/image/upload/w_512,h_512,c_fill,g_face,r_max/v1/default-avatars/professional-avatar-5.jpg",
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
    id: "aura-asteria-en",
    name: "Asteria",
    description: "Professional female voice, warm and confident",
    gender: "Female",
  },
  {
    id: "aura-orion-en",
    name: "Orion",
    description: "Professional male voice, authoritative and clear",
    gender: "Male",
  },
  {
    id: "aura-luna-en",
    name: "Luna",
    description: "Professional female voice, friendly and approachable",
    gender: "Female",
  },
];

// Preview text for voice samples
export const VOICE_PREVIEW_TEXT = "Hello, I'm excited to evaluate innovative startups. Please share your vision, traction, and how you plan to scale your business.";
