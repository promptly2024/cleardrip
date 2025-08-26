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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!authenticated || !isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 font-medium">
        🚫 Unauthorized access
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-blue-600" />
              Super Admin Panel
            </h1>
            <p className="text-gray-600">
              Manage admins and staff with full control
            </p>
          </div>
          <button
            onClick={handleCreateAdmin}
            disabled={isLoading}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Creating..." : "Create Admin"}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Admins</p>
                <p className="text-3xl font-bold text-blue-900">
                  {adminList.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-lg">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* ADMIN LIST */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Current Admin Users
          </h2>

          {loadingAdmins ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : adminList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No admins created yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminList.map((admin) => (
                <div
                  key={admin.id}
                  className="p-4 border rounded-lg hover:shadow-md transition flex justify-between items-start bg-gradient-to-r from-gray-50 to-white"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{admin.name}</p>
                    <p className="text-gray-600 text-sm">{admin.email}</p>
                    <span className="mt-2 inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 font-medium">
                      {admin.role}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteAdmin(admin.id)}
                    className="p-2 rounded-md hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ADMIN CREATE FORM */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Add a New Admin
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newAdmin.name}
              onChange={(e) =>
                setNewAdmin((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={newAdmin.password}
              onChange={(e) =>
                setNewAdmin((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newAdmin.role}
              onChange={(e) =>
                setNewAdmin((prev) => ({ ...prev, role: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="ADMIN">Staff Admin</option>
            </select>
          </div>

          <button
            onClick={handleCreateAdmin}
            disabled={isLoading}
            className="mt-5 w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            {isLoading ? "Creating..." : "Add Admin"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPage;
