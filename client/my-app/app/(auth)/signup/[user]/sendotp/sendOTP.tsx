export async function sendOTP(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());


  const response = await fetch('http://localhost:5000/api/v1/auth/register/sendOTP', {
    method: 'POST',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  const res = await response.json();
  console.log(res)
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