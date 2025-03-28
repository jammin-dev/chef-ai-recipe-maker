// src/App.tsx
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ThemeProvider } from "./providers/ThemeProvider";

function App() {
  return (
    <div className="h-dvh w-screen">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;
