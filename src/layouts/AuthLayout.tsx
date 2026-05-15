import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <Outlet />
    </div>
  );
}