import React, { useEffect, useState } from 'react';

const dummyData = {
  "client1@example.com": {
    revenue: 220000,
    expenses: 97000,
    netProfit: 123000
  },
  "client2@example.com": {
    revenue: 180000,
    expenses: 120000,
    netProfit: 60000
  }
};

export default function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.handleCredentialResponse = (response) => {
      const userInfo = parseJwt(response.credential);
      setUser(userInfo);
      const clientData = dummyData[userInfo.email] || null;
      setData(clientData);
    };

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '47336119194-pgct1111uqntprt7fbp8db0f2ei5ngg9.apps.googleusercontent.com',
        callback: window.handleCredentialResponse
      });

      window.google.accounts.id.renderButton(
        document.getElementById("g_id_signin"),
        { theme: "filled_blue", size: "large", shape: "pill" }
      );
    }
  }, []);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setData(null);
    localStorage.clear();
  };

  if (!user) {
    return (
      <div className="flex h-screen">
        {/* Levá strana */}
        <div className="w-1/2 bg-[#1992c2] text-white flex flex-col justify-center items-center p-12">
          <h1 className="text-4xl font-bold mb-2">RepApp</h1>
          <p className="text-xl mb-8">Aplikace na reporting</p>
        </div>

        {/* Pravá strana s obrázkem a přihlášením */}
        <div className="w-1/2 bg-white flex flex-col items-center justify-center p-6">
          <img src="/ondulogo.png" alt="Report grafika" className="w-full max-w-md mb-6" />
          <div id="g_id_signin"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 text-xl">
        Data nebyla nalezena pro uživatele {user.email}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Váš účetní přehled</h1
