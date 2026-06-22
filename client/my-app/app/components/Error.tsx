import Link from "next/link";

type ErrorComponentProps = {
  errors?: string[];
  onClose?: () => void;
};

export default function ErrorComponent({
  errors,
  onClose,
}: ErrorComponentProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-xl font-bold text-red-600">
          Registration Failed
        </h2>

        <div className="mb-6">
          {errors?.length ? (
            <ul className="space-y-2">
              {errors.map((error, index) => (
                <li key={index} className="text-red-600">
                  • {error}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">
              Something went wrong. Please try again.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}