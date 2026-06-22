'use client'
import { useEffect} from 'react';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Partners from "./components/Partners";
import Features from "./components/Features";
import Seller from "./components/Seller";
import Footer from "./components/Footer";
import { redirect } from 'next/navigation';

export default function HomePage() {

  useEffect(() => {
    localStorage.setItem("roles","seller")
    const name = localStorage.getItem('name');
    const roles = localStorage.getItem('roles');
    if (name && roles) {
      redirect(`/${roles}`)
    }
    else if(name){
      redirect(`/customer`)
    }
  }, [])
  return (
    <div className="min-h-screen ">
      {/* Navbar */}
      <Navbar userName={null} />
      {/* Hero */}
      <Hero />
      {/* Product Grid */}
      <Products />

      {/* Trusted Partner */}
      <Partners />

      {/* Features */}
      <Features />

      {/* Seller Registration */}
      <Seller />
      {/* Footer */}
      <Footer />
    </div>
  )
}
