/**
 * Default assets for VC bot creation
 * These provide quick options for VCs who want to skip custom recording/upload
 */


export const DEFAULT_AVATARS = [
  
"https://res.cloudinary.com/mohitbhalotia/image/upload/v1770204662/Image1_j7tkg8.jpg" ,

"https://res.cloudinary.com/mohitbhalotia/image/upload/v1770204662/Image3_uq2juj.jpg" ,

"https://res.cloudinary.com/mohitbhalotia/image/upload/v1770204662/Image2_qhz13v.jpg" ,

"https://res.cloudinary.com/mohitbhalotia/image/upload/v1770204663/Image5_fftodo.jpg" ,

"https://res.cloudinary.com/mohitbhalotia/image/upload/v1770204663/Image4_d2wuqf.jpg" ,

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
