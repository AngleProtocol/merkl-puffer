import { type WidgetConfig, WidgetSkeleton } from "@lifi/widget";
import { Suspense, lazy } from "react";

const LiFiWidgetLazy = lazy(async () => {
  const module = await import("@lifi/widget");

  return { default: module.LiFiWidget };
});

export function LiFiWidget() {
  const config: Partial<WidgetConfig> = {
    variant: "wide",
    subvariant: "default",
    appearance: "dark",
    theme: {
      palette: {
        primary: {
          main: "#ff9954",
        },
        secondary: {
          main: "#85b1ff",
        },
        background: {
          default: "#0d2252",
          paper: "#071534",
        },
        text: {
          primary: "#dfefff",
          secondary: "#85b1ff",
        },
        error: {
          main: "#ff4e4e",
        },
        info: {
          main: "#2f6cff",
        },
        common: {
          white: "#dfefff",
          black: "#0f1732",
        },
        grey: {
          200: "#d6eaff",
          300: "#85b1ff",
          700: "#2f6cff",
          800: "#0746ec",
        },
      },
      typography: {
        fontFamily: "Inter, sans-serif",
      },
      container: {
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
        borderRadius: "16px",
      },
      shape: {
        borderRadius: 8,
        borderRadiusSecondary: 60,
      },
    },
    fromChain: 1,
    toChain: 324,
    fromToken: "0x0000000000000000000000000000000000000000", // Native token
    toToken: "0x0000000000000000000000000000000000000000", // Native token
  };

  return (
    <Suspense fallback={<WidgetSkeleton config={config} />}>
      <LiFiWidgetLazy config={config} integrator="Merkl" />
    </Suspense>
  );
}
