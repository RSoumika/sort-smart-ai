import { createServerFn } from "@tanstack/react-start";
import OpenAI from "openai";
import type { ResponseInputItem } from "openai/resources/responses/responses";

export const identifyWasteFromImage = createServerFn({ method: "POST" })
  .validator((data: { imageDataUrl: string }) => {
    if (!data.imageDataUrl.startsWith("data:image/")) {
      throw new Error("Invalid image data.");
    }

    return data;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env["OPENAI_API_KEY"];

    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }

    const openai = new OpenAI({ apiKey });

    const input: ResponseInputItem[] = [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Identify the main waste item in this image.

Return only a short description of the item.
Do not give disposal advice.
If the item cannot be identified reliably, say "unknown".`,
          },
          {
            type: "input_image",
            image_url: data.imageDataUrl,
            detail: "auto",
          },
        ],
      },
    ];

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      input,
    });

    return response.output_text.trim();
  });
