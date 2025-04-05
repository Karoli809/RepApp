import React, { useState, useEffect } from 'react';

const Card = ({ children }) => (
  <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 transition-transform hover:scale-[1.02]">
    {children}
  </div>
);

const Button = ({ children, onClick }) => (
  <button onClick={onClick} className="bg-[#1992c2] text-white px-6 py-3 rounded-full hover:bg-[#78b2b8] transition w-full">
    {children}
  </button>
);

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

export default function Dashboard() {
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
        client_id: 'YOUR_GOOGLE_CLIENT_ID',
        callback: window.handleCredentialResponse
      });

      window.google.accounts.id.renderButton(
        document.getElementById("g_id_signin"),
        { theme: "filled_blue", size: "large", shape: "pill" }
      );
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    setData(null);
    localStorage.clear();
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen bg-[#1992c2] justify-center items-center">
        <div className="text-center w-full max-w-md">
          <img
            src="/ondulogo.png" // Ensure your logo is available here
            alt="Report grafika"
            className="w-96 h-96 mb-6 mx-auto object-contain"
          />
          <h1 className="text-4xl font-bold text-white mb-2">RepApp</h1>
          <p className="text-white text-base mb-6">Aplikace na reporting</p>
          <div id="g_id_signin" className="flex justify-center"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center mt-10 text-red-500">Data nebyla nalezena pro uživatele {user.email}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold">Váš účetní přehled</h1>
        <Button onClick={handleLogout}>Odhlásit se</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h2 className="text-xl font-semibold">Příjmy</h2>
          <p className="text-green-600 text-3xl font-bold">{data.revenue.toLocaleString()} Kč</p>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Náklady</h2>
          <p className="text-red-600 text-3xl font-bold">{data.expenses.toLocaleString()} Kč</p>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Zisk</h2>
          <p className="text-blue-600 text-3xl font-bold">{data.netProfit.toLocaleString()} Kč</p>
        </Card>
      </div>
    </div>
  );
}
