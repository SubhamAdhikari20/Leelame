// src/components/navbar.tsx
"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog.tsx";
import { Button } from "./ui/button.tsx";
import {
    FaBars,
    FaFilter,
    FaMoon,
    FaSearch,
    FaSignOutAlt,
    FaSun,
    FaTimes,
    FaUser,
} from "react-icons/fa";
import { SunIcon, MoonStar } from "lucide-react";
import PortalWrapper from "./wrappers/portal-wrapper.tsx";
import {
    NotificationFeedPopover,
    NotificationIconButton,
} from "@knocklabs/react";
import Searchbar from "./searchbar.tsx";
import ProfilePopover from "./profile-popover.tsx";
import { useTheme } from "@/app/context/theme-provider.tsx";
import { CurrentUser } from "@/types/current-user.ts";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

interface NavbarProps {
    currentUser?: CurrentUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [feedOpen, setFeedOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    // const [isFocused, setIsFocused] = useState(false);

    const router = useRouter();
    const currentPath = usePathname();
    const menuRef = useRef<HTMLDivElement | null>(null);
    const notifButtonRef = useRef<HTMLButtonElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { theme, toggleTheme } = useTheme();
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        if (theme === "system") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setResolvedTheme(prefersDark ? "dark" : "light");
        } else {
            setResolvedTheme(theme);
        }
    }, [theme]);

    // const resolvedTheme =
    //     theme === "system"
    //         ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    //         : theme;

    // Close desktop profile popover on outside click
    useEffect(() => {
        function onClickOutside(e: any) {
            if (
                !logoutDialogOpen &&
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setDesktopMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, [logoutDialogOpen]);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "My Bids", path: `/${currentUser?.buyerProfile?.username}/my-bids`, authRequired: true },
        { name: "Blog", path: "/blog" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];

    // Search handlers
    const handleSubmit = (e: any) => {
        e.preventDefault();
        // implement your search navigate or API call:
        if (searchQuery.trim()) {
            // Example: navigate to search results page
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            // if empty maybe focus input
            inputRef.current?.focus();
        }
    };

    const clearQuery = () => {
        setSearchQuery("");
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: any) => {
        if (e.key === "Escape") {
            clearQuery();
        }
    };

    const toggleMenu = () => {
        setMobileMenuOpen((prev) => !prev);
    };

    const handleLogout = () => {
        signOut();
        router.replace("/login");
        toggleMenu();
        toast.success("Logout Successful");
    };

    return (
        <header className="sticky top-0 inset-x-0 z-20 bg-white dark:bg-background shadow-lg dark:shadow-[0_4px_6px_1px_rgba(255,255,255,0.05),0_2px_4px_2px_rgba(255,255,255,0.05)] transition-all border-b border-gray-300 dark:border-gray-700">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-3 md:gap-5">
                {/* Branding */}
                <div className="flex items-center gap-15">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/images/leelame_logo_cropped_png.png"
                            alt="Leelame Logo"
                            width={50}
                            height={50}
                            className="rounded-full"
                        />
                        <span className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                            Leelame
                        </span>
                    </Link>

                    {/* Desktop Navigation - Navbar Left*/}
                    <ul className="hidden lg:flex items-center gap-8 text-gray-500 dark:text-gray-300">
                        {navLinks.map((link) => {
                            if (link.authRequired && (!currentUser || !currentUser.buyerProfile)) {
                                return null;
                            }

                            const actualPath =
                                link.path === "/"
                                    ? (currentUser && currentUser.buyerProfile)
                                        ? `/${currentUser.buyerProfile.username}`
                                        : "/"
                                    : link.path;

                            let isActive = false;
                            if (link.path === "/") {
                                if (currentUser && currentUser.buyerProfile) {
                                    isActive = currentPath === `/${currentUser.buyerProfile.username}`;
                                }
                                else {
                                    isActive = currentPath === "/";
                                }
                            }
                            else {
                                isActive = currentPath === actualPath || currentPath.startsWith(actualPath);
                            }

                            return (
                                <li key={link.path}>
                                    <Link
                                        href={actualPath}
                                        className={`text-sm transition-colors ${isActive
                                            ? "text-green-600 dark:text-green-400 font-semibold border-b-2 border-green-600 dark:border-green-600 pb-1"
                                            : "hover:text-foreground dark:hover:text-foreground"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Medium and Small Screens: Search Icon Button */}
                <div className="flex items-center flex-1 justify-end">
                    <button
                        onClick={() => setSearchOpen(v => !v)}
                        aria-label="Open search"
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                    >
                        <FaSearch className="text-gray-700 dark:text-gray-100 w-5 h-5" />
                    </button>
                </div>

                {/* Light/Dark Mode Button*/}
                <Button
                    type="button"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="inline-flex items-center gap-1 rounded-sm border text-gray-800 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 hover:dark:bg-gray-700 focus:ring-1 focus:ring-gray-300 transition-colors p-2"
                >
                    {resolvedTheme === "dark" ? (
                        <SunIcon className="dark:text-gray-200 w-5 h-5" />
                    ) : (
                        <FaMoon className="dark:text-gray-200 w-5 h-5" />
                    )}
                </Button>

                <Link href="/become-seller" className="hidden sm:inline text-sm font-semibold text-green-500 dark:text-green-400 hover:text-green-600 hover:dark:text-green-300 hover:underline transition-all duration-200">
                    Become a seller
                </Link>

                {currentUser ? (
                    <>
                        <NotificationIconButton
                            ref={notifButtonRef}
                            onClick={() => setFeedOpen((v) => !v)}
                        />
                        {feedOpen && (
                            <PortalWrapper>
                                <NotificationFeedPopover
                                    buttonRef={notifButtonRef}
                                    isVisible={feedOpen}
                                    onClose={() => setFeedOpen(false)}
                                />
                            </PortalWrapper>
                        )}
                    </>
                ) : null}

                {/* Desktop Navigation - Navbar Right*/}
                <div className="hidden lg:flex items-center gap-8">
                    {currentUser && currentUser.buyerProfile ? (
                        <div className="relative" ref={menuRef}>
                            <Avatar
                                className="h-10 w-10 cursor-pointer border border-gray-900 dark:border-gray-100"
                                onClick={() => setDesktopMenuOpen((v) => !v)}
                            >
                                {currentUser.profilePictureUrl ? (
                                    <AvatarImage
                                        src={currentUser.profilePictureUrl}
                                        alt={currentUser.buyerProfile.fullName}
                                    />
                                ) : (
                                    <AvatarFallback>
                                        {(
                                            currentUser.buyerProfile.fullName ??
                                            currentUser.buyerProfile.username ??
                                            "U"
                                        )
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            {/* Profile Popover */}
                            {desktopMenuOpen && (
                                <>
                                    <ProfilePopover
                                        currentUser={currentUser}
                                        logoutDialogOpen={logoutDialogOpen}
                                        setLogoutDialogOpen={setLogoutDialogOpen}
                                        setDesktopMenuOpen={setDesktopMenuOpen}
                                        setMobileMenuOpen={setMobileMenuOpen}
                                        handleLogout={handleLogout}
                                    />
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex justify-evenly items-center gap-4">
                            <Link href="/login">
                                <Button
                                    size="sm"
                                    className="flex-1 font-semibold"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button
                                    size="sm"
                                    className="flex-1 font-semibold"
                                    variant="outline"
                                >
                                    Join
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden flex items-center">
                    <button
                        onClick={toggleMenu}
                        className="text-gray-800 dark:text-gray-100 focus:outline-none cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <FaTimes size={24} />
                        ) : (
                            <FaBars size={24} />
                        )}
                    </button>
                </div>
            </nav>

            {/* Small or Medium Size Screen Searchbar Overlay */}
            <nav className={`flex items-center bg-white dark:bg-background shadow-md overflow-hidden transition-all duration-300 ${searchOpen
                ? "max-h-50 opacity-100"
                : "max-h-0 opacity-0"
                }`}>
                <div className="flex flex-1 gap-2 items-center max-w-xl md:max-w-2xl mx-auto px-3 sm:px-5 pt-1 pb-4">
                    {/* Filter Button */}
                    <Button
                        type="button"
                        aria-label="Open filters"
                        className="inline-flex items-center gap-1 rounded-sm border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-300 transition-colors p-2"
                    >
                        <FaFilter className="w-4 h-4" />
                    </Button>

                    {/* Searchbar */}
                    <Searchbar
                        ref={inputRef}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        clearQuery={clearQuery}
                        onSubmit={handleSubmit}
                        onKeyDown={handleKeyDown}
                        placeholder="Search"
                        className="flex-1 max-w-2xl"
                        showButton={true}
                    />
                </div>
            </nav>

            {/* Mobile Navigation Menu */}
            <nav
                className={`lg:hidden bg-white dark:bg-background shadow-md overflow-hidden transition-all duration-300 ${mobileMenuOpen
                    ? "max-h-100 opacity-100"
                    : "max-h-0 opacity-0"
                    }`}
            >
                <div className="container mx-auto px-4 py-4 flex justify-center items-center flex-col gap-4">
                    <ul className="flex flex-col gap-4 text-gray-700 dark:text-white">
                        {navLinks.map((link) => {
                            if (link.authRequired && !currentUser) return null;

                            const actualPath =
                                link.path === "/"
                                    ? currentUser
                                        ? `/${currentUser.buyerProfile?.username}`
                                        : "/"
                                    : link.path;

                            let isActive = false;
                            if (link.path === "/") {
                                if (currentUser) {
                                    isActive = currentPath === `/${currentUser.buyerProfile?.username}`;
                                }
                                else {
                                    isActive = currentPath === "/";
                                }
                            }
                            else {
                                isActive = currentPath === actualPath || currentPath.startsWith(actualPath);
                            }

                            return (
                                <li key={link.path}>
                                    <Link
                                        href={actualPath}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`text-base transition-colors ${isActive
                                            ? "text-green-600 dark:text-green-400 font-semibold border-b-2 border-green-600 dark:border-green-600 pb-1"
                                            : "hover:text-gray-900 dark:hover:text-green-400"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {currentUser && currentUser.buyerProfile ? (
                        <>
                            <Link
                                href={`/${currentUser.buyerProfile.username}/my-profile/dashboard`}
                                onClick={toggleMenu}
                                className="flex items-center gap-2"
                            >
                                <Avatar className="h-8 w-8 cursor-pointer border border-gray-900 dark:border-gray-100">
                                    {currentUser.profilePictureUrl ? (
                                        <AvatarImage
                                            src={currentUser.profilePictureUrl}
                                            alt={currentUser.buyerProfile.fullName}
                                        />
                                    ) : (
                                        <AvatarFallback>
                                            {(
                                                currentUser.buyerProfile.fullName ??
                                                currentUser.buyerProfile.username ??
                                                "U"
                                            )
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>{" "}
                                My Profile
                            </Link>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button className="flex items-center gap-2">
                                        <FaSignOutAlt /> Logout
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-lg">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you sure you want to logout?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will end your session and
                                            return you to the sign-in page.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel
                                            onClick={() => {
                                                toggleMenu();
                                            }}
                                        >
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => {
                                                handleLogout();
                                            }}
                                        >
                                            Logout
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    ) : (
                        <div className="flex flex-col justify-evenly items-center gap-4">
                            <Link href="/login">
                                <Button
                                    size="sm"
                                    className="flex-1 font-semibold"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button
                                    size="sm"
                                    className="flex-1 font-semibold"
                                    variant="outline"
                                >
                                    Join
                                </Button>
                            </Link>
                        </div>
                    )}

                    <Link href="/become-seller" className="sm:hidden text-sm font-semibold text-green-500 dark:text-green-400 hover:text-green-600 hover:dark:text-green-300 hover:underline transition-all duration-200">
                        Become a seller
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;