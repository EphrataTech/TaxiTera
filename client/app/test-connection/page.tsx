"use client";

import { useState } from "react";

export default function TestConnectionPage() {
  const [results, setResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setTesting(true);
    setResults([]);
    
    // Test 1: Basic server health check
    addResult("Testing server connection...");
    try {
      const response = await fetch('http://localhost:5000/health');
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Server is running: ${JSON.stringify(data)}`);
      } else {
        addResult(`❌ Server responded with status: ${response.status}`);
      }
    } catch (error) {
      addResult(`❌ Cannot connect to server: ${error}`);
    }

    // Test 2: Auth endpoint test
    addResult("Testing auth endpoint...");
    try {
      const response = await fetch('http://localhost:5000/auth/test');
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Auth endpoint working: ${JSON.stringify(data)}`);
      } else {
        addResult(`❌ Auth endpoint failed with status: ${response.status}`);
      }
    } catch (error) {
      addResult(`❌ Auth endpoint error: ${error}`);
    }

    // Test 3: CORS test
    addResult("Testing CORS configuration...");
    try {
      const response = await fetch('http://localhost:5000/auth/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        addResult(`✅ CORS is properly configured`);
      } else {
        addResult(`❌ CORS test failed with status: ${response.status}`);
      }
    } catch (error) {
      addResult(`❌ CORS error: ${error}`);
    }

    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Server Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Diagnostics</h2>
          <p className="text-gray-600 mb-4">
            This page will test the connection to your backend server running on port 5000.
          </p>
          
          <button
            onClick={testConnection}
            disabled={testing}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {testing ? "Testing..." : "Run Connection Test"}
          </button>
        </div>

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Test Results</h3>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded ${
                    result.includes('✅') 
                      ? 'bg-green-50 text-green-800' 
                      : result.includes('❌')
                      ? 'bg-red-50 text-red-800'
                      : 'bg-gray-50 text-gray-800'
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Quick Fix Steps</h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li>Make sure your backend server is running on port 5000</li>
            <li>In your terminal, navigate to the server folder: <code className="bg-yellow-100 px-2 py-1 rounded">cd server</code></li>
            <li>Start the server: <code className="bg-yellow-100 px-2 py-1 rounded">npm run start:dev</code></li>
            <li>You should see: "🚀 Server running on http://localhost:5000"</li>
            <li>Then refresh this page and run the test again</li>
          </ol>
        </div>
      </div>
    </div>
  );
}