import { useEffect } from "react";

import { Route } from "../../routes/app/onboarding/_layout.index";
import { getBack, getNext, type StepProps } from "./config";
import { OnboardingContainer } from "./shared";

export const STEP_ID_LOGIN = "login" as const;

export function Login({ onNavigate }: StepProps) {
  const search = Route.useSearch();

  useEffect(() => {
    const next = getNext(search);
    if (next) {
      onNavigate({ ...search, step: next });
    }
  }, [onNavigate, search]);

  const backStep = getBack(search);

  return (
    <OnboardingContainer
      title="Redirecting..."
      description="Please wait"
      onBack={
        backStep ? () => onNavigate({ ...search, step: backStep }) : undefined
      }
    >
      <></>
    </OnboardingContainer>
  );
}
