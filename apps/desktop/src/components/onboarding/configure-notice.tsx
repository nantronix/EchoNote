import { useTranslation } from "react-i18next";

import { Route } from "../../routes/app/onboarding/_layout.index";
import { getBack, getNext, type StepProps } from "./config";
import { OnboardingContainer } from "./shared";

export const STEP_ID_CONFIGURE_NOTICE = "configure-notice" as const;

export function ConfigureNotice({ onNavigate }: StepProps) {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const backStep = getBack(search);

  return (
    <OnboardingContainer
      title={t("onboarding.configureNotice.title")}
      onBack={
        backStep ? () => onNavigate({ ...search, step: backStep }) : undefined
      }
    >
      <div className="flex flex-col gap-4">
        <Requirement
          title={t("onboarding.configureNotice.sttModel")}
          description={t("onboarding.configureNotice.sttDescription")}
          required
          requiredLabel={t("onboarding.configureNotice.required")}
          optionalLabel={t("onboarding.configureNotice.optional")}
        />
        <Requirement
          title={t("onboarding.configureNotice.llmModel")}
          description={t("onboarding.configureNotice.llmDescription")}
          requiredLabel={t("onboarding.configureNotice.required")}
          optionalLabel={t("onboarding.configureNotice.optional")}
        />
      </div>

      <p className="text-sm text-neutral-500 mt-4">
        {t("onboarding.configureNotice.configureInSettings")}
      </p>

      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={() => onNavigate({ ...search, step: getNext(search)! })}
          className="w-full py-3 rounded-full bg-gradient-to-t from-stone-600 to-stone-500 text-white text-sm font-medium duration-150 hover:scale-[1.01] active:scale-[0.99]"
        >
          {t("common.continue")}
        </button>
      </div>
    </OnboardingContainer>
  );
}

function Requirement({
  title,
  description,
  required,
  requiredLabel = "Required",
  optionalLabel = "Optional",
}: {
  title: string;
  description: string;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
}) {
  return (
    <div className="relative border border-neutral-200 rounded-xl py-3 px-4 flex flex-col gap-1">
      {required ? (
        <span className="absolute -top-2 left-3 px-1.5 bg-white text-xs text-red-500">
          {requiredLabel}
        </span>
      ) : (
        <span className="absolute -top-2 left-3 px-1.5 bg-white text-xs text-neutral-400">
          {optionalLabel}
        </span>
      )}
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-neutral-500">{description}</p>
    </div>
  );
}
