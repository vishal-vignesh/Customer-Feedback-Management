"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAs, setLoginAs] = useState<"USER" | "ADMIN">("USER");
  const router = useRouter();

  async function handleLogin() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    // 🔐 FINAL CHECK (SECURE)
    if (loginAs === "ADMIN" && data.role !== "ADMIN") {
      alert("You are not authorized as Admin");
      return;
    }

    // ✅ REDIRECT BASED ON ROLE
   data.role === "ADMIN"
      ? router.push("/admin")
      : router.push("/users/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 bg-white p-6 shadow-lg rounded">
        <h2 className="text-xl font-bold mb-4 text-center">
          Login to CRM
        </h2>

        {/* ROLE TOGGLE */}
        <div className="flex mb-4 rounded overflow-hidden border">
          {["USER", "ADMIN"].map((role) => (
            <button
              key={role}
              onClick={() => setLoginAs(role as "USER" | "ADMIN")}
              className={`flex-1 p-2 font-medium ${
                loginAs === role
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {role === "ADMIN" ? "Admin" : "User"}
            </button>
          ))}
        </div>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-4"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-2 rounded"
        >
          Login as {loginAs}
        </button>
      </div>
    </div>
  );
}
