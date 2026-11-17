import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <main className="center">
        <Outlet />
      </main>
    </div>
  );
}
