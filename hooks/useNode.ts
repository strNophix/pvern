import { useQueries, useQuery } from "react-query";
import useAuthStore from "../stores/useAuthStore";

export type ResourceType = "LXC" | "QEMU";

export interface NodeResource {
  status: "stopped" | "running";
  vmid: number;
  name: string;
  tags: string;
  cpus: number;
  maxdisk: number;
  maxmem: number;
}

export interface NodeStatus {
  pveversion: string;
  kversion: string;
}

export interface NodeRDD {
  netin: number;
  netout: number;
  rootused: number;
  roottotal: number;
  memused: number;
  memtotal: number;
  cpu: number;
}

export function useNode(name: string) {
  const http = useAuthStore((state) => state.http);
  const [rdd, status, lxc, qemu] = useQueries([
    {
      queryKey: ["nodes", name, "rdd"],
      queryFn: () =>
        http.get<{ data: NodeRDD[] }>(`/api2/json/nodes/${name}/rrddata`, {
          params: {
            timeframe: "hour",
          },
        }),
      enabled: !!name,
      select: (data): NodeRDD => data.data.data.at(-1),
    },
    {
      queryKey: ["nodes", name, "status"],
      queryFn: () =>
        http.get<{ data: NodeStatus }>(`/api2/json/nodes/${name}/status`),
      enabled: !!name,
      select: (data): NodeStatus => data.data.data,
    },
    {
      queryKey: ["nodes", name, "lxc"],
      queryFn: () =>
        http.get<{ data: NodeResource[] }>(`/api2/json/nodes/${name}/lxc`),
      enabled: !!name,
      select: (data): NodeResource[] => data.data.data,
    },
    {
      queryKey: ["nodes", name, "qemu"],
      queryFn: () =>
        http.get<{ data: NodeResource[] }>(`/api2/json/nodes/${name}/qemu`),
      enabled: !!name,
      select: (data): NodeResource[] => data.data.data,
    },
  ]);

  return {
    rdd,
    status,
    lxc,
    qemu,
  };
}
