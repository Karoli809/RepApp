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
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (googleReady && window.google) {
      window.google.accounts.id.initialize({
        client_id: '47336119194-pgct1111uqntprt7fbp8db0f2ei5ngg9.apps.googleusercontent.com',
        callback: handleCredentialResponse
      });

      window.google.accounts.id.renderButton(
        document.getElementById("g_id_signin"),
        { theme: "filled_blue", size: "large", shape: "pill" }
      );
    }
  }, [googleReady]);

  const handleCredentialResponse = (response) => {
    const userInfo = parseJwt(response.credential);
    setUser(userInfo);
    const clientData = dummyData[userInfo.email] || null;
    setData(clientData);
  };

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
        {/* Levá prázdná strana */}
        <div className="w-1/2 bg-[#1992c2]" />

        {/* Pravá strana s obrázkem a přihlášením */}
        <div className="w-1/2 bg-white flex flex-col items-center justify-center p-6">
          <img src="/ondulogo.png" alt="Report grafika" className="w-full max-w-md mb-6" />
          <div id="g_id_signin" />
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
        <h1 className="text-3xl font-bold">Váš účetní přehled</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
        >
          Odhlásit se
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Příjmy" value={data.revenue} color="green" />
        <Card title="Náklady" value={data.expenses} color="red" />
        <Card title="Zisk" value={data.netProfit} color="blue" />
      </div>
    </div>
  );
}

const Card = ({ title, value, color }) => (
  <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 text-center">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className={`text-${color}-600 text-3xl font-bold`}>{value.toLocaleString()} Kč</p>
  </div>
);
