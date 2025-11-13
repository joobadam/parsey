import { auth } from "@/lib/auth";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const maxDuration = 60; // kell neki időt hogy el tudjon futni a GPT-5-nano

export async function POST(request) {
  try {
    // Auth check
    const session = await auth();
    if (!session) {
      console.error("[API] No session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text } = await request.json();

    console.log("[API] Received text:", text?.substring(0, 100) + "...");
    console.log("[API] Text length:", text?.length);
    console.log("[API] OpenAI key exists:", !!process.env.OPENAI_API_KEY);

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Empty text" }, { status: 400 });
    }

    console.log("[API] Starting receipt parsing...");

    // kategóriák lekérése a Supabase-ből
    const { data: categories, error: categoriesError } = await supabaseServer
      .from("categories")
      .select("name")
      .eq("user_id", session.user.id)
      .eq("type", "expense")
      .order("name");

    if (categoriesError) {
      console.error("[API] Error fetching categories:", categoriesError);
    }

    const categoryNames = categories?.map((c) => c.name) || [
      "Food & Dining",
      "Entertainment",
      "Travel",
      "Shopping",
      "Health",
      "Personal Care",
      "Other",
    ];

    console.log("[API] Available categories:", categoryNames);

    // 1. BASIC PARSING (merchant, amount, items)
    const { object: basicData } = await generateObject({
      model: openai("gpt-5-nano-2025-08-07"),
      schema: z.object({
        merchant: z.string().describe("Store/Company name"),
        amount: z.number().describe("Total amount (numerical value only)"),
        currency: z.string().describe("Currency (USD, EUR, HUF, etc.)"),
        items: z.array(z.string()).describe("Items listed"),
      }),
      prompt: `Extract receipt data:
      - merchant: Store/company name
      - amount: Total amount (number only)
      - currency: Currency code
      - items: List of items (max 5)

      Receipt text:
      ${text}`,
    });

    console.log("[API] Basic parsing done:", basicData);

    // 2. CATEGORY SUGGESTION (AI-alapú)
    const { object: categoryData } = await generateObject({
      model: openai("gpt-5-nano-2025-08-07"),
      schema: z.object({
        suggestedCategory: z.string().describe("Category name from the list"),
        confidence: z.number().min(0).max(1),
        reason: z.string().describe("Brief reason for this category"),
      }),
      prompt: `Based on this receipt, suggest the best category:

Available categories: ${categoryNames.join(", ")}

Merchant: ${basicData.merchant}
Items: ${basicData.items.join(", ")}

Choose the MOST appropriate category from the list above. Return the category name EXACTLY as shown in the list. If no category matches well, use "Other".`,
    });

    console.log("[API] Category suggestion:", categoryData);

    return NextResponse.json({
      merchant: basicData.merchant || "Receipt",
      amount: basicData.amount || 0,
      currency: basicData.currency || "HUF",
      items: basicData.items || [],
      suggestedCategory: categoryData.suggestedCategory || "Other",
      categoryConfidence: categoryData.confidence || 0.5,
      categoryReason: categoryData.reason || "",
    });
  } catch (error) {
    console.error("[API] Error:", error.message);
    console.error("[API] Error details:", error);

    // hibakezelés
    const isQuotaError =
      error.message?.includes("quota") ||
      error.message?.includes("insufficient_quota") ||
      error.cause?.code === "insufficient_quota";

    const errorMessage = isQuotaError
      ? "OpenAI API quota exceeded. Please check your billing or use manual entry."
      : error.message || "Failed to parse receipt";

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.toString(),
        isQuotaError,
      },
      { status: 500 }
    );
  }
}

 



  