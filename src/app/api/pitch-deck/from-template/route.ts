import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import PitchDeckModel from "@/models/PitchDeckModel";
import { deckTemplates } from "@/data/deck-templates";
import { migrateDeck } from "@/lib/slide-migration";
import type { AnySlide } from "@/types/slide-elements";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { templateId, themeId } = body;

    const template = deckTemplates.find((t) => t.id === templateId);
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    const migratedSlides = migrateDeck(template.slides as AnySlide[]);

    const deck = await PitchDeckModel.create({
      userId: session.user._id,
      title: `${template.name} — Pitch Deck`,
      templateId: themeId || template.suggestedThemeId,
      slides: migratedSlides,
      companyData: {},
      status: "draft",
    });

    return NextResponse.json({
      message: "Deck created from template",
      deck: {
        _id: deck._id,
        title: deck.title,
        templateId: deck.templateId,
        slides: deck.slides,
        status: deck.status,
        createdAt: deck.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating deck from template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
