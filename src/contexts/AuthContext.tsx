import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // adjust path if needed
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  year: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  college: string;
  year: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("smak-user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("smak-user");
      }
      setInitialized(true);
    };

    initializeAuth();
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    if (!initialized) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      if (firebaseUser) {
        try {
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

          let userData: User;
          if (userDoc.exists()) {
            const firestoreData = userDoc.data();
            userData = {
              id: firebaseUser.uid,
              name: firestoreData.name || firebaseUser.displayName || "User",
              email: firebaseUser.email || "",
              college: firestoreData.college || "Unknown",
              year: firestoreData.year || "Unknown"
            };
          } else {
            // If no Firestore document exists, create basic user object
            userData = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || "User",
              email: firebaseUser.email || "",
              college: "Unknown",
              year: "Unknown"
            };
          }

          setUser(userData);
          localStorage.setItem("smak-user", JSON.stringify(userData));
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          // Fallback to basic user data from Firebase Auth
          const userData: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "User",
            email: firebaseUser.email || "",
            college: "Unknown",
            year: "Unknown"
          };
          setUser(userData);
          localStorage.setItem("smak-user", JSON.stringify(userData));
        }
      } else {
        // User is signed out
        setUser(null);
        localStorage.removeItem("smak-user");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [initialized]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Fetch additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

      let userData: User;
      if (userDoc.exists()) {
        const firestoreData = userDoc.data();
        userData = {
          id: firebaseUser.uid,
          name: firestoreData.name || firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
          college: firestoreData.college || "Unknown",
          year: firestoreData.year || "Unknown"
        };
      } else {
        userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
          college: "Unknown",
          year: "Unknown"
        };
      }

      setUser(userData);
      localStorage.setItem("smak-user", JSON.stringify(userData));
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const firebaseUser = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(firebaseUser, {
        displayName: userData.name,
      });

      // Store additional data in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name: userData.name,
        email: userData.email,
        college: userData.college,
        year: userData.year,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const newUser: User = {
        id: firebaseUser.uid,
        name: userData.name,
        email: userData.email,
        college: userData.college,
        year: userData.year,
      };

      setUser(newUser);
      localStorage.setItem('smak-user', JSON.stringify(newUser));
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("smak-user");
      setLoading(false);
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Password reset error:", error);
      setLoading(false);
      return false;
    }
  };

  // Don't render children until auth is initialized
  if (!initialized) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="ml-4">Initializing...</p>
        </div>
    );
  }

  const value = {
    user,
    login,
    register,
    logout,
    resetPassword,
    isAuthenticated: !!user,
    loading
  };

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};