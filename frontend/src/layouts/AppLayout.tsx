// src/layouts/AppLayout.tsx
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Outlet } from "react-router-dom";

function AppLayout() {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  return (
    <SidebarProvider>
      {isAuthenticated && <AppSidebar />}
      <SidebarInset>
        <div className="flex flex-col flex-1 items-center w-full gap-5 p-2 sm:p-5">
          <Header />
          <Outlet />
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AppLayout;
