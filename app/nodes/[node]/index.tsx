import { Link, Stack, useSearchParams } from "expo-router";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { NodeResource, useNode } from "../../../hooks/useNode";
import Icon from "@expo/vector-icons/Feather";
import tw from "twrnc";
import { formatBytes, formatPercentage } from "../../../lib/helper/format";
import { useEffect, useMemo } from "react";

interface ResourceListItemProps {
  type: "LXC" | "QEMU";
  resource: NodeResource;
}

export function ResourceListItem({ type, resource }: ResourceListItemProps) {
  return (
    <View style={tw.style("flex-row items-center")}>
      <View
        style={tw.style(
          "h-12 w-12 rounded-lg flex flex-row justify-center items-center",
          resource.status === "running" ? "bg-green-200" : "bg-slate-200"
        )}
      >
        {type === "LXC" ? (
          <Icon name="package" size={22} />
        ) : (
          <Icon name="monitor" size={22} />
        )}
      </View>
      <View style={tw.style("ml-2")}>
        <Text style={tw.style("text-xl")}>
          {resource.vmid}: {resource.name}
        </Text>
        <View style={tw.style("flex flex-row")}>
          <Text style={tw.style("pr-2")}>CPUs: {resource.cpus}</Text>
          <Text style={tw.style("pr-2")}>
            MEM: {formatBytes(resource.maxmem)}
          </Text>
          <Text>DISK: {formatBytes(resource.maxdisk)}</Text>
        </View>
      </View>
    </View>
  );
}

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  formatFn?: (input: number) => string;
}

export function ProgressBar({ label, value, max, formatFn }: ProgressBarProps) {
  const percentage = formatPercentage(value / max);
  return (
    <View>
      <View
        style={tw.style("flex flex-row justify-between items-center mb-1 px-1")}
      >
        <Text>
          {label} ({percentage})
        </Text>
        {formatFn && (
          <Text>
            {formatFn(value)}/{formatFn(max)}
          </Text>
        )}
      </View>
      <View style={tw.style("h-3 w-full bg-slate-300 rounded-lg")}>
        <View
          style={tw.style("h-full bg-slate-700 rounded-lg", {
            width: percentage,
          })}
        />
      </View>
    </View>
  );
}

interface GaugeProps {
  label: string;
  value: string;
}

export function Gauge({ label, value }: GaugeProps) {
  return (
    <View>
      <Text>{label}</Text>
      <Text style={tw.style("text-2xl")}>{value}</Text>
    </View>
  );
}

export default function NodePage() {
  const { node: nodeName } = useSearchParams<{ node: string }>();
  const node = useNode(nodeName);

  const sortedLXCs = useMemo(() => {
    if (!node.lxc.isSuccess) return [];
    return node.lxc.data.sort((a, b) => a.vmid - b.vmid);
  }, [node.lxc.data]);

  const sortedVMs = useMemo(() => {
    if (!node.qemu.isSuccess) return [];
    return node.qemu.data.sort((a, b) => a.vmid - b.vmid);
  }, [node.qemu.data]);

  return (
    <View>
      <SafeAreaView>
        <ScrollView>
          <View
            style={tw.style(
              "bg-white m-2 p-3 rounded-lg border border-slate-200"
            )}
          >
            <Text style={tw.style("text-2xl font-semibold")}>{nodeName}</Text>
            {node.status.isSuccess && (
              <View style={tw.style("mb-4")}>
                <Text>{node.status.data.pveversion}</Text>
                <Text>{node.status.data.kversion}</Text>
              </View>
            )}
            {node.rdd.isSuccess && (
              <View>
                <View style={tw.style("mb-2")}>
                  <ProgressBar label="CPU" value={node.rdd.data.cpu} max={1} />
                </View>
                <View style={tw.style("mb-2")}>
                  <ProgressBar
                    label="Memory"
                    value={node.rdd.data.memused}
                    max={node.rdd.data.memtotal}
                    formatFn={formatBytes}
                  />
                </View>
                <View style={tw.style("mb-2")}>
                  <ProgressBar
                    label="Storage"
                    value={node.rdd.data.rootused}
                    max={node.rdd.data.roottotal}
                    formatFn={formatBytes}
                  />
                </View>
                <View
                  style={tw.style(
                    "flex flex-row justify-evenly items-center p-2"
                  )}
                >
                  <View style={tw.style("flex-1")}>
                    <Gauge
                      label="Up"
                      value={`${formatBytes(node.rdd.data.netout)}/s`}
                    />
                  </View>
                  <View style={tw.style("flex-1")}>
                    <Gauge
                      label="Down"
                      value={`${formatBytes(node.rdd.data.netin)}/s`}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
          <Text style={tw.style("ml-6 mt-4")}>LXC Containers</Text>
          <View
            style={tw.style(
              "bg-white m-2 p-1 rounded-lg border border-slate-200"
            )}
          >
            {sortedLXCs.map((lxc) => (
              <Link
                key={lxc.vmid}
                href={{
                  pathname: "/nodes/[name]/lxc/[vmid]",
                  params: { name: nodeName, vmid: lxc.vmid },
                }}
                style={tw.style("m-2")}
              >
                <ResourceListItem type="LXC" resource={lxc} />
              </Link>
            ))}
          </View>
          <Text style={tw.style("ml-6 mt-4")}>Virtual Machines</Text>
          <View
            style={tw.style(
              "bg-white m-2 p-1 rounded-lg border border-slate-200"
            )}
          >
            {sortedVMs.map((vm) => (
              <Link
                key={vm.vmid}
                href={{
                  pathname: "/nodes/[node]/lxc/[vmid]",
                  params: { node: nodeName, vmid: vm.vmid },
                }}
                style={tw.style("m-2")}
              >
                <ResourceListItem type="QEMU" resource={vm} />
              </Link>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
