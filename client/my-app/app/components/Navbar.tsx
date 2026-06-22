'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
export default function Navbar({ userName }: { userName: string | null }) {

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold"
        >
          ShopHub
        </Link>

        <div className="flex items-center gap-6 text-cyan-600">
          <Link
            href="/"
            className="hover:text-yellow-600"
          >
            Home
          </Link>
          {!userName && <Link
            href="/login"
            className="hover:text-yellow-600"
          >
            Login
          </Link>}

          {!userName && <Link
            href="/signup/customer/sendotp"
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-yellow-500"
          >
            Register
          </Link>}
          {userName ? `Hi, ${userName}` : "Hi, Guest"}
          {userName && <Link href="/logout">Logout</Link>}
        </div>
      </div>
    </nav>
  )
}