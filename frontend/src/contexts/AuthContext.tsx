// src/contexts/AuthContext.tsx
import { UserPublic } from "@/client";
import { createContext } from "react";

interface AuthContextValue {
  user: UserPublic | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  openLoginDialogIfGuest: () => boolean;
}

// Create the context with default values
const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  openLoginDialogIfGuest: () => false,
});

export default AuthContext;
