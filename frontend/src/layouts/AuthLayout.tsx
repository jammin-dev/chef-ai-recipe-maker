// src/layouts/AuthLayout.tsx
import { Outlet } from "react-router-dom";

import Title from "@/components/Title";

function AuthLayout() {
  return (
    <div className="flex flex-col flex-1 items-center w-full h-full p-10">
      <div className="h-20 w-full flex items-end justify-center px-5">
        <Title />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
