
import {
  LayoutDashboard,
  Users,
  UserRound,
  FolderKanban,
  ClipboardList,
  FileText,
  Receipt,
  Wallet,
  Settings,
  LogOut,
  Building2,
  ChevronDown,
  X,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Customers", icon: Users },
  { name: "Employees", icon: UserRound },
  { name: "Projects", icon: FolderKanban },
  { name: "Tasks", icon: ClipboardList },
  { name: "Quotations", icon: FileText },
  { name: "Invoices", icon: Receipt },
  { name: "Expenses", icon: Wallet },
];

function Sidebar({ activePage, setActivePage, open, setOpen }) {
  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col
        bg-awadh-navy text-white transition-transform duration-300
        lg:static lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-awadh-gold">
              <Building2 size={24} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-wide">
                AWADH
              </h1>
              <p className="text-[10px] tracking-[4px] text-awadh-gold">
                INTERIOR
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-5 py-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActivePage(item.name);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition
                    ${
                      active
                        ? "bg-awadh-gold font-semibold text-white shadow-lg"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <Icon size={19} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-5">
          <button
            onClick={() => setActivePage("Settings")}
            className="mb-3 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-white/10"
          >
            <Settings size={19} />
            Settings
          </button>

          <button
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-300 hover:bg-red-500/10"
          >
            <LogOut size={19} />
            Logout
          </button>

          <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
            <span>Awadh Interior</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
