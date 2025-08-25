"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Users,
  PlusCircle,
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

  // Fetch existing admins
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

  // Create a new admin
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

  // Delete admin
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

  // Auth check
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!authenticated || !isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Unauthorized access
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            Super Admin - Manage Staff
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage admin users across the platform
          </p>
        </div>

        {/* Admin Users List */}
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5" /> Admin Users
          </h2>

          {loadingAdmins ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : adminList.length === 0 ? (
            <p className="text-gray-600 text-sm">No admins created yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {adminList.map((admin) => (
                <div
                  key={admin.id}
                  className="border p-4 rounded-lg bg-gray-50 flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium text-gray-900">{admin.name}</p>
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

        {/* Create Admin Form */}
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5" /> Create New Admin
          </h2>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={newAdmin.name}
              onChange={(e) =>
                setNewAdmin((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={newAdmin.password}
              onChange={(e) =>
                setNewAdmin((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newAdmin.role}
              onChange={(e) =>
                setNewAdmin((prev) => ({ ...prev, role: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="ADMIN">Staff</option>
              {/* <option value="SUPER_ADMIN">SuperAdmin</option> */}
            </select>
            <button
              onClick={handleCreateAdmin}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              {isLoading ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPage;
