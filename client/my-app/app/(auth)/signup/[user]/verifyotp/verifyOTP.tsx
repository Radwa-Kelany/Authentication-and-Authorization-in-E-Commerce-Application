export async function verifyOTP(prevState: any, formData: FormData) {
  const session_token = localStorage.getItem('session_token');
  if (!session_token) return
  let data = Object.fromEntries(formData.entries());
  data = { ...data, session_token };
  const response = await fetch('http://localhost:5000/api/v1/auth/register/verifyOTP', {
    method: 'POST',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  const res = await response.json();
  if (response.ok) {
    return {
      success: true,
      message: res.message,
    };
  } else {
    return {
      success: false,
      error: res.error,
    };
  }

}