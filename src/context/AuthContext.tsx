import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { auth, googleProvider } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { saveUserProfile, getUserProfile } from '../services/firestoreService';

interface AuthContextType {
  user: User | null;
  role: UserRole | 'guest';
  isAuthenticated: boolean;
  isFirebaseLoading: boolean;
  switchRole: (role: UserRole | 'guest') => void;
  login: (email: string, role?: UserRole) => boolean;
  register: (name: string, email: string, role: UserRole) => boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
  addPoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS.student);
  const [role, setRole] = useState<UserRole | 'guest'>('student');
  const [isFirebaseLoading, setIsFirebaseLoading] = useState<boolean>(true);

  // Sync Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const isAdminEmail = fbUser.email === 'anshikagupta0177@gmail.com';
        const determinedRole: UserRole = isAdminEmail ? 'admin' : 'student';

        // Attempt to fetch existing profile from Firestore
        let userDoc = await getUserProfile(fbUser.uid);
        if (!userDoc) {
          userDoc = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Learnova Member',
            email: fbUser.email || 'user@learnova.edu',
            role: determinedRole,
            avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            learningStreakDays: 3,
            totalPoints: 250,
            badges: ['Verified Google Learner'],
          };
          await saveUserProfile(userDoc);
        }

        setCurrentUser(userDoc);
        setRole(userDoc.role);
      }
      setIsFirebaseLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const isAdminEmail = fbUser.email === 'anshikagupta0177@gmail.com';
      const determinedRole: UserRole = isAdminEmail ? 'admin' : 'student';

      const userDoc: User = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Learnova Engineer',
        email: fbUser.email || 'user@learnova.edu',
        role: determinedRole,
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        learningStreakDays: 3,
        totalPoints: 250,
      };

      await saveUserProfile(userDoc);
      setCurrentUser(userDoc);
      setRole(determinedRole);
    } catch (err) {
      console.error('Google Sign-in failed or cancelled:', err);
    }
  };

  const switchRole = (newRole: UserRole | 'guest') => {
    setRole(newRole);
    if (newRole === 'guest') {
      setCurrentUser(null);
    } else {
      const u = INITIAL_USERS[newRole];
      setCurrentUser(u);
      saveUserProfile(u).catch(() => {});
    }
  };

  const login = (email: string, requestedRole: UserRole = 'student') => {
    const userToSet: User = INITIAL_USERS[requestedRole] || {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: requestedRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      joinedDate: 'Just now',
      learningStreakDays: 1,
      totalPoints: 100,
    };
    setCurrentUser(userToSet);
    setRole(requestedRole);
    saveUserProfile(userToSet).catch(() => {});
    return true;
  };

  const register = (name: string, email: string, newRole: UserRole) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: newRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      joinedDate: 'Just now',
      learningStreakDays: 1,
      totalPoints: 150,
      badges: ['New Explorer'],
    };
    setCurrentUser(newUser);
    setRole(newRole);
    saveUserProfile(newUser).catch(() => {});
    return true;
  };

  const logout = () => {
    fbSignOut(auth).catch(() => {});
    setCurrentUser(null);
    setRole('guest');
  };

  const addPoints = (points: number) => {
    if (currentUser) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        const updated = {
          ...prev,
          totalPoints: (prev.totalPoints || 0) + points,
        };
        saveUserProfile(updated).catch(() => {});
        return updated;
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        role,
        isAuthenticated: !!currentUser,
        isFirebaseLoading,
        switchRole,
        login,
        register,
        signInWithGoogle,
        logout,
        addPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
