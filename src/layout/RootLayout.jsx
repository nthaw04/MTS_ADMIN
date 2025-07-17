import { Outlet } from "react-router";

function RootLayout() {
  return (
    <div className="flex flex-col min-h-svh">
      <div className="container flex-1">
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default RootLayout;
