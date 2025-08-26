"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  FileText,
  LogOut,
  Loader2,
  Package,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const AdminDashboard = () => {
  const {
    authenticated,
    authLoading,
    logout,
    isSuperAdmin,
    isAdmin,
    user: loggedInUser,
    role,
  } = useAuth();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!authLoading && !authenticated) {
      toast.error("You must be logged in to access this page", {
        description: "Please log in to continue",
        action: {
          label: "Login",
          onClick: () => router.push("/admin/signin"),
        },
      });
      router.push("/admin/signin");
    }
  }, [authLoading, authenticated, router]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push("/admin/signin");
    } catch {
      setError("Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardCards = [
    {
      label: "Services",
      icon: ShieldCheck,
      description: "Manage platform services",
      href: "/admin/dashboard/services",
    },
    ...(isSuperAdmin
      ? [
        {
          label: "Manage Products",
          icon: Package,
          description: "Add, edit property Products",
          href: "/admin/dashboard/products",
        },
        {
          label: "Manage Admins/Staff",
          icon: Users,
          description: "Create and view staff accounts",
          href: "/admin/dashboard/staff",
        },
        {
          label: "Manage Subscriptions",
          icon: CalendarCheck,
          description: "Create subscriptions",
          href: "/admin/dashboard/subscriptions",
        },
      ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <header className="bg-white p-6 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Welcome, {loggedInUser?.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {loggedInUser?.adminRole || role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="self-start sm:self-center flex items-center gap-1 text-red-600 border border-red-200 px-4 py-2 rounded text-sm sm:text-base hover:bg-red-50 transition"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
            Logout
          </button>
        </header>

        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 hover:shadow-md transition"
            >
              <div className="bg-gray-100 p-3 rounded-md self-start">
                <card.icon className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{card.label}</h3>
              <p className="text-sm text-gray-500">{card.description}</p>
            </a>
          ))}
        </section>

        {/* Feedback messages */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded border border-red-300 text-center text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded border border-green-300 text-center text-sm">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
