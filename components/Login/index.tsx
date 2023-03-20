import { View, Button, Text, TextInput } from "react-native";
import React, { useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { useTicketMut } from "../../hooks/useTicket";

export default function Login() {
  const [domain, setDomain] = useState("");
  const [username, setUsername] = useState("root@pam");
  const [password, setPassword] = useState("");

  const authStore = useAuthStore();
  const ticketMut = useTicketMut({
    onSuccess: ({ data: ticketData }) => {
      console.log({ ticketData });
      authStore.update({ domain, username, ticketData });
    },
  });

  return (
    <View>
      <Text>Hello</Text>
      <TextInput value={domain} onChangeText={setDomain} placeholder="Domain" />
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
      />
      <Button
        title="Login"
        onPress={() => ticketMut.mutate({ domain, username, password })}
      />
    </View>
  );
}
