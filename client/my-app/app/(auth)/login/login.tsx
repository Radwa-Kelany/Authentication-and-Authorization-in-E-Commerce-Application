import { redirect } from "next/navigation";
export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const data = Object.fromEntries(formData)
  // basic validation on server (IMPORTANT)
  if (!email || !password) {
    return {
      success: false,
      error: "Email and password are required",
    };
  }


  const res = await fetch(`http://localhost:5000/api/v1/auth/login`, {
    method: "POST",
    credentials:"include",
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