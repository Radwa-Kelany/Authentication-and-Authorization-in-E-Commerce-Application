
import { redirect } from "next/navigation";
import { useAuth } from '../../store/AuthContext';
export default function authRequest(url: string, method: string, body?: any) {

  const { getAuth, setAuth } = useAuth()
  const accessToken = getAuth().accessToken
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  else {
    redirect('/login');
  }

  const fetchData = async () => {
    const response = await fetch(url, { method, body, headers });
    const data = await response.json();
    if (response.ok) {
      return data;
    }
    else if (data.error === 'Invalid or Expired Token') {
      try {
        const res = await fetch('http://localhost:5000/api/v1/auth/refresh', { method: 'GET', credentials: 'include' });
        const data = await res.json();

        setAuth(data.accessToken);
        return authRequest(url, method, body);
      } catch (error) {
        return { error: 'Failed to refresh token' };
      }
    }
  }
  fetchData()
}