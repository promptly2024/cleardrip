"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  FileText,
  LogOut,
  Loader2,
  Package,
  BookCheck,
  BarChart3,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AdminUser } from "@/lib/types/auth/adminAuth";
import { AdminAuthService } from "@/lib/httpClient/adminAuth";

const AdminDashboard = () => {
    const {
        authenticated,
        authLoading,
        logout,
        isSuperAdmin,
        isAdmin,
        user: loggedInUser,
        role
    } = useAuth();
    const router = useRouter();

    const [adminList, setAdminList] = useState<AdminUser[]>([]);
    const [newAdmin, setNewAdmin] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!authLoading && !authenticated) router.push("/admin/signin");
    }, [authLoading, authenticated, router]);

    useEffect(() => {
        if (isSuperAdmin) fetchAdminList();
    }, [isSuperAdmin]);

    const fetchAdminList = async () => {
        try {
            const result = await AdminAuthService.getAdminList();
            setAdminList(result);
        } 
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load admins");
        }
    };

    const handleCreateAdmin = async () => {
        setIsLoading(true);
        try {
            const result = await AdminAuthService.createAdmin(newAdmin);
            if(result){
                setSuccess("Admin created");
                setNewAdmin({ name: "", email: "", password: "" });
                fetchAdminList();
            }
        } 
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create admin");
        } 
        finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout();
            router.push("/admin/signin");
        } 
        catch {
            setError("Logout failed");
        } 
        finally {
            setIsLoading(false);
        }
    };

    const dashboardCards = [
        {
            label: "View TDS",
            icon: FileText,
            description: "View TDS of Users",
            href: "/admin/tds",
        },
        {
            label: "Services",
            icon: ShieldCheck,
            description: "Manage platform services",
            href: "/services",
        },
        ...(isSuperAdmin
        ? [
                {
                    label: "Manage Products",
                    icon: Package,
                    description: "Add, edit property Products",
                    href: "/admin/products",
                },
                {
                    label: "Manage Admins/Staff",
                    icon: Users,
                    description: "View and manage admin accounts",
                    href: "/admin/users",
                },
                {
                    label: "Create Admins/Staff",
                    icon: Users,
                    description: "Create admin accounts",
                    href: "/admin/staff",
                },
            ]
        : []),
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-lg border flex justify-between items-center">
            <div>
                <h1 className="text-xl font-bold text-gray-900">
                Welcome, {loggedInUser?.name}
                </h1>
                <p className="text-sm text-gray-600">{loggedInUser?.adminRole}</p>
            </div>
            <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center text-red-600 border border-red-200 px-3 py-2 rounded hover:bg-red-50 text-sm"
            >
                {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                <LogOut className="w-4 h-4 mr-2" />
                )}
                Logout
            </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card) => (
                <a
                href={card.href}
                key={card.label}
                className="bg-white border p-5 rounded-lg hover:shadow"
                >
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-md">
                    <card.icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                        {card.label}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {card.description}
                    </p>
                    </div>
                </div>
                </a>
            ))}
            </div>

            {isSuperAdmin && (
            <>
                <div className="bg-white p-6 rounded-lg border space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5" /> Admin Users
                </h2>
                {adminList.map((admin) => (
                    <div
                    key={admin.email}
                    className="border p-3 rounded text-sm text-gray-700"
                    >
                    <div>
                        <strong>Name:</strong> {admin.name}
                    </div>
                    <div>
                        <strong>Email:</strong> {admin.email}
                    </div>
                    <div>
                        <strong>Role:</strong> {admin.role}
                    </div>
                    </div>
                ))}
                </div>

                <div className="bg-white p-6 rounded-lg border space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5" /> Create Admin
                </h2>
                <div className="space-y-3">
                    <input
                    type="text"
                    placeholder="Name"
                    value={newAdmin.name}
                    onChange={(e) =>
                        setNewAdmin((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full border px-3 py-2 rounded"
                    />
                    <input
                    type="email"
                    placeholder="Email"
                    value={newAdmin.email}
                    onChange={(e) =>
                        setNewAdmin((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full border px-3 py-2 rounded"
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
                    className="w-full border px-3 py-2 rounded"
                    />
                    <button
                    onClick={handleCreateAdmin}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                    >
                    {isLoading ? "Creating..." : "Create Admin"}
                    </button>
                </div>
                </div>
            </>
            )}

            {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded border border-red-200 text-sm">
                {error}
            </div>
            )}
            {success && (
            <div className="bg-green-100 text-green-700 p-4 rounded border border-green-200 text-sm">
                {success}
            </div>
            )}
        </div>
        </div>
    );
};

export default AdminDashboard;
