import { useSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";
import useAuthStore from "../../../../../stores/useAuthStore";

function buildConsoleUrl(domain: string, node: string, vmid: string) {
  const params = new URLSearchParams({
    node: node,
    vmid: vmid,
    resize: "1",
    console: "lxc",
    xtermjs: "1",
  });
  return `${domain}?${params}`;
}

export default function QEMUResourceConsolePage() {
  const { node, vmid } = useSearchParams<{ node: string; vmid: string }>();
  const { domain, ticketData } = useAuthStore();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{
          uri: buildConsoleUrl(domain, node, vmid),
          headers: {
            Cookie: `PVEAuthCookie=${ticketData.data.ticket}`,
            CSRFPreventionToken: ticketData.data.CSRFPreventionToken,
          },
        }}
        sharedCookiesEnabled={true}
      />
    </SafeAreaView>
  );
}
