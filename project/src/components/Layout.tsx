import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1E1E1E',
            color: '#FFFFFF',
            border: '1px solid #E53935',
          },
        }} 
      />
    </div>
  );
};

export default Layout;