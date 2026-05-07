import type { WacColorScheme } from "web-accessible-components";
import type { WacTheme } from "web-accessible-components/dist/components/core/WacThemedComponent";

export function getTheme(): WacTheme {
  const styles = getComputedStyle(document.documentElement);

  const getValue = (property: keyof WacColorScheme) => {
    return getThemeProperty(property, styles);
  };

  return {
    background: getValue("background"),
    onBackground: getValue("onBackground"),
    onBackgroundVarient: getValue("onBackgroundVarient"),
    primary: getValue("primary"),
    onPrimary: getValue("onPrimary"),
    border: getValue("border"),
    fontFamily: styles.getPropertyValue("--font-family").trim(),
  };
}

export function getThemeProperty(
  property: keyof WacColorScheme,
  styles?: CSSStyleDeclaration,
): string {
  const propertyMap: Record<keyof WacColorScheme, string> = {
    background: "--background",
    onBackground: "--on-background",
    onBackgroundVarient: "--on-background-varient",
    primary: "--primary",
    onPrimary: "--on-primary",
    border: "--border",
  };

  return (styles ?? getComputedStyle(document.documentElement))
    .getPropertyValue(propertyMap[property])
    .trim();
}
