import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@echonote/ui/components/ui/select";
import { useTranslation } from "react-i18next";

import { supportedLanguages } from "../../../i18n";

export function AppLanguageView() {
  const { t, i18n } = useTranslation();

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <h3 className="text-sm font-medium mb-1">
          {t("settings.general.language.appLanguage")}
        </h3>
        <p className="text-xs text-neutral-600">
          {t("settings.general.language.appLanguageDescription")}
        </p>
      </div>
      <Select value={i18n.language} onValueChange={handleChange}>
        <SelectTrigger className="w-40 shadow-none focus:ring-0 focus:ring-offset-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
