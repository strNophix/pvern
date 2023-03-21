import { View, Text } from "react-native";
import tw from "twrnc";

interface CardProps {
  label?: string;
  children: React.ReactNode;
}

export default function Card({ label, children }: CardProps) {
  return (
    <>
      {label && <Text style={tw.style("ml-6 mt-4")}>{label}</Text>}
      <View
        style={tw.style("bg-white m-2 p-1 rounded-lg border border-slate-200")}
      >
        {children}
      </View>
    </>
  );
}
