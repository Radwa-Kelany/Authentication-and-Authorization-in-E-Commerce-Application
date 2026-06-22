import Link from "next/link"
export default function Seller() {
  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div>
            <img
              src="seller.jpg"
              alt="Seller dashboard"
              className="rounded-lg shadow-sm w-full"
            />
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-6">
              Grow Your Business With Us
            </h2>

            <p className="text-gray-600 text-lg mb-6">
              Open your online store and reach
              thousands of customers. Manage products,
              track orders, monitor sales, and expand
              your business from a single platform.
            </p>

            <ul className="space-y-3 mb-8">
              <li>✓ Create your store in minutes</li>
              <li>✓ Manage products easily</li>
              <li>✓ Receive customer orders</li>
              <li>✓ Track sales performance</li>
            </ul>

            <Link
              href="/signup/seller/sendotp"
              className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-500"
            >
              Register Your Store Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}