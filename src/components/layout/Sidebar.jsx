import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  Stethoscope,
  BookOpen,
  HelpCircle,
  Inbox,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    // { name: "Patients", icon: Users, path: "/patients" },
    { name: "Appointments", icon: Calendar, path: "/appointments" },
    // { name: "Reports", icon: FileText, path: "/reports" },
    { name: "Testimonials", icon: MessageSquare, path: "/testimonials" },
    { name: "Blogs", icon: BookOpen, path: "/blogs" },
    { name: "FAQs", icon: HelpCircle, path: "/faqs" },
    { name: "Inquiries", icon: Inbox, path: "/inquiries" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-gray-100">
            <div className="bg-primary-500 p-2 rounded-xl">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Dr. Anand</h1>
              <p className="text-xs text-gray-500">Gastro Surgeon</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-hide">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-primary-50 text-primary-500 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={`w-5 h-5 ${isActive ? "text-primary-500" : "text-gray-400"}`}
                        />
                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <div className="bg-primary-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-800 mb-1">
                Need Help?
              </p>
              <p className="text-xs text-gray-600 mb-3">
                Contact support for assistance
              </p>
              <button
                onClick={() =>
                  (window.location.href = "https://techrabbit.io/")
                }
                className="w-full bg-primary-500 text-white text-sm py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Get Support
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
