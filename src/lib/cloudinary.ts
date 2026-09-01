import { v2 as cloudinary } from "cloudinary";

let configured = false;

/** Shared, lazily-configured Cloudinary client for both Next.js routes and the worker. */
export function getCloudinary() {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    configured = true;
  }
  return cloudinary;
}

/** Signed delivery URL for a private/authenticated document, for the worker to fetch source bytes. */
export function buildAuthenticatedDownloadUrl(
  publicId: string,
  resourceType: "image" | "raw"
): string {
  const cl = getCloudinary();
  return cl.url(publicId, {
    resource_type: resourceType,
    type: "authenticated",
    sign_url: true,
    secure: true,
  });
}
