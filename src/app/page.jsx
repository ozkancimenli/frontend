export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">🏠 TaskTrackr Pro</h1>
      <p className="text-lg">Welcome to your Task Management Dashboard</p>
      <a
        href="/login"
        className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition"
      >
        Go to Login
      </a>
    </main>
  );
}
