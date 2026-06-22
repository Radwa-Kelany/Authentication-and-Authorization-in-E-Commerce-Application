'use client'
import { redirect } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useState } from "react";
import { sendOTP } from "./sendOTP"
import ErrorComponent from "../../../../components/Error";
import { useParams } from "next/navigation";

const initialState = {
  success: false,
  error: "",
};
export default function Form() {
  const { user } = useParams();
  const [showError, setShowError] = useState(false);
  const [state, formAction, isPending] = useActionState(
    sendOTP,
    initialState
  );

  useEffect(() => {
    if (state.error) {
      console.log("error")
      setShowError(true);
    }
    else if (state?.success) {
      localStorage.setItem('session_token', state.message);
      redirect(`/signup/${user}/verifyotp`);
    }
  }, [state]);
  return (
    <form action={formAction} className="p-10 w-full space-y-4">
      <div>
        <label htmlFor="email" className="block mb-1 font-medium w-30">Email</label>
        <input id="email" type="email" name="email" placeholder="Enter your email" className="w-full border  border-gray-300 p-2 rounded-lg shadow" />
      </div>
      {showError && (
        <ErrorComponent
          errors={[state?.error]}
          onClose={() => setShowError(false)}
        />
      )}
      <div>
        <button
          type="submit"
          disabled={isPending}
          className={`w-full bg-yellow-500 text-white p-2 rounded-3xl ${isPending && "bg-gray-400 text-black cursor-not-allowed"
            }`}
        >
          {isPending ? "sending OTP ..." : "Send OTP"}
        </button>
      </div>
    </form>
  )
}