import Link from "next/link";
import Form from "./Form";
export default async function SignupPage({ params }: { params: Promise<{ user: string }> }) {
  const { user } = await params;
  return (
    <div>
      {user === "customer" && <div className="min-h-screen grid grid-cols-2 gap-10 justify-center bg-[linear-gradient(to_bottom_right,#033b5c_0%,#ffffff_30%,#ffffff_70%,#033b5c_100%)]">
        <div className="col-span-2">
          <div className="bg-white max-w-2xl mx-auto mt-10 pb-6 pt-10 rounded-xl shadow-2xl ">
            <p className=" text-right text-sm mx-5">Have an account?
              <Link href="/login" className="mx-2 text-yellow-500 font-bold">
              Login</Link></p>
            <Form userType="customer" />
          </div>
        </div>
      </div>}
      {user === "seller" && <div className="min-h-screen flex items-center justify-center p-6 
bg-[linear-gradient(to_bottom_right,#033b5c_0%,#ffffff_30%,#ffffff_70%,#033b5c_100%)]">
        <div className="w-full max-w-6xl bg-white rounded-2xl overflow-hidden shadow-2xl">
          <div className="">
            <div className="p-8 lg:p-12 overflow-y-auto">
              <h1 className="text-3xl font-bold text-cyan-700 mb-2">
                Become a Seller
              </h1>

              <p className="text-gray-500 mb-8">
                Register your store and start selling today.
              </p>
              <Form userType="seller" />
            </div>
          </div>
        </div>
      </div>}
    </div>

  );
}