import { Link } from "expo-router";
import { View, Text, SafeAreaView } from "react-native";
import { ProxmoxNode, useNodes } from "../../hooks/useNodes";
import Icon from "@expo/vector-icons/Feather";
import tw from "twrnc";
import { formatPercentage } from "../../lib/helper/format";
import { ScrollView } from "react-native-gesture-handler";
import Card from "../../components/Card";

export function NodeListItem({ node }: { node: ProxmoxNode }) {
  return (
    <View style={tw.style("flex-row items-center")}>
      <View
        style={tw.style(
          "h-12 w-12 rounded-lg flex flex-row justify-center items-center",
          node.status === "online" ? "bg-green-200" : "bg-slate-200"
        )}
      >
        {node.status !== "unknown" ? (
          <Icon name="server" size={22} />
        ) : (
          <Text style={tw.style("text-xl")}>?</Text>
        )}
      </View>
      <View style={tw.style("ml-2")}>
        <Text style={tw.style("text-xl")}>{node.node}</Text>
        <View style={tw.style("flex flex-row")}>
          <Text style={tw.style("pr-2")}>
            CPU: {formatPercentage(node.cpu)}
          </Text>
          <Text>MEM: {formatPercentage(node.mem / node.maxmem)}</Text>
        </View>
      </View>
    </View>
  );
}

export default function HomePage() {
  const nodes = useNodes();

  return (
    <ScrollView>
      <Card label="Nodes">
        {nodes.isSuccess &&
          nodes.data.map((node) => (
            <Link
              key={node.node}
              href={{
                pathname: "/nodes/[node]",
                params: { node: node.node },
              }}
              disabled={node.status !== "online"}
              style={tw.style("p-2")}
            >
              <NodeListItem node={node} />
            </Link>
          ))}
      </Card>

      <Card label="Storage">
        <View
          style={tw.style("flex flex-row justify-center items-center h-16")}
        >
          <Text>Currently not supported</Text>
        </View>
      </Card>
    </ScrollView>
  );
}
