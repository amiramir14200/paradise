import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile, UserRole, AgeBracket } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  role: UserRole;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isGuardian: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoUser: (role: UserRole, customName?: string, age?: AgeBracket) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  linkChildToGuardian: (childId: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync profile when Firebase User changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            // New user registration
            const isBootstrappedAdmin = user.email === 'amiramir14200@gmail.com';
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              fullName: user.displayName || 'کاربر گرامی',
              role: isBootstrappedAdmin ? 'admin' : 'student',
              ageBracket: '10-12',
              avatar: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
              createdAt: new Date().toISOString()
            };

            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);

            if (isBootstrappedAdmin) {
              await setDoc(doc(db, 'admins', user.uid), {
                email: user.email,
                createdAt: new Date().toISOString()
              });
            }
          }
        } catch (error) {
          console.warn('Profile fetch error, falling back to local session:', error);
          // Fallback local profile if offline
          setProfile({
            uid: user.uid,
            email: user.email || '',
            fullName: user.displayName || 'کاربر آکادمی',
            role: user.email === 'amiramir14200@gmail.com' ? 'admin' : 'student',
            ageBracket: '10-12',
            createdAt: new Date().toISOString()
          });
        }
      } else {
        // Check for active demo session in localStorage
        const storedDemo = localStorage.getItem('paradise_demo_user');
        if (storedDemo) {
          try {
            setProfile(JSON.parse(storedDemo));
          } catch {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      localStorage.removeItem('paradise_demo_user');
    } catch (err) {
      console.error('Google Sign In Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoUser = async (targetRole: UserRole, customName?: string, age?: AgeBracket) => {
    setLoading(true);
    const demoProfiles: Record<UserRole, UserProfile> = {
      admin: {
        uid: 'admin-amir-1',
        email: 'amiramir14200@gmail.com',
        fullName: customName || 'امیرحسین رضایی (مدیریت کل آکادمی)',
        englishName: 'Amir Hossein Rezaei',
        role: 'admin',
        phone: '۰۹۱۲۹۹۹۸۸۷۷',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      },
      teacher: {
        uid: 'teacher-sara-1',
        email: 'sara.ahmadi@paradise.ir',
        fullName: customName || 'خانم سارا احمدی (مدرس دوره‌های کودک)',
        englishName: 'Sara Ahmadi',
        role: 'teacher',
        phone: '۰۹۱۲۵۵۵۴۴۳۳',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      },
      student: {
        uid: 'demo-student-1',
        email: 'kian.rezaei@student.ir',
        fullName: customName || 'کیان رضایی (دانش‌آموز ۸ ساله)',
        englishName: 'Kian Rezaei',
        role: 'student',
        ageBracket: age || '6-9',
        phone: '۰۹۱۲۳۴۵۶۷۸۹',
        guardianId: 'guardian-rezaei-1',
        guardianName: 'آقای علی رضایی (پدر)',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=kian8',
        createdAt: new Date().toISOString()
      },
      guardian: {
        uid: 'guardian-rezaei-1',
        email: 'ali.rezaei@family.ir',
        fullName: customName || 'آقای علی رضایی (ولی دانش‌آموز)',
        englishName: 'Ali Rezaei',
        role: 'guardian',
        phone: '۰۹۱۲۱۱۱۴۴۷۷',
        childrenIds: ['demo-student-1'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      }
    };

    const selectedProfile = demoProfiles[targetRole];
    setProfile(selectedProfile);
    localStorage.setItem('paradise_demo_user', JSON.stringify(selectedProfile));

    try {
      await setDoc(doc(db, 'users', selectedProfile.uid), selectedProfile, { merge: true });
    } catch {
      // offline/fallback tolerant
    }

    setLoading(false);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates, updatedAt: new Date().toISOString() };
    setProfile(updated);
    if (localStorage.getItem('paradise_demo_user')) {
      localStorage.setItem('paradise_demo_user', JSON.stringify(updated));
    }
    try {
      await setDoc(doc(db, 'users', profile.uid), updated, { merge: true });
    } catch (err) {
      console.warn('Update user profile failed to write to Firestore:', err);
    }
  };

  const linkChildToGuardian = async (childId: string) => {
    if (!profile || profile.role !== 'guardian') return;
    const currentChildren = profile.childrenIds || [];
    if (!currentChildren.includes(childId)) {
      const updatedChildren = [...currentChildren, childId];
      await updateUserProfile({ childrenIds: updatedChildren });
      // Update child doc as well
      try {
        await setDoc(doc(db, 'users', childId), {
          guardianId: profile.uid,
          guardianName: profile.fullName
        }, { merge: true });
      } catch (err) {
        console.warn('Linking child record note:', err);
      }
    }
  };

  const logout = async () => {
    localStorage.removeItem('paradise_demo_user');
    setProfile(null);
    setCurrentUser(null);
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const role = profile?.role || 'student';
  const isAdmin = role === 'admin' || profile?.email === 'amiramir14200@gmail.com';
  const isTeacher = role === 'teacher' || isAdmin;
  const isStudent = role === 'student';
  const isGuardian = role === 'guardian';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        loading,
        role,
        isAdmin,
        isTeacher,
        isStudent,
        isGuardian,
        loginWithGoogle,
        loginAsDemoUser,
        updateUserProfile,
        linkChildToGuardian,
        logout
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
