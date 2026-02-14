import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = async (email, password, name, photoUrl) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name, photoURL: photoUrl });
    return res;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    localStorage.removeItem('yoga-token');
    return signOut(auth);
  };

  const setToken = async (userData) => {
    const { data } = await api.post('/api/set-token', userData);
    localStorage.setItem('yoga-token', data.token);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoUrl: firebaseUser.photoURL,
        };
        try {
          await setToken(userData);
          const { data } = await api.get(`/user/${firebaseUser.email}`);
          setUser(data || { ...userData, role: 'student' });
        } catch (err) {
          if (err.response?.status === 401) {
            try {
              await api.post('/new-user', {
                ...userData,
                role: 'student',
                gender: 'Not specified',
                address: 'Not provided',
                phone: 'Not provided',
              });
              await setToken(userData);
              setUser({ ...userData, role: 'student' });
            } catch (e) {
              setUser({ ...userData, role: 'student' });
            }
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = {
    user,
    loading,
    createUser,
    login,
    loginWithGoogle,
    logout,
    setToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
