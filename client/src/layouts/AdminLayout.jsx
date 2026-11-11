
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AdminLayout({ children }) {
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
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
