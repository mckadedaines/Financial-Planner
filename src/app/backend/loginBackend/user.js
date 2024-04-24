import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Register a new user
async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("Firebase auth user created:", user.uid);

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
    });
    console.log("Firestore document created");
  } catch (error) {
    console.error("Registration or document creation failed:", error);
    throw error; // Re-throw to ensure calling function can handle it
  }
}

export default registerUser;

// Sign in existing user
// export const signInUser = (email, password) => {
//   return signInWithEmailAndPassword(auth, email, password);
// };
