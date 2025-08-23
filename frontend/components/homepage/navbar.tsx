"use client";
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Grid3X3, LogOut, Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className = "", onClick }) => (
    <Link
        href={href}
        className={`text-gray-900 hover:text-blue-600 font-medium transition-colors duration-200 ${className}`}
        onClick={onClick}
    >
        {children}
    </Link>
);

const Navbar: React.FC = () => {
    const { authenticated, user, role, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const { cartCount } = useCart();

    const handleSearchQuery = () => {
        router.push(`/search?query=${searchQuery}`);
    };

    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        router.prefetch(`/search?query=${searchQuery}`);
    }, [searchQuery]);

    useEffect(() => {
        router.prefetch(`/products`);
        router.prefetch(`/services`);
        router.prefetch(`/pricing`);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            setIsMobileMenuOpen(false);
        } catch (error) {
            toast.error("Failed to logout. Please try again.");
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const getUserDisplayName = () => {
        return user?.name || user?.email?.split("@")[0] || "User";
    };

    const getUserInitial = () => {
        const name = user?.name || user?.email;
        return name ? name.charAt(0).toUpperCase() : "U";
    };

    const getDashboardRoute = () => {
        return role === "ADMIN" || role === "SUPER_ADMIN"
            ? "/admin/dashboard"
            : "/user/dashboard";
    };

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2 flex-shrink-0 hover:cursor-pointer"
                        onClick={() => router.push("/")}
                    >
                        <img
                            src="/cleardrip-logo.png"
                            alt="Clear Drip Logo"
                            className="w-8 h-8"
                        />
                        <span className="font-bold text-lg sm:text-xl text-gray-900">
                            CLEARDRIP
                        </span>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-8">
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/products">Products</NavLink>
                        <NavLink href="/services">Services</NavLink>
                        <NavLink href="/pricing">Pricing</NavLink>
                    </div>

                    {/* Desktop Right Section */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 min-w-[200px]">
                            <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search for services..."
                                className="bg-transparent border-none outline-none text-sm w-full"
                                aria-label="Search for services"
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearchQuery();
                                    }
                                }}
                            />
                        </div>

                        {/* Action Icons */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 relative"
                            onClick={() => router.push('/cart')}
                            aria-label="Shopping cart"
                        >
                            <ShoppingCart className="w-5 h-5 text-gray-600" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2"
                            aria-label="Grid menu"
                        >
                            <Grid3X3 className="w-5 h-5 text-gray-600" />
                        </Button>

                        {/* Authentication Section */}
                        {authenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2"
                                    >
                                        <span className="text-sm text-gray-700 font-medium hidden sm:inline">
                                            Hello {getUserDisplayName()}
                                        </span>

                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={`${user.name}'s avatar`}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                                                {getUserInitial()}
                                            </div>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-3 py-2 text-sm text-gray-800">
                                        <div className="font-semibold">{getUserDisplayName()}</div>
                                        <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                                    </div>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={getDashboardRoute()}
                                            className="flex items-center gap-2 w-full"
                                        >
                                            <User className="w-4 h-4" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                href="/user/signup"
                                className="px-4 py-2 border border-gray-900 rounded-2xl hover:bg-gray-900 hover:text-white transition-colors duration-200 text-gray-900 font-medium"
                            >
                                Sign Up
                            </Link>
                        )}
                    </div>

                    {/* Mobile Right Section */}
                    <div className="flex md:hidden items-center gap-2">
                        {/* Mobile Search Toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2"
                            onClick={toggleSearch}
                            aria-label="Toggle search"
                        >
                            <Search className="w-5 h-5 text-gray-600" />
                        </Button>

                        {/* Mobile User Menu or Sign Up */}
                        {authenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="p-2">
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={`${user.name}'s avatar`}
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">
                                                {getUserInitial()}
                                            </div>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-3 py-2 text-sm text-gray-800">
                                        <div className="font-semibold">{getUserDisplayName()}</div>
                                        <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                                    </div>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={getDashboardRoute()}
                                            className="flex items-center gap-2 w-full"
                                        >
                                            <User className="w-4 h-4" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                href="/user/signup"
                                className="px-3 py-1.5 text-sm border border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors duration-200 text-gray-900 font-medium"
                            >
                                Sign Up
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 lg:hidden"
                            onClick={toggleMobileMenu}
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6 text-gray-600" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-600" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {isSearchOpen && (
                    <div className="md:hidden py-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                            <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search for services..."
                                className="bg-transparent border-none outline-none text-sm w-full"
                                aria-label="Search for services"
                                autoFocus
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearchQuery();
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200 bg-white">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <NavLink
                                href="/"
                                className="block px-3 py-2 rounded-md text-base"
                                onClick={closeMobileMenu}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                href="/products"
                                className="block px-3 py-2 rounded-md text-base"
                                onClick={closeMobileMenu}
                            >
                                Products
                            </NavLink>
                            <NavLink
                                href="/services"
                                className="block px-3 py-2 rounded-md text-base"
                                onClick={closeMobileMenu}
                            >
                                Services
                            </NavLink>
                            <NavLink
                                href="/pricing"
                                className="block px-3 py-2 rounded-md text-base"
                                onClick={closeMobileMenu}
                            >
                                Pricing
                            </NavLink>

                            <div className="border-t border-gray-200 pt-2 mt-2">
                                <div className="flex items-center gap-4 px-3 py-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-2 relative"
                                        onClick={() => router.push('/cart')}
                                        aria-label="Shopping cart"
                                    >
                                        <ShoppingCart className="w-5 h-5 text-gray-600" />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium text-[10px]">
                                                {cartCount > 9 ? '9+' : cartCount}
                                            </span>
                                        )}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-2"
                                        aria-label="Grid menu"
                                    >
                                        <Grid3X3 className="w-5 h-5 text-gray-600" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav >
    );
};

export default Navbar;