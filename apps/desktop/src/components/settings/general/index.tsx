import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { disable, enable } from "@tauri-apps/plugin-autostart";
import { useTranslation } from "react-i18next";

import { commands as analyticsCommands } from "@echonote/plugin-analytics";
import { commands as listenerCommands } from "@echonote/plugin-listener";
import type { General, GeneralStorage } from "@echonote/store";

import { useConfigValues } from "../../../config/use-config";
import * as settings from "../../../store/tinybase/store/settings";
import { AccountSettings } from "./account";
import { AppLanguageView } from "./app-language";
import { AppSettingsView } from "./app-settings";
import { Audio } from "./audio";
import { MainLanguageView } from "./main-language";
import { NotificationSettingsView } from "./notification";
import { Permissions } from "./permissions";
import { SpokenLanguagesView } from "./spoken-languages";

type SettingsSection =
  | "app"
  | "language"
  | "notifications"
  | "permissions"
  | "audio"
  | "data"
  | "lab";

export function SettingsGeneral({
  appRef,
  languageRef,
  notificationsRef,
  permissionsRef,
  audioRef,
}: {
  appRef?: React.Ref<HTMLDivElement>;
  languageRef?: React.Ref<HTMLDivElement>;
  notificationsRef?: React.Ref<HTMLDivElement>;
  permissionsRef?: React.Ref<HTMLDivElement>;
  audioRef?: React.Ref<HTMLDivElement>;
  activeSection?: SettingsSection;
} = {}) {
  const { t } = useTranslation();
  const value = useConfigValues([
    "autostart",
    "notification_detect",
    "save_recordings",
    "telemetry_consent",
    "ai_language",
    "spoken_languages",
    "current_stt_provider",
  ] as const);

  const supportedLanguagesQuery = useQuery({
    queryKey: ["documented-language-codes", "live"],
    queryFn: async () => {
      const result = await listenerCommands.listDocumentedLanguageCodesLive();
      if (result.status === "error") {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: Infinity,
  });
  const supportedLanguages = supportedLanguagesQuery.data ?? ["en"];

  const suggestedProviders = useQuery({
    enabled: !!value.spoken_languages?.length,
    queryKey: ["suggested-stt-providers", value.spoken_languages],
    queryFn: async () => {
      const result = await listenerCommands.suggestProvidersForLanguagesLive(
        value.spoken_languages ?? [],
      );

      if (result.status === "error") {
        throw new Error(result.error);
      }

      return result.data.filter(
        (provider) => !["fireworks", "openai"].includes(provider),
      );
    },
  });

  const setPartialValues = settings.UI.useSetPartialValuesCallback(
    (row: Partial<General>) =>
      ({
        ...row,
        spoken_languages: row.spoken_languages
          ? JSON.stringify(row.spoken_languages)
          : undefined,
        ignored_platforms: row.ignored_platforms
          ? JSON.stringify(row.ignored_platforms)
          : undefined,
        ignored_recurring_series: row.ignored_recurring_series
          ? JSON.stringify(row.ignored_recurring_series)
          : undefined,
      }) satisfies Partial<GeneralStorage>,
    [],
    settings.STORE_ID,
  );

  const form = useForm({
    defaultValues: {
      autostart: value.autostart,
      notification_detect: value.notification_detect,
      save_recordings: value.save_recordings,
      telemetry_consent: value.telemetry_consent,
      ai_language: value.ai_language,
      spoken_languages: value.spoken_languages,
    },
    listeners: {
      onChange: ({ formApi }) => {
        const {
          form: { errors },
        } = formApi.getAllErrors();
        if (errors.length > 0) {
          console.log(errors);
        }
        void formApi.handleSubmit();
      },
    },
    onSubmit: ({ value }) => {
      setPartialValues(value);

      if (value.autostart) {
        void enable();
      } else {
        void disable();
      }

      void analyticsCommands.event({
        event: "settings_changed",
        autostart: value.autostart,
        notification_detect: value.notification_detect,
        save_recordings: value.save_recordings,
        telemetry_consent: value.telemetry_consent,
      });
      void analyticsCommands.setProperties({
        set: {
          telemetry_opt_out: value.telemetry_consent === false,
        },
      });
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="pt-3">
        <AccountSettings />
      </div>

      <div ref={appRef}>
        <form.Field name="autostart">
          {(autostartField) => (
            <form.Field name="notification_detect">
              {(notificationDetectField) => (
                <form.Field name="save_recordings">
                  {(saveRecordingsField) => (
                    <form.Field name="telemetry_consent">
                      {(telemetryConsentField) => (
                        <AppSettingsView
                          autostart={{
                            title: t("settings.general.app.autostart.title"),
                            description: t(
                              "settings.general.app.autostart.description",
                            ),
                            value: autostartField.state.value,
                            onChange: (val) => autostartField.handleChange(val),
                          }}
                          notificationDetect={{
                            title: t(
                              "settings.general.app.notificationDetect.title",
                            ),
                            description: t(
                              "settings.general.app.notificationDetect.description",
                            ),
                            value: notificationDetectField.state.value,
                            onChange: (val) =>
                              notificationDetectField.handleChange(val),
                          }}
                          saveRecordings={{
                            title: t(
                              "settings.general.app.saveRecordings.title",
                            ),
                            description: t(
                              "settings.general.app.saveRecordings.description",
                            ),
                            value: saveRecordingsField.state.value,
                            onChange: (val) =>
                              saveRecordingsField.handleChange(val),
                          }}
                          telemetryConsent={{
                            title: t(
                              "settings.general.app.telemetryConsent.title",
                            ),
                            description: t(
                              "settings.general.app.telemetryConsent.description",
                            ),
                            value: telemetryConsentField.state.value,
                            onChange: (val) =>
                              telemetryConsentField.handleChange(val),
                          }}
                        />
                      )}
                    </form.Field>
                  )}
                </form.Field>
              )}
            </form.Field>
          )}
        </form.Field>
      </div>

      <div ref={languageRef}>
        <h2 className="font-semibold font-serif mb-4">
          {t("settings.general.language.title")}
        </h2>
        <div className="space-y-6">
          <AppLanguageView />
          <form.Field name="ai_language">
            {(field) => (
              <MainLanguageView
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                supportedLanguages={supportedLanguages}
              />
            )}
          </form.Field>
          <form.Field name="spoken_languages">
            {(field) => (
              <>
                <SpokenLanguagesView
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  supportedLanguages={supportedLanguages}
                />
                <span className="text-xs text-neutral-500">
                  {t("settings.general.language.providerWarning", {
                    providers: suggestedProviders.data?.join(", "),
                  })}
                </span>
              </>
            )}
          </form.Field>
        </div>
      </div>

      <div ref={notificationsRef}>
        <h2 className="font-semibold font-serif mb-4">
          {t("settings.general.notifications.title")}
        </h2>
        <NotificationSettingsView />
      </div>

      <div ref={permissionsRef}>
        <Permissions />
      </div>

      <div ref={audioRef}>
        <Audio />
      </div>
    </div>
  );
}
