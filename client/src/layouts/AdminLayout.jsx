
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Quotations from "../pages/Quotations";

function AdminLayout({ children, user, onLogout }) {
  const [activePage, setActivePage] = useState("Dashboard");
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        open={open}
        setOpen={setOpen}
      />

      <div className="min-w-0 flex-1">
        <Navbar
          activePage={activePage}
          setOpen={setOpen}
          user={user}
          onLogout={onLogout}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {activePage === "Quotations" ? (
            <Quotations />
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
