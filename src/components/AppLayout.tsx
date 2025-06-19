import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
};

export default AppLayout;