import axios from "axios";
import { useMutation, UseMutationOptions } from "react-query";

interface CreateTicketOpts {
  domain: string;
  username: string;
  password: string;
}

export interface CreateTicketResp {
  data: {
    ticket: string;
    CSRFPreventionToken: string;
  };
}

export async function createTicket({
  domain,
  username,
  password,
}: CreateTicketOpts) {
  const url = new URL("/api2/json/access/ticket", domain).toString();
  const headers = { "Content-Type": "application/json" };
  return axios.post<CreateTicketResp>(url, { username, password }, { headers });
}

export function useTicketMut(options: UseMutationOptions) {
  return useMutation({ mutationFn: createTicket, ...options });
}
