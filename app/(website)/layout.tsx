import { NavBar, TopBar } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
      <div className="flex-1 relative h-full">{children}</div>
      <Footer />
      <CartSidebar />
    </>
  );
}
