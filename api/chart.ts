// pages/api/chat.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NextApiRequest, NextApiResponse } from "next";

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GEMINI_API_KEY as string
);

type ResponseData = {
  reply: string;
};

type ErrorData = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ErrorData>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const userInput = req.body.message as string;

  if (!userInput) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(userInput);
    const response = result.response;
    const text = response.text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    res.status(500).json({ error: "Failed to generate content from AI." });
  }
}
