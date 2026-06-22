'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
export default function CustomerPage() {
  const [userName, setUserName] = useState<string | null>(null);
  useEffect(() => {
    const name = localStorage.getItem('name');
    if (name) {
      setUserName(name);
    }
  }, [])
  return (
    <div className="min-h-screen bg-gray-50">
          <Navbar userName={userName} />
      <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow">
        <h1 className="text-center text-3xl font-bold text-cyan-700 mb-2">
          Customer Page
        </h1>
      </div>
    </div>
  );
}