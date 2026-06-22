import Form from "./Form";
export default function OTPPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow">
        <h1 className="text-center text-3xl font-bold text-cyan-700 mb-2">
          Verify OTP
        </h1>
        <Form></Form>
      </div></div>
  );
}