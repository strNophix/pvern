import { Link, useSearchParams } from "expo-router";
import { View, Text, ScrollView, TextInput } from "react-native";
import { NodeResource, ResourceType, useNode } from "../../../hooks/useNode";
import Icon from "@expo/vector-icons/Feather";
import tw from "twrnc";
import { formatBytes } from "../../../lib/helper/format";
import { useMemo, useState } from "react";
import { Gauge } from "../../../components/shared/gauge";
import ProgressBar from "../../../components/shared/progress-bar";
import Card from "../../../components/shared/card";

interface ResourceListItemProps {
  type: ResourceType;
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
        {type === "lxc" ? (
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

export default function NodePage() {
  const { node: nodeName } = useSearchParams<{ node: string }>();
  const node = useNode(nodeName);
  const [searchFilter, setSearchFilter] = useState("");

  const sortedLXCs = useMemo(() => {
    if (!node.lxc.isSuccess) return [];
    const filter = searchFilter.toLocaleLowerCase();
    return node.lxc.data
      .filter(
        (lxc) =>
          lxc.name.toLowerCase().includes(filter) ||
          lxc.vmid.toString().includes(filter)
      )
      .sort((a, b) => a.vmid - b.vmid);
  }, [node.lxc.data, searchFilter]);

  const sortedVMs = useMemo(() => {
    if (!node.qemu.isSuccess) return [];
    const filter = searchFilter.toLocaleLowerCase();
    return node.qemu.data
      .filter(
        (qemu) =>
          qemu.name.toLowerCase().includes(filter) ||
          qemu.vmid.toString().includes(filter)
      )
      .sort((a, b) => a.vmid - b.vmid);
  }, [node.qemu.data, searchFilter]);

  return (
    <ScrollView>
      <Card>
        <View style={tw.style("p-1")}>
          <View style={tw.style("px-1")}>
            <Text style={tw.style("text-2xl font-semibold")}>{nodeName}</Text>
            {node.status.isSuccess && (
              <View style={tw.style("mb-4")}>
                <Text>{node.status.data.pveversion}</Text>
                <Text>{node.status.data.kversion}</Text>
              </View>
            )}
          </View>
          {node.rddData.isSuccess && (
            <View>
              <View style={tw.style("mb-2")}>
                <ProgressBar
                  label="CPU"
                  value={node.rddData.data.cpu}
                  max={1}
                />
              </View>
              <View style={tw.style("mb-2")}>
                <ProgressBar
                  label="Memory"
                  value={node.rddData.data.memused}
                  max={node.rddData.data.memtotal}
                  formatFn={formatBytes}
                />
              </View>
              <View style={tw.style("mb-2")}>
                <ProgressBar
                  label="Storage"
                  value={node.rddData.data.rootused}
                  max={node.rddData.data.roottotal}
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
                    value={`${formatBytes(node.rddData.data.netout)}/s`}
                  />
                </View>
                <View style={tw.style("flex-1")}>
                  <Gauge
                    label="Down"
                    value={`${formatBytes(node.rddData.data.netin)}/s`}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </Card>
      <Card>
        <TextInput
          style={tw.style("px-3 py-2")}
          placeholder="Filter by VMID or name..."
          value={searchFilter}
          onChangeText={setSearchFilter}
        />
      </Card>
      <Card label="LXC Containers">
        {sortedLXCs.map((lxc) => (
          <Link
            key={lxc.vmid}
            href={{
              pathname: "/nodes/[node]/lxc/[vmid]",
              params: { node: nodeName, vmid: lxc.vmid },
            }}
            style={tw.style("m-2")}
          >
            <ResourceListItem type="lxc" resource={lxc} />
          </Link>
        ))}
      </Card>
      <Card label="Virtual Machine">
        {sortedVMs.map((vm) => (
          <Link
            key={vm.vmid}
            href={{
              pathname: "/nodes/[node]/qemu/[vmid]",
              params: { node: nodeName, vmid: vm.vmid },
            }}
            style={tw.style("m-2")}
          >
            <ResourceListItem type="qemu" resource={vm} />
          </Link>
        ))}
      </Card>
    </ScrollView>
  );
}
