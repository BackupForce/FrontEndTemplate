// src/features/crm/partner/hooks/usePartnerDetail.ts
import { useEffect, useState } from "react";
import { getPartnerDetail } from "@/features/crm/partner/api/partner.api";
import type { PartnerDetailDto } from "@/features/crm/partner/types/dto";

interface UsePartnerDetailResult {
  data?: PartnerDetailDto;
  loading: boolean;
  error?: Error;
  reload: () => void;
}

export function usePartnerDetail(partnerId: string): UsePartnerDetailResult {
  const [data, setData] = useState<PartnerDetailDto | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [flag, setFlag] = useState<number>(0);

  useEffect(() => {
    let mounted: boolean = true;
    setLoading(true);
    setError(undefined);

    getPartnerDetail(partnerId)
      .then((res) => {
        if (mounted) {
          setData(res);
        }
      })
      .catch((err: unknown) => {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Failed to load partner detail."));
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, [partnerId, flag]);

  const reload = (): void => { setFlag((x) => x + 1); };

  return { data, loading, error, reload };
}
