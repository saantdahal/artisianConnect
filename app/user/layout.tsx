import { NavBar, TopBar } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/user/Sidebar";
import CartSidebar from "@/components/cart/CartSidebar";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <NavBar />
      <div className="border-t py-10 min-h-[60vh]">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row gap-6">
          <Sidebar />
          {children}
        </div>
      </div>
      <CartSidebar />

      <Footer />
    </>
  );
}
