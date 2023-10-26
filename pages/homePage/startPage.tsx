import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="p-6 bg-white rounded shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Dobro došli na našu stranicu!</h1>
        <Link href="/api/auth/login">
          <button className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            Button
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home;

