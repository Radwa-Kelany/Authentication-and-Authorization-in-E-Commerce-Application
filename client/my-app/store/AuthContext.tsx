'use client'
import { decodeToken } from '@/app/utils/decodeToken';
import { createContext, useContext, useState } from 'react';
type AuthContextType = {
  name: string
  role: string[],
  accessToken: string
  setAuth: (accessToken: string) => void,
  getAuth: () => { name: string | null, role: string[] | null, accessToken: string | null }
};

export const AuthContext = createContext<AuthContextType>({
  name: '',
  role: [],
  accessToken: '',
  setAuth: () => { },
  getAuth: () => ({ name: '', role: [], accessToken: '' })
});


export default function AuthProvider({ children }: { children: any }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  function setAuth(accessToken: string) {
    console.log(accessToken)
    setAccessToken(accessToken);
    const { name, roles } = decodeToken(accessToken);
    setUsername(name);
    if (roles) {
      setRole(roles);
      localStorage.setItem('roles', roles);
    }
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('name', name);

  }
  function getAuth() {
    const accessToken = localStorage.getItem('accessToken');
    const name = localStorage.getItem('name');
    const roleString = localStorage.getItem('roles');
    if (!accessToken || !name || !roleString) return { accessToken: null, name: null, role: null };
    const role = roleString.split(',').filter(Boolean);
    return { accessToken, name, role };
  }
  return (
    <AuthContext.Provider value={{
      name: username,
      role: role,
      accessToken: accessToken,
      setAuth,
      getAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}