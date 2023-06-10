import { View, Text } from "react-native";
import tw from "twrnc";

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
