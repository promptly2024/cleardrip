"use client";
import { User, LogOut, Search, ShoppingCart, LayoutGrid } from "lucide-react";
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
import Image from "next/image";

export default function Header() {
  const { authenticated, user, role, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container ml-[70px] px-4 py-4">
        <div className="flex items-center justify-evenly">
          {/* Logo and Branding */}
          <Link href="/" className="flex items-center space-x-2">
            <div>
              <Image src="/cleardrip-logo.png" alt="Clear Drip Logo" width={82} height={105.66}/>
            </div>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex space-x-[24px]">
            <Link href="/" className="text-[#0E0E0E] h3 transition-colors">Home</Link>
            <Link href="/about" className="text-[#0E0E0E] h3 transition-colors">Products</Link>
            <Link href="/services" className="text-[#0E0E0E] h3 transition-colors">Services</Link>
            <Link href="/products" className="text-[#0E0E0E] h3 transition-colors">Pricing</Link>
            <Link href="/contact" className="text-[#0E0E0E] h3 transition-colors">Contact</Link>
          </nav>

          {/* Search */}
          <div className="flex items-center bg-white h-[56px] w-[400px] rounded-[16px] border-solid border-[#626161] border-[0.2px] px-[16px]">
            {/* Search Icon */}
            <Search className="w-[24px] h-[24px] mr-[12px]" strokeWidth={2} />
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search for services…. "
              className="flex-1 h3 bg-transparent border-none outline-none h3"
              style={{ fontSize: "24px", lineHeight: "36px", fontWeight: 500 }}
            />
          </div>

          {/* Cart Icon */}
          <button className="w-[24px] h-[24px] flex items-center justify-center hover:bg-blue-100 rounded transition">
            <ShoppingCart className="w-[24px] h-[24px]" strokeWidth={2} />
          </button>
          {/* Grid Icon */}
          <button className="w-[24px] h-[24px] flex items-center justify-center hover:bg-blue-100 rounded transition">
            <LayoutGrid className="w-[24px] h-[24px" strokeWidth={2} />
          </button>

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
                <Link href="/user/signup" className="px-6 py-2 border border-[#0E0E0E] border-solid rounded-[16px] w-[174px] h-[50px] flex items-center justify-center text-[24px] leading-[31px] text-[#0E0E0E] text-center font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
