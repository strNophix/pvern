import { useQuery } from "react-query";
import useAuthStore from "../stores/useAuthStore";

export interface ProxmoxNode {
  node: string;
  status: "unknown" | "online" | "offline";
  cpu?: number;
  mem?: number;
  maxcpu?: number;
  maxmem?: number;
  uptime?: number;
}

interface GetNodeResp {
  data: ProxmoxNode[];
}

export function useNodes() {
  // const http = useAuthStore((state) => state.http);
  return useQuery(
    ["nodes"],
    async () => {
      // return http.get<GetNodeResp>("/api2/json/nodes")
      return {
        data: {
          data: [
            {
              cpu: 0.0166442953020134,
              mem: 21713018880,
              maxmem: 29306216448,
              uptime: 4854322,
              status: "online",
              maxcpu: 12,
              node: "pve",
            },
          ] as ProxmoxNode[],
        },
        isSuccess: true,
      };
    },
    { select: (data) => data.data.data, refetchInterval: 6000 }
  );
}
