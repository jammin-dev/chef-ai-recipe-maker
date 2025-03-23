// src/layouts/AppLayout.tsx
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col flex-1 items-center w-full justify-between">
          <div className="w-full">
            <Header />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center w-full p-2 md:p-10">
            {children}
          </div>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AppLayout;
