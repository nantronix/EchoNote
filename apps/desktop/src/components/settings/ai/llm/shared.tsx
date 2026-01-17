import { Icon } from "@iconify-icon/react";
import {
  Anthropic,
  DeepSeek,
  Mistral,
  OpenAI,
  OpenRouter,
} from "@lobehub/icons";
import type { ReactNode } from "react";

import {
  type ProviderRequirement,
  requiresConfigField,
  requiresEntitlement,
} from "../shared/eligibility";
import { sortProviders } from "../shared/sort-providers";

type Provider = {
  id: string;
  displayName: string;
  badge: string | null;
  icon: ReactNode;
  baseUrl?: string;
  requirements: ProviderRequirement[];
};

const _PROVIDERS = [
  {
    id: "openrouter",
    displayName: "OpenRouter",
    badge: "Recommended",
    icon: <OpenRouter size={16} />,
    baseUrl: "https://openrouter.ai/api/v1",
    requirements: [{ kind: "requires_config", fields: ["api_key"] }],
  },
  {
    id: "openai",
    displayName: "OpenAI",
    badge: null,
    icon: <OpenAI size={16} />,
    baseUrl: "https://api.openai.com/v1",
    requirements: [{ kind: "requires_config", fields: ["api_key"] }],
  },
  {
    id: "anthropic",
    displayName: "Anthropic",
    badge: null,
    icon: <Anthropic size={16} />,
    baseUrl: "https://api.anthropic.com/v1",
    requirements: [{ kind: "requires_config", fields: ["api_key"] }],
  },
  {
    id: "mistral",
    displayName: "Mistral",
    badge: null,
    icon: <Mistral size={16} />,
    baseUrl: "https://api.mistral.ai/v1",
    requirements: [{ kind: "requires_config", fields: ["api_key"] }],
  },
  {
    id: "deepseek",
    displayName: "DeepSeek",
    badge: null,
    icon: <DeepSeek size={16} />,
    baseUrl: "https://api.deepseek.com/v1",
    requirements: [{ kind: "requires_config", fields: ["api_key"] }],
  },
  {
    id: "google_generative_ai",
    displayName: "Google Gemini",
    badge: null,
    icon: <Icon icon="simple-icons:googlegemini" width={16} />,
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    requirements: [{ kind: "requires_config", fields: ["api_key"] }],
  },
  {
    id: "custom",
    displayName: "Custom",
    badge: null,
    icon: <Icon icon="mingcute:random-fill" />,
    baseUrl: undefined,
    requirements: [
      { kind: "requires_config", fields: ["base_url", "api_key"] },
    ],
  },
] as const satisfies readonly Provider[];

export const PROVIDERS = sortProviders(_PROVIDERS);
export type ProviderId = (typeof _PROVIDERS)[number]["id"];

export const llmProviderRequiresPro = (providerId: ProviderId) => {
  const provider = PROVIDERS.find((p) => p.id === providerId);
  return provider ? requiresEntitlement(provider.requirements, "pro") : false;
};

export const llmProviderRequiresApiKey = (providerId: ProviderId) => {
  const provider = PROVIDERS.find((p) => p.id === providerId);
  return provider
    ? requiresConfigField(provider.requirements, "api_key")
    : false;
};
