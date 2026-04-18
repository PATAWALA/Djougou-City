import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const TestLogin: React.FC = () => {
  const [email, setEmail] = useState('adm@gmail.com');
  const [password, setPassword] = useState('adm2003');
  const [result, setResult] = useState('');

  const testLogin = async () => {
    setResult('1. Tentative de connexion...');
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setResult(`❌ Erreur auth: ${authError.message} (code: ${authError.status})`);
      return;
    }

    setResult(`✅ Auth OK. User ID: ${authData.user.id}\n2. Récupération du rôle...`);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError) {
      setResult(prev => `${prev}\n❌ Erreur profil: ${profileError.message} (code: ${profileError.code})`);
      return;
    }

    const role = profile?.role || 'user';
    setResult(prev => `${prev}\n✅ Rôle détecté: ${role}`);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', fontFamily: 'monospace' }}>
      <h2>Test Connexion Admin</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>Email:</label><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Mot de passe:</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>
      <button
        onClick={testLogin}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#C0392B',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Tester la connexion
      </button>
      <pre style={{
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all'
      }}>
        {result || 'En attente du test...'}
      </pre>
    </div>
  );
};

export default TestLogin;