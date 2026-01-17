import { createContext, type ReactNode, useContext, useMemo } from "react";

type BillingContextValue = {
  entitlements: string[];
  isPro: boolean;
  upgradeToPro: () => void;
};

export type BillingAccess = BillingContextValue;

const BillingContext = createContext<BillingContextValue | null>(null);

export function BillingProvider({ children }: { children: ReactNode }) {
  const value = useMemo<BillingContextValue>(
    () => ({
      entitlements: ["echonote_pro"],
      isPro: true,
      upgradeToPro: () => {},
    }),
    [],
  );

  return (
    <BillingContext.Provider value={value}>{children}</BillingContext.Provider>
  );
}

export function useBillingAccess() {
  const context = useContext(BillingContext);

  if (!context) {
    throw new Error("useBillingAccess must be used within BillingProvider");
  }

  return context;
}
