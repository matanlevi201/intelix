import { CurrentUser } from "@intelix/common";

export interface SessionState {
  accessToken: string | null;
  currentUser: CurrentUser | null;
  setSession: (accessToken: string) => void;
  endSession: () => void;
}
