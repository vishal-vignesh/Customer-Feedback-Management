"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const items = [
  { name: "Products", path: "/admin/products" },
  // { name: "Reviews", path: "/admin/reviews" },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-black text-white p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Admin</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((i) => (
          <Link
            key={i.path}
            href={i.path}
            className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${path === i.path
              ? "bg-blue-600 text-white shadow-lg"
              : "hover:bg-gray-800 text-gray-300 hover:text-white"
              }`}
          >
            {i.name}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto text-left px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
      >
        Sign Out
      </button>
    </aside>
  );
}