
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  UserCircle,
} from "lucide-react";

function Navbar({ activePage, setOpen }) {
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
        
        {/* Search */}
        <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <Search size={20} />
        </button>

        {/* Notifications */}
        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3 sm:pl-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-awadh-navy text-white">
            <UserCircle size={25} />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              Mohammad Nafees
            </p>
            <p className="text-xs text-slate-500">
              Owner
            </p>
          </div>

          <ChevronDown
            size={16}
            className="hidden text-slate-500 sm:block"
          />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
