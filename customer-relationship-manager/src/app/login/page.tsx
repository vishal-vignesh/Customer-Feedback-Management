"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
 
export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"USER" | "ADMIN">("USER");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
 
  async function handleSubmit(e: any) {
    e.preventDefault();
 
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
    });
 
    const data = await res.json();
 
    if (res.ok) {
      if (data.role === "ADMIN") {
        router.push("/admin/products");
      } else {
        router.push("/products");
      }
    } else {
      alert(data.error);
    }
  }
 
  return (
    <div>
      <h2>Login</h2>
      <div>
        <button onClick={() => setMode("USER")}>
          User Login
        </button>
        <button onClick={() => setMode("ADMIN")}>
          Admin Login
        </button>
      </div>
 
      <h3>{mode} Login</h3>
 
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
        <button type="submit">
          Login as {mode}
        </button>
      </form>
    </div>
  );
}
 