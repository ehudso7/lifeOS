import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function PluginSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    setTimeout(() => {
      router.push('/plugins');
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-4">✅ Purchase Complete!</h1>
      <p className="text-gray-600 mb-2">
        Your plugin access has been granted.
      </p>
      <p className="text-sm text-gray-500">
        Redirecting to plugin dashboard in {countdown}...
      </p>
    </div>
  );
}

