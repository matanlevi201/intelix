import { Tokens } from "@/lib/tokens";
import { SessionState } from "@/types";
import { create } from "zustand";

export const useSessionStore = create<SessionState>((set) => ({
  accessToken: null,
  currentUser: null,
  setSession: (accessToken) => set(() => ({ accessToken, currentUser: Tokens.parseJWT(accessToken) })),
  endSession: () => set(() => ({ accessToken: null, currentUser: null })),
}));
