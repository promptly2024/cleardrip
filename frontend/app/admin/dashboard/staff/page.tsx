"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Loader2,
  Trash2,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { AdminAuthService } from "@/lib/httpClient/adminAuth";
import { AdminUser } from "@/lib/types/auth/adminAuth";

const SuperAdminPage = () => {
  const { isSuperAdmin, authenticated, authLoading } = useAuth();

  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const admins = await AdminAuthService.getAdminList();
      setAdminList(admins);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch admins");
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    if (authenticated && isSuperAdmin) {
      fetchAdmins();
    }
  }, [authenticated, isSuperAdmin]);

  const handleCreateAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);
    try {
      await AdminAuthService.createAdmin(newAdmin);
      toast.success("Admin created successfully!");
      setNewAdmin({ name: "", email: "", password: "", role: "ADMIN" });
      setIsFormVisible(false);
      fetchAdmins();
    } catch (err: any) {
      toast.error(err.message || "Failed to create admin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      await AdminAuthService.deleteAdmin(id);
      toast.success("Admin removed");
      setAdminList((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete admin");
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!authenticated || !isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
        <ShieldCheck className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mb-4" />
        <p className="text-base sm:text-lg font-medium text-gray-600">
          🚫 Unauthorized access
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                Manage admins and staff
              </p>
            </div>

            <button
              onClick={() => setIsFormVisible(true)}
              disabled={isLoading}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs sm:text-sm font-medium rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 flex-shrink-0 whitespace-nowrap"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
              ) : (
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span className="hidden sm:inline">
                {isLoading ? "Creating..." : "Create Admin"}
              </span>
              <span className="sm:hidden">
                {isLoading ? "..." : "Add"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-blue-800">
                    Total Admins
                  </p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mt-1">
                    {adminList.length}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white flex items-center justify-center rounded-lg flex-shrink-0 ml-2">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="truncate">Current Admin Users</span>
            </h2>

            {loadingAdmins ? (
              <div className="flex justify-center py-8 sm:py-10">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : adminList.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-2 sm:mb-3" />
                <p className="text-sm sm:text-base text-gray-500">
                  No admins created yet
                </p>
                <button
                  onClick={() => setIsFormVisible(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create First Admin
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {adminList.map((admin) => (
                  <div
                    key={admin.id}
                    className="p-3 sm:p-4 border rounded-lg hover:shadow-md transition flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                        {admin.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        {admin.email}
                      </p>
                      <span className="mt-2 inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 font-medium">
                        {admin.role}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="p-2 rounded-md hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors flex-shrink-0 self-start sm:self-auto"
                      title="Delete admin"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ADMIN CREATE FORM - Desktop */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span>Add a New Admin</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newAdmin.name}
                onChange={(e) =>
                  setNewAdmin((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <input
                type="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <input
                type="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <select
                value={newAdmin.role}
                onChange={(e) =>
                  setNewAdmin((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="ADMIN">Staff Admin</option>
              </select>
            </div>

            <button
              onClick={handleCreateAdmin}
              disabled={isLoading}
              className="mt-4 sm:mt-5 w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg shadow hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Creating..." : "Add Admin"}
            </button>
          </div>
        </div>
      </div>

      {/* ADMIN CREATE FORM - Mobile Modal */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-lg shadow-xl w-full sm:max-w-md max-h-[90vh] sm:max-h-none overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>Add New Admin</span>
              </h2>
              <button
                onClick={() => setIsFormVisible(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newAdmin.name}
                  onChange={(e) =>
                    setNewAdmin((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newAdmin.email}
                  onChange={(e) =>
                    setNewAdmin((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="Enter secure password"
                  value={newAdmin.password}
                  onChange={(e) =>
                    setNewAdmin((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={newAdmin.role}
                  onChange={(e) =>
                    setNewAdmin((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="ADMIN">Staff Admin</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-4 sm:p-6 border-t bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setIsFormVisible(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAdmin}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Creating..." : "Add Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPage;
