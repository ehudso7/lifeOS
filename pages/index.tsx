import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-10">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold">Welcome to LifeOS</h1>
        <p className="text-gray-600">
          Your emotional operating system starts here.
        </p>
        <Link href="/login">
          <button className="bg-black text-white px-6 py-2 rounded">
            Get Started
          </button>
        </Link>
      </div>
    </main>
  );
}

