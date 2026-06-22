"use client";
import { redirect } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useState } from "react";
import { register } from "./sendFormData";
import ErrorComponent from "../../../components/Error";
import SuccessComponent from "@/app/components/Success";

const initialState = {
  success: false,
  error: "",
};

export default function Form({ userType }: any) {

  const [email, setEmail] = useState("");
  const [showError, setShowError] = useState(false);

  const [state, formAction, isPending] = useActionState(
    register,
    initialState
  );

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) { setEmail(email); }

    if (state?.error) {
      setShowError(true);
    }
    else if (state?.success) {
      redirect(`/signup/success`);
    }
  }, [state]);


  return (
    <form action={formAction} className="p-10 w-full  grid grid-cols-2 gap-8">

      {/* hidden userType */}
      <input type="hidden" name="userType" value={userType} />
      <div >
        <label
          htmlFor="firstName"
          className="block mb-1 font-medium w-30"
        >
          First Name
          <span className="text-red-500 ml-1">
            *
          </span>
        </label>

        <input
          id="firstName"
          name="firstName"
          type="text"
          required
          pattern="[A-Za-z]{2,}"
          title="First name must contain only letters and at least 2 characters"
          className="w-full border  border-gray-300 p-2 rounded-lg shadow"
        />
      </div>


      <div>
        <label
          htmlFor="lastName"
          className="block mb-1 font-medium"
        >
          Last Name
          <span className="text-red-500 ml-1">
            *
          </span>
        </label>

        <input
          id="lastName"
          name="lastName"
          type="text"
          required
          pattern="[A-Za-z]{2,}"
          title="First name must contain only letters and at least 2 characters"
          className="w-full border  border-gray-300 p-2 rounded shadow"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block mb-1 font-medium"
        >
          Phone Number
          <span className="text-red-500 ml-1">
            *
          </span>
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          required
          pattern="[0-9]{10,}"
          title="Phone must contain at least 10 numbers"
          className="w-full border  border-gray-300 p-2 rounded shadow"
        />
      </div>

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
          defaultValue={email}
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
          name="password"
          type="password"
          required
          minLength={8}
          pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*]).+$"
          title="Password must contain at least one capital letter and one special character"
          className="w-full border border-gray-300 p-2 rounded shadow"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block mb-1 font-medium"
        >
          Confirm Password
          <span className="text-red-500 ml-1">
            *
          </span>
        </label>

        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          required
          className="w-full border border-gray-300 p-2 rounded shadow"
        />
      </div>

      {userType === "customer" && <div>
        <label
          htmlFor="dob"
          className="block mb-1 font-medium"
        >
          Date of Birth

        </label>

        <input
          id="dob"
          type="date"
          name="dob"
          className="w-full border border-gray-300 p-2 rounded text-gray-500 shadow"
        />
      </div>}
      {userType === "customer" && <div>
        <label
          htmlFor="gender"
          className="block mb-1 font-medium"
        >
          Gender
        </label>

        <select
          name="gender"
          defaultValue=""
          className="w-full border border-gray-300 p-2 px-5 rounded text-gray-500 shadow"
        >
          <option value="" disabled>
            Select Gender
          </option>

          <option value="Male">
            Male
          </option>

          <option value="Female">
            Female
          </option>
        </select>
      </div>}


      {userType === "seller" && <div>
        <label
          htmlFor="storeName"
          className="block mb-1 font-medium"
        >
          Store Name
          <span className="text-red-500 ml-1">*</span>
        </label>

        <input
          id="storeName"
          type="text"
          name="storeName"
          required
          placeholder="Enter your store name"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>}

      {userType === "seller" && <div>
        <label
          htmlFor="storeSlug"
          className="block mb-1 font-medium"
        >
          Store Slug
          <span className="text-red-500 ml-1">*</span>
        </label>

        <input
          id="storeSlug"
          type="text"
          name="storeSlug"
          required
          placeholder="my-store"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        <p className="text-xs text-gray-500 mt-1">
          Example: your-store.com/stores/my-store
        </p>
      </div>}

      {userType === "seller" &&
        <div>
          <label
            htmlFor="businessName"
            className="block mb-1 font-medium"
          >
            Business Name
          </label>

          <input
            id="businessName"
            type="text"
            name="businessName"
            placeholder="Registered business name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>}

      {userType === "seller" && <div>
        <label
          htmlFor="taxNumber"
          className="block mb-1 font-medium"
        >
          Tax Number
        </label>

        <input
          id="taxNumber"
          type="text"
          name="taxNumber"
          placeholder="VAT / Tax number"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>}
      {/* SERVER ERROR */}
      {showError && (
        <ErrorComponent
          errors={[state?.error]}
          onClose={() => setShowError(false)}
        />
      )}
      {/* {state?.error && (
     <p>{state?.error}</p>

      )
      } */}




      {/* SUBMIT BUTTON */}
      <div className="col-span-2">
        <button
          type="submit"
          disabled={isPending}
          className={`w-full bg-yellow-500 text-white p-2 rounded-3xl ${isPending && "bg-gray-400 text-black cursor-not-allowed"
            }`}
        >
          {isPending ? "Registering..." : "Register"}
        </button>
      </div>


    </form >
  );
}