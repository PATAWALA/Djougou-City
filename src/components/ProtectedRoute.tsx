import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactElement;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      if (adminOnly) {
        // Vérification unique via la table admins
        const { data, error } = await supabase
          .from('admins')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();
        setAllowed(!error && !!data);
      } else {
        setAllowed(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [adminOnly]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;