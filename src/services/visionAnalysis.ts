import { z } from "zod";
export const visionInput = z.object({
  imageDataUrl: z
    .string()
    .max(3_000_000)
    .regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/),
});
export const visionSchema = z.object({
  identified: z.boolean(),
  item: z.string().max(120),
  material: z.enum(["plastic", "glass", "metal", "paper", "organic", "mixed", "unknown"]),
});
export type VisionResult = { ok: true; description: string } | { ok: false; message: string };
export async function detectImage(
  imageDataUrl: string,
  generate?: (url: string) => Promise<unknown>,
): Promise<VisionResult> {
  if (!visionInput.safeParse({ imageDataUrl }).success)
    return {
      ok: false,
      message:
        "The image could not be read or is too large. Choose a smaller JPG, PNG or WEBP image.",
    };
  if (!generate)
    return {
      ok: false,
      message:
        "Photo recognition is not configured. Set OPENAI_API_KEY on the server and restart the app, or use Describe it.",
    };
  try {
    const parsed = visionSchema.safeParse(await generate(imageDataUrl));
    if (
      !parsed.success ||
      !parsed.data.identified ||
      !parsed.data.item.trim() ||
      /^unknown[.!]?$/i.test(parsed.data.item.trim())
    )
      return {
        ok: false,
        message:
          "I couldn't identify the item clearly. Try a closer, well-lit photo with one item, or use Describe it.",
      };
    const { item, material } = parsed.data;
    const name = item.trim();
    return {
      ok: true,
      description:
        material !== "unknown" && !name.toLowerCase().includes(material)
          ? `${material} ${name}`
          : name,
    };
  } catch (error) {
    const e = error as { status?: number; name?: string } | null;
    let message = "Photo recognition is temporarily unavailable. Please retry or use Describe it.";
    if (e?.status === 401)
      message = "The server's OpenAI API key was rejected. Replace it and restart the app.";
    else if (e?.status === 403 || e?.status === 404)
      message =
        "The photo model is unavailable to this API account. Check OPENAI_VISION_MODEL and model access.";
    else if (e?.status === 429)
      message =
        "Photo recognition reached an API usage or billing limit. Check the OpenAI account or retry later.";
    else if (e?.name === "APIConnectionTimeoutError")
      message = "Photo recognition timed out. Try again with a smaller photo.";
    return { ok: false, message };
  }
}
