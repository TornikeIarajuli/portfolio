'use client';

import { useEffect, useState } from 'react';

export default function GATestPage() {
  const [gtagExists, setGtagExists] = useState(false);
  const [measurementId, setMeasurementId] = useState('');
  const [dataLayerExists, setDataLayerExists] = useState(false);

  useEffect(() => {
    // Check if gtag exists
    setGtagExists(typeof (window as any).gtag === 'function');

    // Check if dataLayer exists
    setDataLayerExists(Array.isArray((window as any).dataLayer));

    // Get measurement ID from environment
    setMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'NOT SET');
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#ff10f0] mb-8">
          🔍 Google Analytics Debug Page
        </h1>

        <div className="space-y-4">
          {/* Measurement ID Check */}
          <div className="border-2 border-[#00ffff] p-4 bg-black/50">
            <h2 className="text-xl font-bold text-[#00ffff] mb-2">
              📊 Measurement ID
            </h2>
            <p className="font-mono">
              {measurementId === 'NOT SET' ? (
                <span className="text-red-500">❌ NOT SET - Add to Netlify env vars!</span>
              ) : (
                <span className="text-green-500">✅ {measurementId}</span>
              )}
            </p>
          </div>

          {/* gtag Function Check */}
          <div className="border-2 border-[#ff10f0] p-4 bg-black/50">
            <h2 className="text-xl font-bold text-[#ff10f0] mb-2">
              🔧 gtag Function
            </h2>
            <p className="font-mono">
              {gtagExists ? (
                <span className="text-green-500">✅ Loaded successfully</span>
              ) : (
                <span className="text-red-500">❌ Not found - Scripts not loading</span>
              )}
            </p>
          </div>

          {/* Data Layer Check */}
          <div className="border-2 border-[#ffff00] p-4 bg-black/50">
            <h2 className="text-xl font-bold text-[#ffff00] mb-2">
              📦 Data Layer
            </h2>
            <p className="font-mono">
              {dataLayerExists ? (
                <span className="text-green-500">✅ Initialized</span>
              ) : (
                <span className="text-red-500">❌ Not initialized</span>
              )}
            </p>
          </div>

          {/* Instructions */}
          <div className="border-2 border-[#39ff14] p-4 bg-black/50">
            <h2 className="text-xl font-bold text-[#39ff14] mb-4">
              📝 What to do:
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>If Measurement ID shows "NOT SET":
                <ul className="ml-6 mt-2 space-y-1 text-sm">
                  <li>→ Go to Netlify dashboard</li>
                  <li>→ Site settings → Environment variables</li>
                  <li>→ Add: NEXT_PUBLIC_GA_MEASUREMENT_ID = G-YESM925KXB</li>
                  <li>→ Redeploy your site</li>
                </ul>
              </li>
              <li className="mt-2">If gtag or dataLayer not found:
                <ul className="ml-6 mt-2 space-y-1 text-sm">
                  <li>→ Check browser console for errors</li>
                  <li>→ Disable ad blockers</li>
                  <li>→ Try in Incognito mode</li>
                </ul>
              </li>
              <li className="mt-2">All green? You're good! 🎉
                <ul className="ml-6 mt-2 space-y-1 text-sm">
                  <li>→ Visit Google Analytics Realtime report</li>
                  <li>→ You should see this page view</li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Browser Console Check */}
          <div className="border-2 border-[#b000ff] p-4 bg-black/50">
            <h2 className="text-xl font-bold text-[#b000ff] mb-2">
              🖥️ Browser Console Test
            </h2>
            <p className="text-sm mb-2">Open DevTools (F12) and run:</p>
            <code className="block bg-gray-900 p-2 rounded text-xs">
              console.log('gtag:', typeof gtag);<br/>
              console.log('dataLayer:', window.dataLayer);<br/>
              console.log('GA ID:', '{measurementId}');
            </code>
            <p className="text-sm mt-2 text-gray-400">
              Should show: gtag: "function", dataLayer: Array, GA ID: "G-YESM925KXB"
            </p>
          </div>

          {/* Back Link */}
          <div className="text-center pt-4">
            <a
              href="/"
              className="inline-block px-6 py-3 border-2 border-[#ff10f0] text-[#ff10f0] hover:bg-[#ff10f0] hover:text-black transition-all duration-300 font-bold tracking-wider"
            >
              ← BACK TO HOME
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
