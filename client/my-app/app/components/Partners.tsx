import Link from 'next/link';
import Image from 'next/image';

const partners = [
  {
    id: 1,
    name: "Adidas",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg"
  },
  {
    id: 2,
    name: "LG",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg"
  },
  {
    id: 3,
    name: "Nike",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
  },
  {
    id: 4,
    name: "HP",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg"
  },
  {
    id: 5,
    name: "Apple",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
  }

]


export default function Partners() {
  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold">
            Trusted By Leading Brands
          </h2>

          <p className="text-gray-600 mt-4">
            Our marketplace collaborates with businesses across multiple industries.
          </p>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white h-28 rounded-xl shadow flex items-center justify-center hover:shadow-lg transition"
            >
              <img
                src={partner.image}
                alt={partner.name}
                className="h-10 opacity-70 hover:opacity-100 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}