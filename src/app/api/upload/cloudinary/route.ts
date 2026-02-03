import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.error("Missing Cloudinary credentials");
            return NextResponse.json({ error: "Server configuration error: Missing Cloudinary keys" }, { status: 500 });
        }

        const body = await req.json();
        const { imageBase64, fileName } = body;

        if (!imageBase64) {
            return NextResponse.json({ error: "Image data required" }, { status: 400 });
        }

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(imageBase64, {
            folder: 'vc-bot-avatars',
            public_id: fileName || `avatar-${Date.now()}`,
            resource_type: 'image',
            transformation: [
                { width: 512, height: 512, crop: 'fill', gravity: 'face' },
                { quality: 'auto', fetch_format: 'auto' }
            ]
        });

        return NextResponse.json({
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            success: true
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json(
            { error: "Image upload failed", details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
