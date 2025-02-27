import { LogLine } from "../../types/log";
import {
  AvailableModel,
  ClientOptions,
  ModelProvider,
} from "../../types/model";
import { LLMCache } from "../cache/LLMCache";
import { AnthropicClient } from "./AnthropicClient";
import { CerebrasClient } from "./CerebrasClient";
import { LLMClient } from "./LLMClient";
import { OpenAIClient } from "./OpenAIClient";

const modelToProviderMap: { [key in AvailableModel]: ModelProvider } = {
  "gpt-4o": "openai",
  "gpt-4o-mini": "openai",
  "gpt-4o-2024-08-06": "openai",
  "o1-mini": "openai",
  "o1-preview": "openai",
  "o3-mini": "openai",
  "claude-3-5-sonnet-latest": "anthropic",
  "claude-3-5-sonnet-20240620": "anthropic",
  "claude-3-5-sonnet-20241022": "anthropic",
  "claude-3-7-sonnet-20250219": "anthropic",
  "cerebras-llama-3.3-70b": "cerebras",
  "cerebras-llama-3.1-8b": "cerebras",
  "groq-llama3-groq-70b-8192-tool-use-preview": "groq",
  "groq-gemma2-9b-it": "groq",
  "groq-llama3-8b-8192": "groq",
  "groq-llama-3.2-90b-vision-preview": "groq",
  "groq-llama3-70b-8192": "groq",
  "groq-llama-3.2-11b-vision-preview": "groq",
  "groq-llama-3.2-11b-text-preview": "groq",
  "groq-whisper-large-v3-turbo": "groq",
  "groq-llava-v1.5-7b-4096-preview": "groq",
  "groq-llama-3.1-70b-versatile": "groq",
  "groq-llama-3.2-3b-preview": "groq",
  "groq-whisper-large-v3": "groq",
  "groq-llama-guard-3-8b": "groq",
  "groq-mixtral-8x7b-32768": "groq",
  "groq-gemma-7b-it": "groq",
  "groq-distil-whisper-large-v3-en": "groq",
  "groq-llama-3.2-1b-preview": "groq",
  "groq-llama-3.2-90b-text-preview": "groq",
  "groq-llama3-groq-8b-8192-tool-use-preview": "groq",
  "groq-llama-3.1-8b-instant": "groq",
};

export class LLMProvider {
  private logger: (message: LogLine) => void;
  private enableCaching: boolean;
  private cache: LLMCache | undefined;

  constructor(logger: (message: LogLine) => void, enableCaching: boolean) {
    this.logger = logger;
    this.enableCaching = enableCaching;
    this.cache = enableCaching ? new LLMCache(logger) : undefined;
  }

  cleanRequestCache(requestId: string): void {
    if (!this.enableCaching) {
      return;
    }

    this.logger({
      category: "llm_cache",
      message: "cleaning up cache",
      level: 1,
      auxiliary: {
        requestId: {
          value: requestId,
          type: "string",
        },
      },
    });
    this.cache.deleteCacheForRequestId(requestId);
  }

  getClient(
    modelName: AvailableModel,
    clientOptions?: ClientOptions,
  ): LLMClient {
    const provider = modelToProviderMap[modelName];
    if (!provider) {
      throw new Error(`Unsupported model: ${modelName}`);
    }

    switch (provider) {
      case "openai":
        return new OpenAIClient({
          logger: this.logger,
          enableCaching: this.enableCaching,
          cache: this.cache,
          modelName,
          clientOptions,
        });
      case "anthropic":
        return new AnthropicClient({
          logger: this.logger,
          enableCaching: this.enableCaching,
          cache: this.cache,
          modelName,
          clientOptions,
        });
      case "cerebras":
        return new CerebrasClient({
          logger: this.logger,
          enableCaching: this.enableCaching,
          cache: this.cache,
          modelName,
          clientOptions,
        });
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  static getModelProvider(modelName: AvailableModel): ModelProvider {
    const provider = modelToProviderMap[modelName];

    return provider;
  }
}
