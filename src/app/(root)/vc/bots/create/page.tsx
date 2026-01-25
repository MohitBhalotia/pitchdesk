"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mic, Camera, Check, Play, Pause, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    sector: z.string().min(2, "Sector is required"),
    fundSize: z.string().min(1, "Fund size is required"),
    investmentStage: z.string().min(1, "Investment stage is required"),
    geographicFocus: z.string().optional(),
    userInstructions: z.string().min(20, "Please provide detailed evaluation criteria"),
});

export default function CreateBotPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1); // 1: Form, 2: Voice, 3: Avatar

    // Voice recording states
    const [voiceRecording, setVoiceRecording] = useState(false);
    const [voiceRecorded, setVoiceRecorded] = useState(false);
    const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
    const [recordedAudioUrl, setRecordedAudioUrl] = useState("");
    const [recordingTime, setRecordingTime] = useState(0);
    const [clippingRange, setClippingRange] = useState([0, 10]);
    const [isUploadingVoice, setIsUploadingVoice] = useState(false);
    const [voiceId, setVoiceId] = useState("");
    const [isPreviewingVoice, setIsPreviewingVoice] = useState(false);
    const [previewAudioUrl, setPreviewAudioUrl] = useState("");
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Camera/Avatar states
    const [cameraActive, setCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState("");
    const [generatedAvatars, setGeneratedAvatars] = useState<string[]>([]);
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const [isGeneratingAvatars, setIsGeneratingAvatars] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [finalAvatarUrl, setFinalAvatarUrl] = useState("");
    const [selectedAvatarBase64, setSelectedAvatarBase64] = useState("");
    const [generationError, setGenerationError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            sector: "",
            fundSize: "",
            investmentStage: "",
            geographicFocus: "",
            userInstructions: "",
        },
    });

    // ===== VOICE RECORDING FUNCTIONS =====
    const startVoiceRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks: Blob[] = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                setRecordedAudioBlob(audioBlob);
                setRecordedAudioUrl(URL.createObjectURL(audioBlob));
                setVoiceRecorded(true);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setVoiceRecording(true);
            setRecordingTime(0);

            // Start timer
            recordingIntervalRef.current = setInterval(() => {
                setRecordingTime((prev) => {
                    if (prev >= 30) {
                        stopVoiceRecording();
                        return 30;
                    }
                    return prev + 1;
                });
            }, 1000);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            toast.error("Failed to access microphone. Please grant permission.");
        }
    };

    const stopVoiceRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
        }
        setVoiceRecording(false);
    };

    const uploadVoiceClip = async () => {
        if (!recordedAudioBlob) {
            toast.error("No audio recorded");
            return;
        }

        try {
            setIsUploadingVoice(true);

            // Extract the 10-second clip based on slider selection
            const startTime = clippingRange[0];
            const endTime = clippingRange[1];

            // For simplicity, we'll upload the full audio and let Cartesia handle clipping
            // In production, you might want to trim the audio client-side

            const formData = new FormData();
            formData.append('audio', recordedAudioBlob);
            formData.append('name', `${form.getValues('name')} Voice`);
            formData.append('description', `Voice AI for ${form.getValues('name')}`);

            const response = await axios.post('/api/voice/clone', formData);

            if (response.data.success) {
                setVoiceId(response.data.voiceId);
                toast.success("Voice cloned successfully! You can now preview it or continue.");
                // Don't auto-navigate - let user preview first
            }
        } catch (error) {
            console.error("Voice upload error:", error);

            // Extract error message from API response if available
            const errorMessage = axios.isAxiosError(error) && error.response?.data?.error
                ? error.response.data.error
                : "Failed to clone voice. Please try again.";

            toast.error(errorMessage);
        } finally {
            setIsUploadingVoice(false);
        }
    };

    const previewClonedVoice = async () => {
        if (!voiceId) {
            toast.error("No voice cloned yet");
            return;
        }

        try {
            setIsPreviewingVoice(true);

            const response = await axios.post('/api/voice/preview', {
                voiceId,
                text: "This is how your AI judge will sound during pitch evaluations. I'm excited to hear your startup ideas!"
            }, {
                responseType: 'blob' // Important for audio
            });

            // Create audio URL from blob
            const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setPreviewAudioUrl(audioUrl);

            // Auto-play the preview
            const audio = new Audio(audioUrl);
            audio.play();

            toast.success("Playing voice preview!");
        } catch (error) {
            console.error("Voice preview error:", error);
            toast.error("Failed to preview voice. Please try again.");
        } finally {
            setIsPreviewingVoice(false);
        }
    };

    // ===== CAMERA FUNCTIONS =====
    const startCamera = async () => {
        console.log('📷 Starting camera...');

        // Set camera active FIRST so the video element renders
        setCameraActive(true);

        // Wait a tiny bit for React to render the video element
        setTimeout(async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: 'user'
                    }
                });

                console.log('📹 Got media stream:', stream);

                if (videoRef.current) {
                    console.log('✅ Setting stream to video element');
                    videoRef.current.srcObject = stream;

                    // Ensure video plays
                    videoRef.current.onloadedmetadata = () => {
                        console.log('📺 Video metadata loaded');
                        videoRef.current?.play()
                            .then(() => console.log('▶️ Video playing'))
                            .catch(err => {
                                console.error('❌ Error playing video:', err);
                            });
                    };

                    toast.success('Camera activated!');
                } else {
                    console.error('❌ videoRef.current is still null after timeout!');
                    setCameraActive(false);
                    toast.error('Failed to initialize camera. Please try again.');
                }
            } catch (error) {
                console.error("❌ Error accessing camera:", error);
                setCameraActive(false);
                toast.error("Failed to access camera. Please grant permission and try again.");
            }
        }, 100); // 100ms delay to let React render
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0);
                const imageDataUrl = canvas.toDataURL('image/jpeg');
                setCapturedImage(imageDataUrl);

                // Stop camera
                const stream = video.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                setCameraActive(false);

                // Generate avatars
                generateAvatarsFromPhoto(imageDataUrl);
            }
        }
    };

    const generateAvatarsFromPhoto = async (imageBase64: string) => {
        try {
            setIsGeneratingAvatars(true);
            setGenerationError(false);

            // Convert base64 to Blob
            const byteCharacters = atob(imageBase64.split(',')[1]);
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            const blob = new Blob(byteArrays, { type: 'image/jpeg' });

            // Create FormData
            const formData = new FormData();
            formData.append('image', blob, 'avatar-capture.jpg');

            // Send as multipart/form-data
            // Axios automatically sets Content-Type with boundary for FormData
            const response = await axios.post('/api/avatar/generate', formData);

            if (response.data.success && response.data.avatars) {
                // Convert base64 to data URLs
                const avatarUrls = response.data.avatars.map((base64: string) =>
                    base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`
                );
                setGeneratedAvatars(avatarUrls);
                toast.success("Avatars generated successfully!");
            }
        } catch (error) {
            console.error("Avatar generation error:", error);
            setGenerationError(true);
            toast.error("Failed to generate avatars. Please try again.");
        } finally {
            setIsGeneratingAvatars(false);
        }
    };

    const uploadSelectedAvatar = async (avatarBase64: string) => {
        setSelectedAvatarBase64(avatarBase64);
        try {
            setIsUploadingAvatar(true);

            const response = await axios.post('/api/upload/cloudinary', {
                imageBase64: avatarBase64,
                fileName: `${form.getValues('name')}-avatar-${Date.now()}`
            });

            if (response.data.success) {
                setFinalAvatarUrl(response.data.url);
                setSelectedAvatar(response.data.url);
                toast.success("Avatar uploaded successfully!");
                return response.data.url;
            }
        } catch (error) {
            console.error("Avatar upload error:", error);
            toast.error("Failed to upload avatar. Please try again.");
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    // ===== FORM SUBMISSION =====
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (step === 1) {
            setStep(2); // Move to voice recording
            return;
        }

        // Final submission
        if (!voiceId) {
            toast.error("Please record and upload your voice");
            return;
        }

        if (!selectedAvatar) {
            toast.error("Please capture photo and select an avatar");
            return;
        }

        try {
            setIsSubmitting(true);

            // Generate system prompt via FastAPI
            const promptResponse = await axios.post("/api/generate-agent-prompt", values);
            const { systemPrompt, firstMessage } = promptResponse.data;

            // Create bot
            await axios.post("/api/vc/bots", {
                ...values,
                systemPrompt,
                firstMessage,
                voice: voiceId, // Cartesia voice ID
                avatarUrl: selectedAvatar, // Use 'avatarUrl' to match the backend API
            });

            toast.success("AI Judge Bot created successfully!");
            router.push("/vc/bots");
            router.refresh();
        } catch (error) {
            console.error("Error creating bot:", error);
            toast.error("Failed to create bot. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Create AI Judge Bot</h1>
                <p className="text-muted-foreground mt-1">
                    Design a custom AI persona with your voice and appearance.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Progress Indicator */}
                <div className="flex items-center gap-4 mb-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'} font-bold text-sm`}>1</div>
                    <div className="h-1 flex-1 bg-muted">
                        <div className={`h-full bg-primary transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
                    </div>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'} font-bold text-sm`}>2</div>
                    <div className="h-1 flex-1 bg-muted">
                        <div className={`h-full bg-primary transition-all ${step >= 3 ? 'w-full' : 'w-0'}`} />
                    </div>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'} font-bold text-sm`}>3</div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {step === 1 && "Investment Focus & Criteria"}
                            {step === 2 && "Record Your Voice"}
                            {step === 3 && "Capture Your Avatar"}
                        </CardTitle>
                        <CardDescription>
                            {step === 1 && "Define your investment preferences and evaluation approach."}
                            {step === 2 && "Record 30 seconds of your voice, then select a 10-second clip."}
                            {step === 3 && "Capture your photo to generate AI avatars."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* STEP 1: INVESTMENT CRITERIA */}
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bot Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Strategic Growth Partner" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bot Bio</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Brief background of this VC persona..."
                                                            className="min-h-[80px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="sector"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Sector Focus</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select sector" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="AI/ML">AI/ML</SelectItem>
                                                                <SelectItem value="FinTech">FinTech</SelectItem>
                                                                <SelectItem value="HealthTech">HealthTech</SelectItem>
                                                                <SelectItem value="EdTech">EdTech</SelectItem>
                                                                <SelectItem value="E-commerce">E-commerce</SelectItem>
                                                                <SelectItem value="SaaS">SaaS</SelectItem>
                                                                <SelectItem value="CleanTech">CleanTech</SelectItem>
                                                                <SelectItem value="Other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="fundSize"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Check Size</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. $100K - $500K" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="investmentStage"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Investment Stage</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select stage" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                                                                <SelectItem value="Seed">Seed</SelectItem>
                                                                <SelectItem value="Series A">Series A</SelectItem>
                                                                <SelectItem value="Series B">Series B</SelectItem>
                                                                <SelectItem value="Growth">Growth</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="geographicFocus"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Geographic Focus</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. North America, Global" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="userInstructions"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Evaluation Criteria</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Describe how this bot should evaluate pitches (e.g., focus on traction, team, market size)..."
                                                            className="min-h-[100px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" className="w-full">
                                            Next: Record Voice
                                        </Button>
                                    </div>
                                )}

                                {/* STEP 2: VOICE RECORDING */}
                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div className="border rounded-lg p-6 bg-muted/20">
                                            <div className="flex flex-col items-center gap-4">
                                                {!voiceRecorded ? (
                                                    <>
                                                        <div className="text-center">
                                                            <h3 className="font-semibold text-lg mb-2">Record Your Voice</h3>
                                                            <p className="text-sm text-muted-foreground mb-4">
                                                                For best results, read the following script clearly and naturally:
                                                            </p>
                                                            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4 max-w-md mx-auto">
                                                                <p className="text-sm font-medium italic text-foreground leading-relaxed">
                                                                    "Hello, I'm excited to evaluate innovative startups. Please share your vision, traction, and how you plan to scale your business."
                                                                </p>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">
                                                                💡 Tip: Speak naturally as if talking to a founder. Repeat 2-3 times for best quality.
                                                            </p>
                                                        </div>

                                                        {voiceRecording && (
                                                            <div className="w-full max-w-md">
                                                                <div className="text-center mb-4">
                                                                    <div className="text-4xl font-bold text-primary">
                                                                        {recordingTime}s / 30s
                                                                    </div>
                                                                    <Progress value={(recordingTime / 30) * 100} className="mt-2" />
                                                                </div>
                                                            </div>
                                                        )}

                                                        <Button
                                                            type="button"
                                                            onClick={voiceRecording ? stopVoiceRecording : startVoiceRecording}
                                                            variant={voiceRecording ? "destructive" : "default"}
                                                            size="lg"
                                                            className="gap-2"
                                                        >
                                                            {voiceRecording ? (
                                                                <>
                                                                    <Pause className="h-5 w-5" />
                                                                    Stop Recording
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Mic className="h-5 w-5" />
                                                                    Start Recording
                                                                </>
                                                            )}
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="text-center">
                                                            <div className="flex items-center gap-2 justify-center mb-2">
                                                                <Check className="h-5 w-5 text-green-500" />
                                                                <h3 className="font-semibold text-lg">Recording Complete!</h3>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mb-4">
                                                                {recordingTime} seconds recorded
                                                            </p>

                                                            {/* Audio Player */}
                                                            <audio src={recordedAudioUrl} controls className="w-full max-w-md mb-4" />

                                                            {/* Clip Selection */}
                                                            <div className="w-full max-w-md mt-4">
                                                                <label className="text-sm font-medium mb-2 block">
                                                                    Select 10-second clip: {clippingRange[0]}s - {clippingRange[1]}s
                                                                </label>
                                                                <Slider
                                                                    min={0}
                                                                    max={Math.min(recordingTime - 10, 20)}
                                                                    step={1}
                                                                    value={[clippingRange[0]]}
                                                                    onValueChange={(value) => setClippingRange([value[0], value[0] + 10])}
                                                                    className="mb-4"
                                                                />
                                                                <p className="text-xs text-muted-foreground">
                                                                    Cartesia AI requires a 5-10 second clip for optimal voice cloning.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-3">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setVoiceRecorded(false);
                                                                    setRecordedAudioBlob(null);
                                                                    setRecordedAudioUrl("");
                                                                    setVoiceId("");
                                                                }}
                                                            >
                                                                Re-record
                                                            </Button>
                                                            {voiceId ? (
                                                                <>
                                                                    <Button
                                                                        type="button"
                                                                        variant="secondary"
                                                                        onClick={previewClonedVoice}
                                                                        disabled={isPreviewingVoice}
                                                                        className="gap-2"
                                                                    >
                                                                        {isPreviewingVoice && <Loader2 className="h-4 w-4 animate-spin" />}
                                                                        🔊 Preview Voice
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        onClick={() => setStep(3)}
                                                                        className="gap-2"
                                                                    >
                                                                        Continue to Avatar
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <Button
                                                                    type="button"
                                                                    onClick={uploadVoiceClip}
                                                                    disabled={isUploadingVoice}
                                                                    className="gap-2"
                                                                >
                                                                    {isUploadingVoice && <Loader2 className="h-4 w-4 animate-spin" />}
                                                                    Clone Voice & Continue
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setStep(1)}
                                        >
                                            Back
                                        </Button>
                                    </div>
                                )}

                                {/* STEP 3: AVATAR CAPTURE */}
                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div className="border rounded-lg p-6 bg-muted/20">
                                            {!capturedImage ? (
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="text-center">
                                                        <h3 className="font-semibold text-lg mb-2">Capture Your Photo</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            We'll use AI to generate professional avatars from your photo.
                                                        </p>
                                                    </div>

                                                    {cameraActive ? (
                                                        <>
                                                            <div className="w-full max-w-md mx-auto">
                                                                <video
                                                                    ref={videoRef}
                                                                    autoPlay
                                                                    playsInline
                                                                    muted
                                                                    className="w-full h-auto rounded-lg border-2 border-primary shadow-lg bg-black"
                                                                    style={{ minHeight: '300px', maxHeight: '500px' }}
                                                                />
                                                                <canvas ref={canvasRef} className="hidden" />
                                                            </div>
                                                            <div className="flex gap-3">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        const stream = videoRef.current?.srcObject as MediaStream;
                                                                        stream?.getTracks().forEach(track => track.stop());
                                                                        setCameraActive(false);
                                                                    }}
                                                                >
                                                                    <X className="h-4 w-4 mr-2" />
                                                                    Cancel
                                                                </Button>
                                                                <Button type="button" onClick={capturePhoto} className="gap-2">
                                                                    <Camera className="h-4 w-4" />
                                                                    Capture Photo
                                                                </Button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <Button type="button" onClick={startCamera} size="lg" className="gap-2">
                                                            <Camera className="h-5 w-5" />
                                                            Open Camera
                                                        </Button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Check className="h-5 w-5 text-green-500" />
                                                        <h3 className="font-semibold">Photo Captured!</h3>
                                                    </div>

                                                    {isGeneratingAvatars ? (
                                                        <div className="flex flex-col items-center gap-4 py-8">
                                                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                                            <p className="text-sm text-muted-foreground">
                                                                AI is generating your avatars...
                                                            </p>
                                                        </div>
                                                    ) : generatedAvatars.length > 0 ? (
                                                        <>
                                                            <p className="text-sm text-muted-foreground mb-4">
                                                                Select an avatar for your bot:
                                                            </p>
                                                            <div className="grid grid-cols-3 gap-4">
                                                                {generatedAvatars.map((avatar, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className={`relative cursor-pointer rounded-lg border-2 transition-all ${selectedAvatarBase64 === avatar
                                                                            ? 'border-primary ring-2 ring-primary'
                                                                            : 'border-transparent hover:border-muted-foreground'
                                                                            }`}
                                                                        onClick={async () => {
                                                                            const url = await uploadSelectedAvatar(avatar);
                                                                            if (url) {
                                                                                setFinalAvatarUrl(url);
                                                                            }
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={avatar}
                                                                            alt={`Avatar ${index + 1}`}
                                                                            className="w-full h-auto rounded-lg"
                                                                        />
                                                                        {selectedAvatarBase64 === avatar && !isUploadingAvatar && finalAvatarUrl && (
                                                                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                                                                <Check className="h-4 w-4" />
                                                                            </div>
                                                                        )}
                                                                        {isUploadingAvatar && selectedAvatarBase64 === avatar && (
                                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                                                                <Loader2 className="h-8 w-8 animate-spin text-white" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </>
                                                    ) : generationError ? (
                                                        <div className="flex flex-col items-center py-4 space-y-3">
                                                            <p className="text-sm text-destructive font-medium">
                                                                Failed to generate avatars.
                                                            </p>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => generateAvatarsFromPhoto(capturedImage)}
                                                                className="h-8"
                                                            >
                                                                Retry Generation
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground">
                                                            Waiting for avatar generation...
                                                        </p>
                                                    )}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setCapturedImage("");
                                                            setGeneratedAvatars([]);
                                                            setFinalAvatarUrl("");
                                                            setSelectedAvatarBase64("");
                                                            setGenerationError(false);
                                                        }}
                                                        className="w-full"
                                                    >
                                                        Retake Photo
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => setStep(2)}
                                                disabled={isSubmitting}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting || !finalAvatarUrl}
                                                className="flex-1 gap-2"
                                            >
                                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                                Create AI Judge Bot
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
