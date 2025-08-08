import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  signInWithCustomToken
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { apiFetch } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  plan: string;
  preferredAiModel: string;
  settings: any;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  signInWithCustomToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Get the ID token
        const idToken = await firebaseUser.getIdToken();
        localStorage.setItem('authToken', idToken);
        
        // Fetch user data from our backend
        try {
          const response = await apiFetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${idToken}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
          } else {
            console.error('Failed to fetch user data');
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        // User signed out
        localStorage.removeItem('authToken');
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Use Firebase SDK to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      // Store the token
      localStorage.setItem('authToken', idToken);
      
      // Fetch user data from our backend
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (userData: any) => {
    try {
      // Use Firebase SDK to create user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      // Call our backend to create user profile
      const response = await apiFetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // If custom token is provided, sign in with it
        if (data.customToken) {
          await signInWithCustomToken(auth, data.customToken);
        }
        
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signInWithCustomTokenAuth = async (token: string) => {
    try {
      await signInWithCustomToken(auth, token);
    } catch (error: any) {
      console.error('Custom token sign in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    login,
    signup,
    logout,
    updateUser,
    signInWithCustomToken: signInWithCustomTokenAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 