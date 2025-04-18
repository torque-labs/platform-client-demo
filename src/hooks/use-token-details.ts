import { useQuery } from "@tanstack/react-query";

import { getTokenDetails } from "#/actions/tokens";

export function useTokenDetails({ address, enabled }: { address: string; enabled: boolean }) {
  return useQuery({
    queryKey: ["token-details", address],
    queryFn: () => getTokenDetails(address),
    enabled: !!address && enabled,
  });
}
