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

  const handleCredentialResponse = (response) =>

  
