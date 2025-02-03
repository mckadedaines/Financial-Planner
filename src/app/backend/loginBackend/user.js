import { auth, db } from "@/lib/firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

/**
 * Register a new user with email and password
 * Creates both Firebase Auth user and Firestore document
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Firebase user object
 */
async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Send verification email
    await sendEmailVerification(user);

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      emailVerified: false,
    });
    return user;
  } catch (error) {
    console.error("Registration or document creation failed:", error);
    throw error;
  }
}

/**
 * Sign in an existing user
 * Updates the user's last login timestamp
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Firebase user object
 */
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update last login time
    await setDoc(
      doc(db, "users", user.uid),
      {
        lastLogin: new Date().toISOString(),
      },
      { merge: true }
    );

    return userCredential;
  } catch (error) {
    console.error("Sign in failed:", error);
    throw error;
  }
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign out failed:", error);
    throw error;
  }
};

/**
 * Check if a user's email is verified
 * @returns {boolean} Whether the user's email is verified
 */
export const isEmailVerified = () => {
  const user = auth.currentUser;
  return user?.emailVerified ?? false;
};

export default registerUser;
