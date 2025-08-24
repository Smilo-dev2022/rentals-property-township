
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import { useEffect } from 'react';

const Index: React.FC = () => {
  useEffect(() => {
    document.title = 'Cassie Rentals — Township Property Marketplace';
  }, []);
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
};

export default Index;
