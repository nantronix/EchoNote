import { ArrowRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@echonote/ui/components/ui/button";

import type { LLMConnectionStatus } from "../../../../../../hooks/useLLMConnection";
import { useTabs } from "../../../../../../store/zustand/tabs";

export function ConfigError({ status }: { status: LLMConnectionStatus }) {
  const { t } = useTranslation();
  const openNew = useTabs((state) => state.openNew);

  const handleConfigureClick = () => {
    openNew({ type: "ai", state: { tab: "intelligence" } });
  };

  const getMessage = (): string => {
    if (status.status === "pending" && status.reason === "missing_provider") {
      return t("session.configureProvider");
    }

    if (status.status === "pending" && status.reason === "missing_model") {
      return t("session.selectModel");
    }

    if (status.status === "error" && status.reason === "missing_config") {
      const missing = status.missing;
      if (missing.includes("api_key") && missing.includes("base_url")) {
        return t("session.configureApiKeyAndBaseUrl");
      }
      if (missing.includes("api_key")) {
        return t("session.configureApiKey");
      }
      if (missing.includes("base_url")) {
        return t("session.configureBaseUrl");
      }
    }

    return t("session.configureProvider");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
      <p className="text-sm text-center text-neutral-700 mb-6 max-w-lg">
        {getMessage()}
      </p>
      <Button
        onClick={handleConfigureClick}
        className="flex items-center gap-2"
        variant="default"
      >
        <span>{t("session.configure")}</span>
        <ArrowRightIcon size={16} />
      </Button>
    </div>
  );
}
