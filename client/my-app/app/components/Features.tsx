
const features = [
  {
    id: 1,
    title: "Verified Sellers",
    description: " Trusted merchants with strict verification process.",
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none"
      viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4 9 5.567 9 7.5 10.343 11 12 11z" />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M19 21v-2a7 7 0 00-14 0v2" />
    </svg>),
    bg: "bg-blue-50",
    text: "text-blue-600"
  },
  {
    id: 2,
    title: "Fast Delivery",
    description: "Optimized logistics for fast global shipping.",
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none"
      viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13.1" />
    </svg>),
    bg: "bg-green-50",
    text: "text-green-600"
  },
  {
    id: 3,
    title: "Large Inventory",
    description: "Thousands of products across multiple categories.",
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none"
      viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 10h18M5 10l1-6h12l1 6M4 10v10a2 2 0 002 2h12a2 2 0 002-2V10" />
    </svg>),
    bg: "bg-violet-50",
    text: "text-violet-600"

  },
  {
    id: 4,
    title: "24/7 Support",
    description: "Always available customer support system.",
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none"
      viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 8v4l3 3" />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>),
    bg: "bg-orange-50",
    text: "text-orange-600"
  },

]
export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold">
            Why Choose ShopHub?
          </h2>

          <p className="text-gray-600 mt-4 text-lg">
            Built for speed, trust, and seamless shopping experience.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`p-6 rounded-xl ${feature.bg} shadow hover:shadow-lg transition text-center`}
            >
              <div className={`w-14 h-14 mx-auto mb-4 ${feature.text}`}>
                {feature.icon}
              </div>
              <h3 className="font-semibold text-xl">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}