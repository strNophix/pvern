import { useRouter, useSearchParams } from "expo-router";
import { useMemo } from "react";
import { View, Text, TouchableHighlight, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/Feather";
import tw from "twrnc";
import Card from "../../../../../components/shared/card";
import { Gauge } from "../../../../../components/shared/gauge";
import ProgressBar from "../../../../../components/shared/progress-bar";
import { useNode } from "../../../../../hooks/useNode";
import { useResource } from "../../../../../hooks/useResource";
import { formatBytes } from "../../../../../lib/helper/format";

export default function LXCResourcePage() {
  const router = useRouter();
  const { node, vmid } = useSearchParams<{ node: string; vmid: string }>();
  const { rddData, config } = useResource(node, "lxc", vmid);
  const { lxc: lxcs } = useNode(node);

  const status = useMemo(() => {
    if (lxcs.isSuccess) {
      return lxcs.data.find((lxc) => lxc.vmid.toString() === vmid);
    }
  }, [lxcs]);

  return (
    <ScrollView>
      <Card>
        <View style={tw.style("p-1")}>
          <View style={tw.style("px-1 mb-4")}>
            <View style={tw.style("flex flex-row items-center")}>
              <View
                style={tw.style(
                  "h-12 w-12 rounded-lg flex flex-row justify-center items-center",
                  status.status === "running" ? "bg-green-200" : "bg-slate-200"
                )}
              >
                <Icon name="monitor" size={22} />
              </View>
              <View style={tw.style("mx-2 flex-1")}>
                <Text style={tw.style("text-xl")}>
                  {vmid}: {status.name}
                </Text>
                <Text style={tw.style("text-base")}>Node: {node}</Text>
              </View>
              <View
                style={tw.style(
                  "h-12 w-12 flex flex-row justify-center items-center"
                )}
              >
                <Icon name="power" size={22} />
              </View>
            </View>
          </View>
          {rddData.isSuccess && (
            <View>
              <View style={tw.style("mb-2")}>
                <ProgressBar label="CPU" value={rddData.data.cpu} max={1} />
              </View>
              <View style={tw.style("mb-2")}>
                <ProgressBar
                  label="Memory"
                  value={rddData.data.mem ?? 1}
                  max={rddData.data.maxmem ?? 1}
                  formatFn={formatBytes}
                />
              </View>
              <View style={tw.style("mb-2")}>
                <ProgressBar
                  label="Storage"
                  value={rddData.data.disk ?? 1}
                  max={rddData.data.maxdisk ?? 1}
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
                    value={`${formatBytes(rddData.data.netout)}/s`}
                  />
                </View>
                <View style={tw.style("flex-1")}>
                  <Gauge
                    label="Down"
                    value={`${formatBytes(rddData.data.netin)}/s`}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </Card>

      <TouchableHighlight
        style={tw.style("m-2 rounded-lg bg-slate-800")}
        onPress={() =>
          router.push({
            pathname: "/nodes/[node]/lxc/[vmid]/console",
            params: { node, vmid },
          })
        }
      >
        <View style={tw.style("flex flex-row m-4 items-center justify-center")}>
          <Icon name="terminal" size={22} style={tw.style("mr-2 text-white")} />
          <Text style={tw.style("text-white")}>Open terminal</Text>
        </View>
      </TouchableHighlight>

      <Card>
        <View style={tw.style("m-2")}>
          {config.isSuccess &&
            Object.entries(config.data).map(([key, val]) => {
              return (
                <View key={key} style={tw.style("mb-1")}>
                  <Text style={tw.style("text-lg")}>{key}:</Text>
                  <Text>{val}</Text>
                </View>
              );
            })}
        </View>
      </Card>
    </ScrollView>
  );
}
