import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@echonote/ui/components/ui/accordion";
import { cn } from "@echonote/utils";
import { OpenRouter } from "@lobehub/icons";

import { NonHyprProviderCard, StyledStreamdown } from "../shared";
import { useLlmSettings } from "./context";
import { ProviderId, PROVIDERS } from "./shared";

export function ConfigureProviders() {
  const { accordionValue, setAccordionValue } = useLlmSettings();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-md font-semibold font-serif">Configure Providers</h3>
      <Accordion
        type="single"
        collapsible
        className="space-y-3"
        value={accordionValue}
        onValueChange={setAccordionValue}
      >
        <RecommendedProviderCard
          providerId="openrouter"
          providerName="OpenRouter"
          icon={<OpenRouter size={16} />}
        />
        {PROVIDERS.filter((provider) => provider.id !== "openrouter").map(
          (provider) => (
            <NonHyprProviderCard
              key={provider.id}
              config={provider}
              providerType="llm"
              providers={PROVIDERS}
              providerContext={<ProviderContext providerId={provider.id} />}
            />
          ),
        )}
      </Accordion>
    </div>
  );
}

function RecommendedProviderCard({
  providerId,
  providerName,
  icon,
}: {
  providerId: ProviderId;
  providerName: string;
  icon: React.ReactNode;
}) {
  const { hyprAccordionRef } = useLlmSettings();

  return (
    <AccordionItem
      ref={hyprAccordionRef}
      value={providerId}
      className={cn([
        "rounded-xl border-2 bg-neutral-50",
        "border-solid border-neutral-300",
      ])}
    >
      <AccordionTrigger className="capitalize gap-2 px-4 hover:no-underline">
        <div className="flex items-center gap-2">
          {icon}
          <span>{providerName}</span>
          <span className="text-xs text-neutral-500 font-light border border-neutral-300 rounded-full px-2">
            Recommended
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4">
        <ProviderContext providerId={providerId} />
      </AccordionContent>
    </AccordionItem>
  );
}

function ProviderContext({ providerId }: { providerId: ProviderId }) {
  const content =
    providerId === "custom"
      ? "We only support **OpenAI-compatible** endpoints for now."
      : providerId === "openrouter"
        ? "We filter out models from the combobox based on heuristics like **input modalities** and **tool support**."
        : providerId === "google_generative_ai"
          ? "Visit [AI Studio](https://aistudio.google.com/api-keys) to create an API key."
          : "";

  if (!content) {
    return null;
  }

  return <StyledStreamdown>{content}</StyledStreamdown>;
}
