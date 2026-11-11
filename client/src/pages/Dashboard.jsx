
import {
  FolderKanban,
  Users,
  FileText,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";

const stats = [
  {
    title: "Total Projects",
    value: "24",
    change: "+12%",
    icon: FolderKanban,
    positive: true,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Total Customers",
    value: "86",
    change: "+8%",
    icon: Users,
    positive: true,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Quotations",
    value: "18",
    change: "+5%",
    icon: FileText,
    positive: true,
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Total Revenue",
    value: "₹4,85,000",
    change: "-3%",
    icon: Wallet,
    positive: false,
    color: "bg-purple-100 text-purple-700",
  },
];

const projects = [
  {
    name: "Rahul Sharma Residence",
    location: "Lucknow",
    progress: 100,
    status: "Completed",
  },
  {
    name: "Modern Living Room",
    location: "Lucknow",
    progress: 65,
    status: "In Progress",
  },
  {
    name: "Office False Ceiling",
    location: "Kanpur",
    progress: 35,
    status: "In Progress",
  },
];

const activities = [
  {
    title: "Project completed",
    description: "Rahul Sharma Residence",
    time: "Recently",
    icon: CheckCircle2,
  },
  {
    title: "Quotation sent",
    description: "AI-QTN-2026-0001",
    time: "Recently",
    icon: FileText,
  },
  {
    title: "Project updated",
    description: "Office False Ceiling",
    time: "Recently",
    icon: Clock,
  },
];

function Dashboard() {
  return (
    <div className="space-y-8">

      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-awadh-navy">
            Welcome back, Mohammad Nafees!
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening with your business today.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm text-slate-600">
          <CalendarDays size={18} />
          Business Overview
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const ChangeIcon = stat.positive
            ? ArrowUpRight
            : ArrowDownRight;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {stat.title}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-awadh-navy">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={23} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs">
                <ChangeIcon
                  size={15}
                  className={
                    stat.positive ? "text-green-600" : "text-red-600"
                  }
                />
                <span
                  className={
                    stat.positive ? "text-green-600" : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                <span className="text-slate-400">
                  vs previous period
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Projects and Activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Recent Projects */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-awadh-navy">
                Recent Projects
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Overview of your latest projects
              </p>
            </div>

            <button className="text-sm font-semibold text-awadh-gold hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.name}>
                <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {project.location}
                    </p>
                  </div>

                  <span
                    className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-medium ${
                      project.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-awadh-gold"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <p className="mt-1 text-right text-xs text-slate-500">
                  {project.progress}% completed
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-awadh-navy">
            Recent Activity
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Latest business updates
          </p>

          <div className="mt-6 space-y-6">
            {activities.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <div key={index} className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-awadh-gold">
                    <Icon size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      {activity.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {activity.description}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
