import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Outlet } from "react-router";

function RootLayout() {
  return (
    <div className="flex flex-col min-h-svh">
      <Header />
      <div className="container pt-4 flex-1">
          <div className="mt-[100px]">
            <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RootLayout;
