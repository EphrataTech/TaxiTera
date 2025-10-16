'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

export default function TestConnection() {
  const [status, setStatus] = useState('');
  const [users, setUsers] = useState([]);

  const testConnection = async () => {
    try {
      setStatus('Testing connection...');
      const response = await api.get('/users');
      setUsers(response);
      setStatus('✅ Connected successfully!');
    } catch (error) {
      setStatus('❌ Connection failed: ' + error.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Client-Server Connection</h1>
      <button 
        onClick={testConnection}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Connection
      </button>
      <p className="mt-4">{status}</p>
      {users.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Users:</h2>
          <pre className="bg-gray-100 p-2 rounded mt-2">
            {JSON.stringify(users, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}