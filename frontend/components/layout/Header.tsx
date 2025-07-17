"use client";

import { Droplets, User, LogOut } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { authenticated, user, role, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Branding */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              ClearDrip 
            </span>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Services</Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Products</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</Link>
          </nav>

          {/* User Section */}
          <div className="flex space-x-4">
            {authenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-700" />
                    <span className="text-sm text-gray-700 font-medium">
                      {user?.name || user?.email?.split("@")[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <div className="px-3 py-2 text-sm text-gray-800">
                        <div className="font-semibold">{user?.name || "User"}</div>
                        <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <DropdownMenuSeparator />

                    {/* Dashboard Link */}
                    <DropdownMenuItem asChild>
                        <Link
                        href={
                            role === "ADMIN" || role === "SUPER_ADMIN"
                            ? "/admin/dashboard"
                            : "/user/dashboard"
                        }
                        className="flex items-center gap-2"
                        >
                        <User className="w-4 h-4" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Logout */}
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </DropdownMenuItem>
            </DropdownMenuContent>

              </DropdownMenu>
            ) : (
              <>
                <Link href="/user/signin" className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                  Login
                </Link>
                <Link href="/user/signup" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
