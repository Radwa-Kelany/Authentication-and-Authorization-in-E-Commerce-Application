import Link from 'next/link';
import Image from 'next/image';


const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: '$149',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
  },
  {
    id: 3,
    name: 'Gaming Mouse',
    price: '$49',
    image:
      'https://images.unsplash.com/photo-1527814050087-3793815479db',
  },

  // Clothing
  {
    id: 4,
    name: 'Men Casual T-Shirt',
    price: '$79',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
  },
  {
    id: 5,
    name: 'Women Fashion Dress',
    price: '$89',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c',
  },
  {
    id: 6,
    name: 'Classic White Shirt',
    price: '$39',
    image:
      'https://images.unsplash.com/photo-1603252109303-2751441dd157',
  },

  // Furniture
  {
    id: 7,
    name: 'Modern Sofa',
    price: '$599',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
  },
  {
    id: 8,
    name: 'Bedroom Set',
    price: '$449',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
  },
  {
    id: 9,
    name: 'Office Chair',
    price: '$199',
    image:
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8',
  },

  // Home Decor
  {
    id: 10,
    name: 'Floor Lamp',
    price: '$89',
    image:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f',
  },
  {
    id: 11,
    name: 'Laptop Stand',
    price: '$35',
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853'
  },
  {
    id: 12,
    name: 'Wall Art Canvas',
    price: '$59',
    image:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
  },
];


export default function Products() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <h2 className="text-3xl font-bold text-center">
          Featured Products
        </h2>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
          >
            <div className="relative h-64">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-lg">
                {product.name}
              </h3>

              <p className="text-blue-600 font-bold text-xl mt-2">
                {product.price}
              </p>

              <button className="mt-4 w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}