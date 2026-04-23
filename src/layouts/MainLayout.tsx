import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  hideHeader = false, 
  hideFooter = false 
}) => {
  return (
    <>
      {!hideHeader && <Header />}
      <main className="min-h-screen bg-background overflow-x-hidden">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </>
  );
};

export default MainLayout;