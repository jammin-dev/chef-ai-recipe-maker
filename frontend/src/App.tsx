// src/App.tsx
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ThemeProvider } from "./providers/ThemeProvider";

function App() {
  return (
    <div className="h-dvh w-screen test">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex flex-col items-center justify-between w-full h-full">
          <RouterProvider router={router} />
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
