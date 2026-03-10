import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-8 text-center font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-5">
        Customer Feedback Management
      </h1>
      <p className="text-gray-500 text-lg max-w-md mb-10 leading-relaxed">
        Collect, analyze, and respond to customer reviews in one place. Built
        for teams that take feedback seriously.
      </p>
      <div className="flex items-center gap-4">
        <Link
          href="/register"
          className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
        >
          Create account
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:border-gray-400 hover:text-black transition-colors"
        >
          Sign in →
        </Link>
      </div>
    </main>
  );
}