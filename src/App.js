// src/App.js
import React, { useEffect, useState } from 'react';

const API_URL = 'https://sheetdb.io/api/v1/YOUR_SHEETDB_ID'; // <-- nahradit vlastním SheetDB API

export default function App() {
  const [userEmail, setUserEmail] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!userEmail) {
      setError('Zadejte e-mailovou adresu');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/search?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      if (data.length === 0) {
        setError('Uživatel nebyl nalezen');
        setUserData(null);
      } else {
        setUserData(data[0]);
        setError('');
      }
    } catch (e) {
      setError('Chyba při načítání dat');
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
        <img src="/onduuvod.png" alt="" className="w-48 h-48 mb-6" />
        <h1 className="text-2xl font-bold mb-4">Přihlášení do ONDU</h1>
        <input
          type="email"
          placeholder="Zadejte e-mail"
          className="p-2 border rounded w-full max-w-sm mb-4"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-[#1992c2] text-white px-6 py-2 rounded hover:bg-[#157aa5] transition mb-2"
        >
          Přihlásit se
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Vítáme v ONDU, {userEmail}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card label="Příjmy" value={userData.revenue} color="green" />
        <Card label="Náklady" value={userData.expenses} color="red" />
        <Card label="Zisk" value={userData.netProfit} color="blue" />
      </div>
    </div>
  );
}

function Card({ label, value, color }) {
  return (
    <div className="bg-gray-100 p-6 rounded shadow text-center">
      <h2 className="text-xl font-semibold mb-2">{label}</h2>
      <p className={`text-${color}-600 text-2xl font-bold`}>{Number(value).toLocaleString()} Kč</p>
    </div>
  );
}
