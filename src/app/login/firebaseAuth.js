import {
  getAuth,
  deleteUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";

import {
  getFirestore,
  doc,
  deleteDoc,
  setDoc
} from "firebase/firestore";

import { app } from "../firebaseConfig";

const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Deletes the current user's account from Firebase Authentication and Firestore.
 * Requires reauthentication before deletion.
 *
 * @param {string} password - The user's password for reauthentication.
 */
export async function deleteAccount(password) {
  const user = auth.currentUser;

  if (!user) {
    console.warn("No user is currently logged in.");
    throw new Error("No user is currently logged in.");
  }

  try {
    console.log("🔄 Starting user reauthentication...");
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential)
    console.log("❌ Attempting to delete user from Firebase Authentication...");
    await deleteUser(user)
      .then(() => console.log("✅ User deleted successfully from Firebase Authentication."))
      .catch((err) => {
        console.error("🔥 Authentication deletion error:", err.code, err.message);
        throw err;
      });

    // Redirect after successful deletion
    window.location.href = "/login";
  } catch (err) {
    console.error("⚠️ Error during account deletion:", err.code, err.message);

    if (err.code === "auth/requires-recent-login") {
      alert("Please reauthenticate before deleting your account.");
    } else if (err.code === "auth/wrong-password") {
      alert("Incorrect password. Please try again.");
    } else {
      alert("An unexpected error occurred. Check console logs for details.");
    }

    throw err;
  }
}

/**
 * Registers a new user using Firebase Authentication and stores their details in Firestore.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {object} - The created user object.
 */
export async function registerUser(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  console.log("✅ User registered successfully:", user.email);

  // await setDoc(doc(db, "users", user.uid), {
  //   email: user.email,
  //   uid: user.uid,
  //   createdAt: new Date().toISOString(),
  // });
  
  console.log("✅ User registered and saved in Firestore.");
 
  return user;
}

/**
 * Signs in a user with Firebase Authentication.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {object} - The authenticated user object.
 */
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  console.log("✅ User logged in successfully.");
  return userCredential.user;
}