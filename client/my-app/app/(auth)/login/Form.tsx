"use client";
import { redirect } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useState } from "react";
import { login } from "./login";
import ErrorComponent from "@/app/components/Error";
import { useAuth } from "@/store/AuthContext";
import { decodeToken } from "@/app/utils/decodeToken";
const initialState = {
  success: false,
  error: "",
};

export default function Form() {
  const { setAuth } = useAuth();
  const [showError, setShowError] = useState(false);

  const [state, formAction, isPending] = useActionState(
    login,
    initialState
  );

  useEffect(() => {
    if (state.error) {
      setShowError(true);
    }
    else if (state?.success) {
      setAuth(state.message);
      const { roles } = decodeToken(state.message);
      if (!roles) { redirect('/customer') }
      else {
        const role = roles[0];
        redirect(`${role}`);
      }
    }
  }, [state]);


  return (
    <form action={formAction} className="space-y-8 p-10 w-full">
      <div>
        <label
          htmlFor="email"
          className="block mb-1 font-medium"
        >
          Email
          <span className="text-red-500 ml-1">
            *
          </span>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          className="w-full border border-gray-300 p-2 rounded shadow"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block mb-1 font-medium"
        >
          Password
          <span className="text-red-500 ml-1">
            *
          </span>
        </label>

        <input
          id="password"
          type="password"
          name="password"
          required
          className="w-full border border-gray-300 p-2 rounded shadow"
        />
      </div>

      {/* SERVER ERROR */}
      {showError && (
        <ErrorComponent
          errors={[state.error]}
          onClose={() => setShowError(false)}
        />
      )}
      {/* SUBMIT BUTTON */}
      <div className="col-span-2">
        <button type="submit"
          disabled={isPending}
          className={`w-full bg-yellow-500 text-white p-2 rounded-3xl ${isPending && "bg-gray-400 text-black cursor-not-allowed"
            }`}
        >
          Login
        </button>
      </div>
    </form>
  );
}