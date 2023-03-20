import { useSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";
import useAuthStore from "../../../../../stores/useAuthStore";

function buildConsoleUrl(domain: string, node: string, vmid: string) {
  const url = new URL(domain);
  url.searchParams.append("node", node);
  url.searchParams.append("vmid", vmid);
  url.searchParams.append("resize", "1");
  url.searchParams.append("console", "lxc");
  url.searchParams.append("xtermjs", "1");
  return url.toString();
}

export default function QEMUResourceConsolePage() {
  const { name, vmid } = useSearchParams<{ name: string; vmid: string }>();
  const { domain, ticketData } = useAuthStore();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{
          uri: buildConsoleUrl(domain, name, vmid),
          headers: {
            Cookie: `PVEAuthCookie=${ticketData.data.ticket}`,
            CSRFPreventionToken: ticketData.data.CSRFPreventionToken,
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          },
        }}
        allowsFullscreenVideo={true}
        scalesPageToFit={false}
        injectedJavaScript={`
            const meta = document.createElement('meta'); 
            meta.setAttribute('content', 'width=width, initial-scale=0.5, maximum-scale=0.5, user-scalable=2.0');
            meta.setAttribute('name', 'viewport'); 
            document.getElementsByTagName('head')[0].appendChild(meta);
        `}
      />
    </SafeAreaView>
  );
}
