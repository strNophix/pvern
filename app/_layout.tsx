import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "react-query";
import Auth from "../components/Login";
import useAuthStore from "../stores/useAuthStore";
import Icon from "@expo/vector-icons/Feather";

const queryClient = new QueryClient();

function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  return <Icon name="log-out" size={22} onPress={logout} />;
}

export default function Layout() {
  const { isActive } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      {isActive ? (
        <Stack
          screenOptions={{ headerRight: LogoutButton, headerTitle: "PVERN" }}
          initialRouteName="/test"
        />
      ) : (
        <Auth />
      )}
    </QueryClientProvider>
  );
}
