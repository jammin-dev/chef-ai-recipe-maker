// src/hooks/useAuth.tsx
import { useContext } from "react";

import AuthContext from "@/contexts/AuthContext";

// Custom hook to consume auth context
export function useAuth() {
  return useContext(AuthContext);
}
