import React, { useState, useEffect, useContext } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const empty_user = { name: "" };

export const AuthUserContext = React.createContext(null);
export const withUser = (Wrapped) => function(props){
  (
    <AuthUserContext.Consumer>
      {(userContext) => <Wrapped {...props} userContext={userContext} />}
    </AuthUserContext.Consumer>
  );}

export const AuthUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(empty_user);
  const router = useRouter();

  // reloads user state
  useEffect(() => {
    if(navigator.onLine){
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
  
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          setUserDoc(docSnap.data());
        } else {
          setUserDoc(empty_user);
          router.push("/login");
        }
      });
  
      return unsubscribe;
    }else{
      router.push("/offline")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // signs in user
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => {
    signOut(auth);
    setUserDoc(empty_user);
  };

  const createUser = async (email, password, name) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          name: name,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  const context = {
    user,
    userDoc,
    login,
    logout,
    createUser,
    updateUserRecord: setUserDoc,
  };

  return (
    <AuthUserContext.Provider value={context}>
      {children}
    </AuthUserContext.Provider>
  );
};
