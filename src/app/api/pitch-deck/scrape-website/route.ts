import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Fetch the page with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let html: string;
    try {
      const res = await fetch(parsedUrl.toString(), {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; PitchDeskBot/1.0)",
          Accept: "text/html",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      html = await res.text();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch";
      return NextResponse.json(
        { error: `Could not fetch website: ${message}` },
        { status: 422 }
      );
    } finally {
      clearTimeout(timeout);
    }

    // Parse HTML without external dependencies
    const extract = (pattern: RegExp, source: string): string[] => {
      const matches: string[] = [];
      let match;
      while ((match = pattern.exec(source)) !== null) {
        const text = match[1]
          .replace(/<[^>]*>/g, "")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\s+/g, " ")
          .trim();
        if (text) matches.push(text);
      }
      return matches;
    };

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch
      ? titleMatch[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
      : "";

    // Extract meta description
    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i
    ) || html.match(
      /<meta[^>]*content=["']([\s\S]*?)["'][^>]*name=["']description["'][^>]*>/i
    );
    const description = descMatch ? descMatch[1].trim() : "";

    // Extract OG tags
    const ogTitle = (html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i) || [])[1] || "";
    const ogDescription = (html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i) || [])[1] || "";

    // Extract headings
    const headings = extract(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi, html).slice(0, 15);

    // Extract paragraphs
    const paragraphs = extract(/<p[^>]*>([\s\S]*?)<\/p>/gi, html)
      .filter((p) => p.length > 20)
      .slice(0, 10);

    // Extract list items
    const listItems = extract(/<li[^>]*>([\s\S]*?)<\/li>/gi, html).slice(0, 15);

    // Limit total text to ~3000 chars
    let totalChars = 0;
    const limit = 3000;
    const trimmed = (arr: string[]) => {
      const result: string[] = [];
      for (const item of arr) {
        if (totalChars + item.length > limit) break;
        result.push(item);
        totalChars += item.length;
      }
      return result;
    };

    totalChars += title.length + description.length;
    const trimmedHeadings = trimmed(headings);
    const trimmedParagraphs = trimmed(paragraphs);
    const trimmedListItems = trimmed(listItems);

    return NextResponse.json({
      title: title || ogTitle,
      description: description || ogDescription,
      headings: trimmedHeadings,
      paragraphs: trimmedParagraphs,
      listItems: trimmedListItems,
    });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
