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
  // const http = useAuthStore((state) => state.http);
  // const [rdd, status, lxc, qemu] = useQueries([
  //   {
  //     queryKey: ["nodes", name, "rdd"],
  //     queryFn: () =>
  //       http.get<{ data: NodeRDD[] }>(`/api2/json/nodes/${name}/rrddata`, {
  //         params: {
  //           timeframe: "hour",
  //         },
  //       }),
  //     enabled: !!name,
  //     select: (data): NodeRDD => data.data.data.at(-1),
  //   },
  //   {
  //     queryKey: ["nodes", name, "status"],
  //     queryFn: () =>
  //       http.get<{ data: NodeStatus }>(`/api2/json/nodes/${name}/status`),
  //     enabled: !!name,
  //     select: (data): NodeStatus => data.data.data,
  //   },
  //   {
  //     queryKey: ["nodes", name, "lxc"],
  //     queryFn: () =>
  //       http.get<{ data: NodeResource[] }>(`/api2/json/nodes/${name}/lxc`),
  //     enabled: !!name,
  //     select: (data): NodeResource[] => data.data.data,
  //   },
  //   {
  //     queryKey: ["nodes", name, "qemu"],
  //     queryFn: () =>
  //       http.get<{ data: NodeResource[] }>(`/api2/json/nodes/${name}/qemu`),
  //     enabled: !!name,
  //     select: (data): NodeResource[] => data.data.data,
  //   },
  // ]);

  // return {
  //   rdd,
  //   status,
  //   lxc,
  //   qemu,
  // };
  return {
    rdd: {
      data: {
        memused: 21691995750.4,
        roottotal: 100861726720,
        swaptotal: 8589930496,
        swapused: 315621376,
        rootused: 8778427323.73333,
        time: 1679347500,
        memtotal: 29306216448,
        iowait: 0.00668312957886097,
        netout: 41114.2883333333,
        loadavg: 0.586166666666667,
        cpu: 0.0151996855422636,
        maxcpu: 12,
        netin: 29321.46,
      },
      isSuccess: true,
    },
    lxc: {
      data: [
        {
          vmid: 101,
          cpus: 2,
          maxdisk: 8350298112,
          maxmem: 1073741824,
          name: "kibana",
          status: "running",
          tags: "",
        },
      ],
      isSuccess: true,
    },
    qemu: {
      data: [
        {
          vmid: 201,
          cpus: 2,
          maxdisk: 8350298112,
          maxmem: 1073741824,
          name: "vm",
          status: "running",
          tags: "",
        },
      ],
      isSuccess: true,
    },
    status: {
      data: {
        pveversion: "pve-manager/7.3-4/d69b70d4",
        kversion:
          "Linux 5.15.83-1-pve #1 SMP PVE 5.15.83-1 (2022-12-15T00:00Z)",
      },
      isSuccess: true,
    },
  };
}
