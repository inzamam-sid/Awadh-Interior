
import { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  UserCircle,
  LogOut,
} from "lucide-react";

function Navbar({ activePage, setOpen, user, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">

      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={23} />
        </button>

        <div>
          <h2 className="text-xl font-bold text-awadh-navy">
            {activePage}
          </h2>
          <p className="hidden text-xs text-slate-500 sm:block">
            Welcome to Awadh Interior Management System
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-5">
        <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <Search size={20} />
        </button>

        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User Profile */}
        <div className="relative border-l border-slate-200 pl-3 sm:pl-5">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-awadh-navy text-white">
              <UserCircle size={25} />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500">
                {user?.role?.replaceAll("_", " ") || "User"}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="hidden text-slate-500 sm:block"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-14 z-50 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="truncate text-sm font-medium text-slate-800">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  onLogout();
                }}
                className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
