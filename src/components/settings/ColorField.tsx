"use client";

import { ColorPicker } from "antd";

import { normalizeHex } from "@/lib/color";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { BRAND_COLOR_PRESETS } from "@/lib/tenant/tenants";

interface ColorFieldProps {
  value: string;
  onChange: (hex: string) => void;
  /** Shown under the picker, e.g. a contrast warning. */
  warning?: string;
}

export function ColorField({ value, onChange, warning }: ColorFieldProps) {
  const { t } = useI18n();

  return (
    <div>
      <ColorPicker
        value={value}
        disabledAlpha
        showText
        onChange={(color) => onChange(normalizeHex(color.toHexString()))}
        presets={[{ label: t("settings.colorPresets"), colors: BRAND_COLOR_PRESETS }]}
      />
      {warning && <p className="mt-2 text-caption text-warning">{warning}</p>}
    </div>
  );
}
