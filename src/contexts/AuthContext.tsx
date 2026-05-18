import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db, messaging } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getToken } from "firebase/messaging";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const adminDoc = await getDoc(doc(db, "admins", currentUser.uid));
          setIsAdmin(adminDoc.exists());
          
          // FCM Token generation and storage
          if (messaging && 'Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
              try {
                const currentToken = await getToken(messaging, {
                  // Replaced by actual config in Firebase console for VAPID if needed
                });
                if (currentToken) {
                  // Save the token to the user's document
                  await setDoc(doc(db, "users", currentUser.uid), {
                    fcmToken: currentToken,
                    email: currentUser.email,
                    updatedAt: new Date()
                  }, { merge: true });
                }
              } catch (e) {
                console.error("An error occurred while retrieving token. ", e);
              }
            }
          }
        } catch (error) {
          console.error("Failed to process auth state", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
