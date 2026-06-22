import Link from "next/link";

export default function SuccessComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-cyan-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md w-full border border-gray-100">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800">
          Registration Successful 🎉
        </h1>

        {/* Message */}
        <p className="text-gray-500 mt-3">
          Your account has been created successfully. You can now continue to the homepage.
        </p>

        {/* Button */}
        <Link
          href="/login"
          className="mt-6 inline-block bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-cyan-700 transition"
        >
          Please login
        </Link>
      </div>
    </div>
  );
}