import { useQueries } from "react-query";
import useAuthStore from "../stores/useAuthStore";
import { ResourceType } from "./useNode";

interface ResourceRddData {
  cpu: number;
  disk: number;
  maxdisk: number;
  mem: number;
  maxmem: number;
  netin: number;
  netout: number;
}

export function useResource(
  node: string,
  type: ResourceType,
  vmid: string | number
) {
  console.log({ node, type, vmid });
  const http = useAuthStore((state) => state.http);
  const [rddData, config] = useQueries([
    {
      queryKey: ["nodes", node, type, vmid, "rdd"],
      queryFn: () =>
        http.get<{ data: ResourceRddData[] }>(
          `/api2/json/nodes/${node}/${type}/${vmid}/rrddata`,
          {
            params: {
              timeframe: "hour",
            },
          }
        ),
      enabled: !!(node && vmid),
      select: (data): ResourceRddData => data.data.data.at(-1),
    },
    {
      queryKey: ["nodes", node, type, vmid, "config"],
      queryFn: () =>
        http.get<{ data: object }>(
          `/api2/json/nodes/${node}/${type}/${vmid}/config`
        ),
      enabled: !!(node && vmid),
      select: (data): object => data.data.data,
    },
  ]);

  return {
    rddData,
    config,
  };
}
