"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Rewards", path: "/rewards" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF]">
      <header className="bg-[#ECECEC] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-28 sm:h-32">
            <nav className="flex gap-2 sm:gap-3">
              {navItems.map((item) => (
                <Link
                  key={ item.path }
                  href={ item.path }
                  className={`
                    px-6 sm:px-8 py-3 sm:py-4
                    rounded-lg
                    border border-sdsu-blue
                    bg-white/90
                    shadow-sm
                    text-xs sm:text-sm font-medium
                    text-gray-900
                    transition-all
                    hover:bg-white
                    hover:shadow-md
                    ${pathname === item.path ? "ring-2 ring-sdsu-blue ring-opacity-50" : ""}
                  `}
                >
                  { item.label }
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="img-circle w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg sm:text-xl shadow-lg">
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}