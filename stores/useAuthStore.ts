import { create } from "zustand";
import produce from "immer";
import axios, { AxiosInstance } from "axios";
import { CreateTicketResp } from "../hooks/useTicket";

interface Profile {
  username: string;
  domain: string;
  ticketData: CreateTicketResp;
}

interface AuthStoreState extends Profile {
  http: AxiosInstance;
  isActive: boolean;
  logout: () => void;
  update: (state: Profile) => void;
}

const useAuthStore = create<AuthStoreState>((set) => ({
  username: "",
  domain: "",
  ticketData: { data: { CSRFPreventionToken: "", ticket: "" } },
  http: axios.create(),
  isActive: false,
  logout: () =>
    set(
      produce((state: AuthStoreState) => {
        state.domain = "";
        state.username = "";
        state.http = axios.create();
        state.isActive = false;
        state.ticketData = { data: { CSRFPreventionToken: "", ticket: "" } };
      })
    ),
  update: ({ domain, username, ticketData }: Profile) =>
    set(
      produce((state: AuthStoreState) => {
        state.domain = domain;
        state.username = username;
        state.ticketData = ticketData;
        state.http = axios.create({
          baseURL: domain,
          headers: {
            CSRFPreventionToken: ticketData.data.CSRFPreventionToken,
            cookie: `PVEAuthCookie=${ticketData.data.ticket}`,
          },
        });
        state.isActive = true;
      })
    ),
}));

export default useAuthStore;
