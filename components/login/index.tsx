import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TextInputProps,
  TouchableHighlight,
} from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import useAuthStore from "../../stores/useAuthStore";
import { useTicketMut } from "../../hooks/useTicket";
import {
  DEFAUL_PVE_URL,
  DEFAUL_PVE_USER,
  DEFAUL_PVE_PASSWORD,
} from "react-native-dotenv";

interface FormFieldProps extends TextInputProps {
  label: string;
}

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  inputMode,
}: FormFieldProps) {
  return (
    <>
      <Text style={tw.style("ml-2 mb-2 text-slate-500")}>{label}</Text>
      <TextInput
        style={tw.style(
          "border rounded-md border-slate-200 bg-slate-100 px-4 py-2 text-base"
        )}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        inputMode={inputMode}
      />
    </>
  );
}

export default function Login() {
  const [domain, setDomain] = useState(DEFAUL_PVE_URL ?? "");
  const [username, setUsername] = useState(DEFAUL_PVE_USER ?? "");
  const [password, setPassword] = useState(DEFAUL_PVE_PASSWORD ?? "");

  const authStore = useAuthStore();
  const ticketMut = useTicketMut({
    onSuccess: ({ data: ticketData }) => {
      console.log({ ticketData });
      authStore.update({ domain, username, ticketData });
    },
  });

  return (
    <View style={tw.style("flex-1 justify-center")}>
      <SafeAreaView style={tw.style("mx-4")}>
        <View style={tw.style("ml-2 mb-8")}>
          <Text style={tw.style("text-3xl font-semibold text-slate-700 mb-2")}>
            PVERN
          </Text>
          <Text style={tw.style("text-xl font-semibold text-slate-600")}>
            Sign In
          </Text>
        </View>
        <View style={tw.style("mb-5")}>
          <FormField
            inputMode="url"
            label="Server URL"
            placeholder="https://pve.example.com"
            value={domain}
            onChangeText={setDomain}
          />
        </View>
        <View style={tw.style("mb-5")}>
          <FormField
            autoComplete="username"
            label="Username"
            placeholder="root@pam"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={tw.style("mb-10")}>
          <FormField
            autoComplete="password"
            label="Password"
            placeholder="Strong and complicated password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableHighlight
          style={tw.style(
            "flex bg-slate-700 rounded-md flex flex-row items-center justify-center"
          )}
          onPress={() => ticketMut.mutate({ domain, username, password })}
        >
          <Text style={tw.style("text-white font-semibold py-3")}>Sign In</Text>
        </TouchableHighlight>
      </SafeAreaView>
    </View>
  );
}
