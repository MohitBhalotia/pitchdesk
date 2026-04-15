import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  const page = req.nextUrl.searchParams.get("page") || "1";

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    // Fallback to placeholder images when no API key is set
    return NextResponse.json({
      results: Array.from({ length: 12 }, (_, i) => ({
        id: `placeholder-${i}`,
        url: `https://picsum.photos/seed/${encodeURIComponent(query)}-${i}/400/300`,
        thumb: `https://picsum.photos/seed/${encodeURIComponent(query)}-${i}/200/150`,
        author: "Picsum Photos",
        authorUrl: "https://picsum.photos",
      })),
    });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=20&orientation=landscape`,
      {
        headers: { Authorization: `Client-ID ${accessKey}` },
        next: { revalidate: 3600 }, // cache for 1 hour
      }
    );

    if (!res.ok) {
      throw new Error(`Unsplash API error: ${res.status}`);
    }

    const data = await res.json();

    const results = data.results.map((photo: {
      id: string;
      urls: { regular: string; thumb: string };
      user: { name: string; links: { html: string } };
    }) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      author: photo.user.name,
      authorUrl: photo.user.links.html,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Image search failed:", error);
    return NextResponse.json({ error: "Image search failed" }, { status: 500 });
  }
}
