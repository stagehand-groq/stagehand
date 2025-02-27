import type { ClientOptions as AnthropicClientOptions } from "@anthropic-ai/sdk";
import type { ClientOptions as OpenAIClientOptions } from "openai";
import { z } from "zod";

export const AvailableModelSchema = z.enum([
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4o-2024-08-06",
  "claude-3-5-sonnet-latest",
  "claude-3-5-sonnet-20241022",
  "claude-3-5-sonnet-20240620",
  "claude-3-7-sonnet-20250219",
  "o1-mini",
  "o1-preview",
  "o3-mini",
  "cerebras-llama-3.3-70b",
  "cerebras-llama-3.1-8b",
  "groq-llama3-groq-70b-8192-tool-use-preview",
  "groq-gemma2-9b-it",
  "groq-llama3-8b-8192",
  "groq-llama-3.2-90b-vision-preview",
  "groq-llama3-70b-8192",
  "groq-llama-3.2-11b-vision-preview",
  "groq-llama-3.2-11b-text-preview",
  "groq-whisper-large-v3-turbo",
  "groq-llava-v1.5-7b-4096-preview",
  "groq-llama-3.1-70b-versatile",
  "groq-llama-3.2-3b-preview",
  "groq-whisper-large-v3",
  "groq-llama-guard-3-8b",
  "groq-mixtral-8x7b-32768",
  "groq-gemma-7b-it",
  "groq-distil-whisper-large-v3-en",
  "groq-llama-3.2-1b-preview",
  "groq-llama-3.2-90b-text-preview",
  "groq-llama3-groq-8b-8192-tool-use-preview",
  "groq-llama-3.1-8b-instant",
]);

export type AvailableModel = z.infer<typeof AvailableModelSchema>;

export type ModelProvider = "openai" | "anthropic" | "cerebras" | "groq";

export type ClientOptions = OpenAIClientOptions | AnthropicClientOptions;

export interface AnthropicJsonSchemaObject {
  definitions?: {
    MySchema?: { properties?: Record<string, unknown>; required?: string[] };
  };
  properties?: Record<string, unknown>;
  required?: string[];
}
