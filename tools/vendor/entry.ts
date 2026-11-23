// Bundled into ../../vendor.js (window.BESTVendor) by `npm run build` in this folder.
// Loaded on demand by app.js for barcode scanning and photo calorie estimates.
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

const FoodItem = z.object({
  name: z.string().describe("Short food name, e.g. 'Grilled chicken breast'"),
  portion: z.string().describe("Estimated portion, e.g. '5 oz' or '1 cup'"),
  calories: z.number(),
  protein_g: z.number(),
  carbs_g: z.number(),
  fat_g: z.number(),
});
const PhotoEstimate = z.object({
  is_food: z.boolean().describe("False if the photo does not show food or drink"),
  items: z.array(FoodItem),
  confidence: z.enum(["low", "medium", "high"]),
  notes: z.string().describe("One short sentence on assumptions, e.g. hidden oils or portion uncertainty"),
});
export type PhotoEstimate = z.infer<typeof PhotoEstimate>;

const SYSTEM = `You estimate the nutrition of meals from photos for a personal food log.
Identify each distinct food or drink visible and estimate its portion from visual cues (plate size, utensils, hands, packaging).
Give calories and grams of protein, carbohydrate and fat for the portion shown, using typical USDA-style values.
Include likely cooking oils, sauces and dressings in the item they belong to. Round calories to the nearest 5 and grams to the nearest whole number.
If the user adds a note (for example the portion or how it was cooked), trust it over what you infer from the photo.
If the photo shows no food, set is_food to false and return no items.`;

export async function estimateFoodPhoto(apiKey: string, imageBase64: string, mediaType: "image/jpeg" | "image/png" | "image/webp", note: string): Promise<PhotoEstimate> {
  // The key is the user's own, kept only on their device; the app has no server to hold it.
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const response = await client.beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: betaZodOutputFormat(PhotoEstimate) },
    system: SYSTEM,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
        { type: "text", text: note ? `Estimate this meal. Note from me: ${note}` : "Estimate this meal." },
      ],
    }],
  });
  if (response.stop_reason === "refusal") throw new Error("Claude declined to analyze this photo.");
  if (response.stop_reason === "max_tokens") throw new Error("The estimate was cut off. Try again.");
  if (!response.parsed_output) throw new Error("Claude's reply couldn't be read. Try again.");
  return response.parsed_output;
}

export function describeError(err: unknown): string {
  if (err instanceof Anthropic.AuthenticationError) return "Your Anthropic API key was rejected. Check it in Food → Settings.";
  if (err instanceof Anthropic.PermissionDeniedError) return "This API key isn't allowed to use that model.";
  if (err instanceof Anthropic.RateLimitError) return "Too many requests or no API credit left. Try again shortly, or check your Anthropic billing.";
  if (err instanceof Anthropic.APIConnectionError) return "Couldn't reach Anthropic. Check your connection.";
  if (err instanceof Anthropic.APIError) return `Anthropic error ${err.status ?? ""}: ${err.message}`;
  return err instanceof Error ? err.message : String(err);
}

const PRODUCT_FORMATS = [BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.UPC_A, BarcodeFormat.UPC_E];
export function createBarcodeReader(): BrowserMultiFormatReader {
  const hints = new Map<DecodeHintType, unknown>([[DecodeHintType.POSSIBLE_FORMATS, PRODUCT_FORMATS], [DecodeHintType.TRY_HARDER, true]]);
  return new BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 150 });
}
