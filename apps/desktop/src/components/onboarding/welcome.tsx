import { commands as analyticsCommands } from "@echonote/plugin-analytics";
import { version as osVersion, platform } from "@tauri-apps/plugin-os";
import { memo, useCallback, useEffect } from "react";

import { usePermissions } from "../../hooks/usePermissions";
import { Route } from "../../routes/app/onboarding/_layout.index";
import { commands } from "../../types/tauri.gen";
import { getNext, type StepProps } from "./config";

export const STEP_ID_WELCOME = "welcome" as const;

export const Welcome = memo(function Welcome({ onNavigate }: StepProps) {
  const search = Route.useSearch();

  const {
    micPermissionStatus,
    systemAudioPermissionStatus,
    accessibilityPermissionStatus,
  } = usePermissions();

  const hasAnyPermissionGranted =
    micPermissionStatus.data === "authorized" ||
    systemAudioPermissionStatus.data === "authorized" ||
    accessibilityPermissionStatus.data === "authorized";

  useEffect(() => {
    const fetchLocal = async () => {
      const local = await commands
        .getOnboardingLocal()
        .then((result) => result.status === "ok" && result.data);

      onNavigate({
        ...search,
        local,
        skipAutoForward: false,
        step: getNext(search)!,
      });
    };

    if (hasAnyPermissionGranted && !search.skipAutoForward) {
      void fetchLocal();
    }
  }, [hasAnyPermissionGranted, onNavigate, search]);

  const handleGetStarted = useCallback(async () => {
    await commands.setOnboardingLocal(true);
    void analyticsCommands.setProperties({
      set: {
        is_local_mode: true,
        platform: platform(),
        os_version: osVersion(),
      },
    });
    const next = { ...search, local: true };
    onNavigate({ ...next, step: getNext(next)! });
  }, [onNavigate, search]);

  return (
    <>
      <img
        src="/assets/logo.svg"
        alt="EchoNote"
        className="mb-6 w-[300px]"
        draggable={false}
      />

      <p className="mb-16 text-center text-xl font-medium text-neutral-600">
        Where Conversations Stay Yours
      </p>

      <button
        onClick={handleGetStarted}
        className="w-full py-3 rounded-full bg-gradient-to-t from-stone-600 to-stone-500 text-white text-sm font-medium duration-150 hover:scale-[1.01] active:scale-[0.99]"
      >
        Get Started
      </button>
    </>
  );
});
