import { useEffect, useState } from "react";
import { creditAccountApi } from "@/features/credit/accounts/api/creditAccount.api";
import type { PartnerCreditSummaryDto } from "@/features/crm/partner/types/dto";

interface UsePartnerCreditSummaryResult {
  data?: PartnerCreditSummaryDto;
  loading: boolean;
  error?: Error;
  reload: () => void;
}

export function usePartnerCreditSummary(partnerId: string): UsePartnerCreditSummaryResult {
  const [data, setData] = useState<PartnerCreditSummaryDto | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [reloadFlag, setReloadFlag] = useState<number>(0);

  useEffect(() => {
    let mounted: boolean = true;
    setLoading(true);
    setError(undefined);

    creditAccountApi.getSummary(partnerId)
      .then((res) => {
        if (mounted) {
          setData(res);
        }
      })
      .catch((err: unknown) => {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Failed to load credit summary."));
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, [partnerId, reloadFlag]);

  const reload = (): void => {
    setReloadFlag((x) => x + 1);
  };

  return { data, loading, error, reload };
}
