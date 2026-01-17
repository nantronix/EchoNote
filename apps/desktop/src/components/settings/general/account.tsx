import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export function AccountSettings() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <Container
        title={t("settings.general.account.title")}
        description={t("settings.general.account.description")}
      />
    </div>
  );
}

function Container({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-neutral-50 p-4 rounded-lg flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-md font-semibold font-serif">{title}</h1>
        {description && (
          <p className="text-sm text-neutral-600">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
