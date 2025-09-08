"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  FileText,
  LogOut,
  Loader2,
  Package,
  ShieldCheck,
  CalendarCheck,
  Home,
  MessageSquare,
  User,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { APIURL } from "@/utils/env"

interface DashboardStats {
  totalAdmins: number
  totalUsers: number
  totalServices: number
  totalServicesBooked: number
  totalSubscriptions: number
  totalSubscriptionsBooked: number
  availableSlots: number
}

const AdminDashboard = () => {
  const { authenticated, authLoading, logout, isSuperAdmin, isAdmin, user: loggedInUser, role } = useAuth()

  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)

  // Check if user has admin access
  const hasAdminAccess = () => {
    return (
      authenticated && 
      (role === "SUPER_ADMIN" || role === "ADMIN" || isSuperAdmin || isAdmin) &&
      role !== "USER"
    )
  }

  // Show different quick links based on role
  const getQuickLinks = () => {
    if (role === "SUPER_ADMIN" || isSuperAdmin) {
      return [
        {
          title: "Manage Services and Slots",
          url: "/admin/dashboard/services",
          icon: MessageSquare,
        },
        {
          title: "Manage Products",
          url: "/admin/dashboard/products",
          icon: User,
        },
        {
          title: "Manage Staff",
          url: "/admin/dashboard/staff",
          icon: User,
        },
        {
          title: "Manage Subscriptions",
          url: "/admin/dashboard/subscriptions",
          icon: CalendarCheck,
        }
      ]
    } else if (role === "ADMIN" || isAdmin) {
      return [
        {
          title: "Manage Services and Slots",
          url: "/admin/dashboard/services",
          icon: MessageSquare,
        }
      ]
    }
    return []
  }

  const QuickLinks = getQuickLinks()

  useEffect(() => {
    // Only fetch stats if user has admin access
    if (hasAdminAccess()) {
      const fetchDashboardStats = async () => {
        try {
          const response = await fetch(`${APIURL}/admin/dashboard/stats`)
          const data = await response.json()
          if (response.ok) {
            setDashboardStats(data.stats)
          } else {
            setError(data.message)
          }
        } catch (error: any) {
          toast.error("Failed to fetch dashboard stats", {
            description: error.message,
            action: {
              label: "Retry",
              onClick: () => fetchDashboardStats()
            }
          })
          setError(error.message)
        }
      }
      fetchDashboardStats()
    }
  }, [authLoading, authenticated, role])

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      router.push("/admin/signin")
    } catch {
      setError("Logout failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  // Show access denied if not authenticated or not admin
  if (!authenticated || !hasAdminAccess()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg border shadow-sm max-w-md w-full mx-4">
          <div className="text-center">
            <ShieldCheck className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              {!authenticated 
                ? "You need to be logged in as an admin to access this dashboard."
                : role === "USER" 
                ? "You don't have admin privileges to access this dashboard."
                : "You don't have sufficient permissions to access this dashboard."
              }
            </p>
            <div className="space-y-3">
              {!authenticated && (
                <button
                  onClick={() => router.push("/admin/signin")}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Admin Login
                </button>
              )}
              <button
                onClick={() => router.push("/")}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Function to render stats based on role
  const renderStatsGrid = () => {
    if (!dashboardStats) {
      return (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )
    }

    const isSuperAdmin = role === "SUPER_ADMIN"

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Always show services stats */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalServices}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Services Booked</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalServicesBooked}</p>
            </div>
            <CalendarCheck className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Slots</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.availableSlots}</p>
            </div>
            <CalendarCheck className="h-8 w-8 text-teal-600" />
          </div>
        </div>

        {/* Only show additional stats for superadmin */}
        {isSuperAdmin && (
          <>
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Admins</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalAdmins}</p>
                </div>
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalSubscriptions}</p>
                </div>
                <Package className="h-8 w-8 text-indigo-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Subscriptions Booked</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalSubscriptionsBooked}</p>
                </div>
                <CalendarCheck className="h-8 w-8 text-pink-600" />
              </div>
            </div>
          </>
        )}

        {/* Logout button */}
        <div className="bg-white p-6 rounded-lg border">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <header className="bg-white p-6 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome, {loggedInUser?.name}</h1>
            <p className="text-sm sm:text-base text-gray-600">
              {loggedInUser?.adminRole || role} 
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Admin Access
              </span>
            </p>
          </div>
        </header>

        {/* Stats Grid */}
        {renderStatsGrid()}
        
        {/* Quick Links - Only show if there are links available */}
        {QuickLinks.length > 0 && (
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
            <div className={`grid grid-cols-1 ${QuickLinks.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-4' : ''} gap-4`}>
              {QuickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => router.push(link.url)}
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <link.icon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{link.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{success}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
