import { theme, type ThemeConfig } from "antd";

import { getReadableTextColor } from "@/lib/color";
import type { TenantConfig } from "@/types/tenant";

import { CONTROL_HEIGHT, FONT_STACK, RADIUS, palettes } from "./tokens";

/**
 * Maps our design tokens onto Ant Design's token system so AntD components
 * (Table, Form, Select, DatePicker, Drawer …) look like part of the product,
 * and follow the active tenant's brand color.
 */
export function buildAntdTheme(config: TenantConfig): ThemeConfig {
  const p = palettes[config.theme];
  const isDark = config.theme === "dark";
  const onPrimary = getReadableTextColor(config.primaryColor);

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: config.primaryColor,
      colorInfo: config.primaryColor,
      colorSuccess: p.markSuccess,
      colorWarning: p.markWarning,
      colorError: p.markDanger,

      colorBgLayout: p.canvas,
      colorBgContainer: p.surface,
      colorBgElevated: p.surface,
      colorBorder: p.borderStrong,
      colorBorderSecondary: p.border,
      colorSplit: p.border,

      colorText: p.fg,
      colorTextSecondary: p.fgSecondary,
      colorTextTertiary: p.fgMuted,
      colorTextQuaternary: p.fgMuted,
      colorTextPlaceholder: p.fgMuted,

      fontFamily: FONT_STACK,
      fontSize: 14,
      borderRadius: RADIUS.md,
      borderRadiusSM: RADIUS.sm,
      borderRadiusLG: RADIUS.lg,
      controlHeight: CONTROL_HEIGHT,

      boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
      boxShadowSecondary: "0 12px 32px rgba(16, 24, 40, 0.12)",
      motionDurationMid: "0.15s",
    },
    components: {
      Button: {
        fontWeight: 500,
        primaryShadow: "none",
        defaultShadow: "none",
        dangerShadow: "none",
        primaryColor: onPrimary,
        paddingInline: 16,
        defaultBg: p.surface,
        defaultColor: p.fg,
        defaultBorderColor: p.borderStrong,
        defaultHoverBg: p.surfaceHover,
        defaultHoverColor: p.fg,
        defaultHoverBorderColor: p.borderStrong,
        defaultActiveBg: p.surfaceHover,
        defaultActiveColor: p.fg,
        defaultActiveBorderColor: p.borderStrong,
        textHoverBg: p.surfaceHover,
      },
      Input: {
        paddingInline: 12,
        colorBgContainer: p.surface,
      },
      Select: {
        optionSelectedFontWeight: 500,
        optionActiveBg: p.surfaceHover,
      },
      Table: {
        headerBg: p.surfaceMuted,
        headerColor: p.fgMuted,
        headerSplitColor: "transparent",
        headerBorderRadius: 0,
        rowHoverBg: p.surfaceHover,
        borderColor: p.border,
        cellPaddingBlock: 14,
        cellPaddingInline: 16,
        cellFontSize: 14,
        footerBg: p.surface,
      },
      Form: {
        labelColor: p.fg,
        labelFontSize: 13,
        verticalLabelPadding: "0 0 6px",
        itemMarginBottom: 24,
      },
      Modal: {
        titleFontSize: 16,
        headerBg: p.surface,
        contentBg: p.surface,
      },
      Drawer: {
        colorBgElevated: p.surface,
      },
      Skeleton: {
        gradientFromColor: p.surfaceHover,
        gradientToColor: p.border,
      },
      Segmented: {
        trackBg: p.neutralSoft,
        itemSelectedBg: p.surface,
        itemSelectedColor: p.fg,
        itemColor: p.fgSecondary,
      },
      Dropdown: {
        paddingBlock: 6,
      },
    },
  };
}
