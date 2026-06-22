import Link from 'next/link';
export default function Hero() {
  return (
    <section className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6">
              Everything You Need,
              All in One Marketplace
            </h1>

            <p className="text-lg mb-8">
              Discover thousands of products from
              trusted sellers. Shop securely, compare
              prices, and enjoy a seamless buying
              experience.
            </p>

            <Link
              href="#products"
              className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500"
            >
              Start Shopping
            </Link>
          </div>

          <div>
            <img
              src="hero4.png"
              alt="Online shopping"
              className=""
            />
          </div>
        </div>
      </div>
    </section>
  )
}