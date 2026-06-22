

import { redirect } from "next/navigation";
export async function register(prevState: any, formData: FormData) {
  const verifyToken = localStorage.getItem('verify_token');
  if (!verifyToken) return
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const userType = formData.get("userType");
  let data = Object.fromEntries(formData.entries());
  data = { ...data, verifyToken };

  if (password !== confirmPassword) {
    return {
      success: false,
      error: "Passwords do not match",
    };
  }


  const res = await fetch(`http://localhost:5000/api/v1/auth/register/${userType}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response = await res.json();
  if (res.ok) {
    return {
      success: true,
      message: response.message,
    };
  } else {
    return {
      success: false,
      error: response.error,
    };
  }
}