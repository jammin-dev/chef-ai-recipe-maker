// src/App.tsx
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="h-dvh w-screen">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;
