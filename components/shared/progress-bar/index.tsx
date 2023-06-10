import { View, Text } from "react-native";
import tw from "twrnc";
import { formatPercentage } from "../../../lib/helper/format";

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  formatFn?: (input: number) => string;
}

export default function ProgressBar({
  label,
  value,
  max,
  formatFn,
}: ProgressBarProps) {
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
            width: `${(value / max) * 100}%`,
          })}
        />
      </View>
    </View>
  );
}
