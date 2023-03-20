import { View, Text } from "react-native";
import tw from "twrnc";

export default function LXCResourcePage() {
  return (
    <View>
      <View
        style={tw.style("bg-white m-2 p-3 rounded-lg border border-slate-200")}
      >
        <Text>Currently not supported</Text>
      </View>

      <Text style={tw.style("ml-6 mt-4")}>Config</Text>
      <View
        style={tw.style("bg-white m-2 p-1 rounded-lg border border-slate-200")}
      >
        <Text style={tw.style("px-2 py-7 flex flex-row text-center")}>
          Currently not supported
        </Text>
      </View>
    </View>
  );
}
