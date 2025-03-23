// src/contexts/AuthContext.tsx
import { UserPublic } from "@/client";
import { createContext } from "react";
// If you have an endpoint to fetch user details, import it here, e.g.
// import { fetchMe } from '@/api/auth'

interface AuthContextValue {
  user: UserPublic | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
});

export default AuthContext;
