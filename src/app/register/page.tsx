"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER" as "USER" | "ADMIN",
  });

  const router = useRouter();

  async function register() {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      alert(data.error || "Registration failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-96 p-6 shadow-lg rounded">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        {/* Role Selector */}
        <div className="flex mb-5 rounded overflow-hidden border">
          <button
            onClick={() => setForm({ ...form, role: "USER" })}
            className={`flex-1 py-2 text-sm font-medium transition-colors duration-150 ${
              form.role === "USER"
                ? "bg-black text-white"
                : "bg-white text-gray-500 hover:bg-gray-100"
            }`}
          >
            User
          </button>
          <button
            onClick={() => setForm({ ...form, role: "ADMIN" })}
            className={`flex-1 py-2 text-sm font-medium transition-colors duration-150 ${
              form.role === "ADMIN"
                ? "bg-black text-white"
                : "bg-white text-gray-500 hover:bg-gray-100"
            }`}
          >
            Admin
          </button>
        </div>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full border p-2 mb-3"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="w-full border p-2 mb-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={register}
          className="w-full bg-black text-white p-2 rounded"
        >
          Register as {form.role}
        </button>
      </div>
    </div>
  );
}