import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const prompt = `
You are a grant-writing assistant.

Never invent facts.

If information is missing use:
[AGENCY TO PROVIDE: field]

Agency Name: ${data.agencyName}
State: ${data.state}
Urban/Rural: ${data.locationType}
Funding Goal: ${data.fundingGoal}
AI Idea: ${data.aiIdea}

Generate:
1. Statement of Need
2. Project Description
`;
if (!process.env.GEMINI_API_KEY) {
  return NextResponse.json(
    { error: "Missing GEMINI_API_KEY" },
    { status: 500 }
  );
}

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      draft: response.text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}