import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function AuthPage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldValid, setFieldValid] = useState({
    username: false,
    email: false,
    password: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/dashboard");
    });
    return unsubscribe;
  }, [auth, navigate]);

  const validateFields = () => {
    const errors = {};
    const valid = { username: false, email: false, password: false };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@]).{8,}$/;

    if (!email) errors.email = "Email is required.";
    else if (!emailRegex.test(email)) errors.email = "Invalid email format.";
    else valid.email = true;

    if (!password) errors.password = "Password is required.";
    else if (!passwordRegex.test(password)) {
      errors.password =
        "Password must include 1 uppercase, 1 lowercase, 1 number, 1 @ symbol, and be at least 8 characters.";
    } else valid.password = true;

    if (isSignup) {
      if (!username) errors.username = "Username is required.";
      else valid.username = true;
    }

    setFieldErrors(errors);
    setFieldValid(valid);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateFields()) return;

    try {
      if (isSignup) {
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.length > 0) {
          return setError("Email already in use.");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), { username, email });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        
      }
    } catch (err) {
      let msg = err.message;
      if (msg.includes("auth/invalid-email")) msg = "Invalid email address.";
      if (msg.includes("auth/wrong-password")) msg = "Incorrect password.";
      if (msg.includes("auth/user-not-found")) msg = "No user found with this email.";
      setError(msg);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) return setError("Enter your email to reset password.");
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        return setError("No user found with this email.");
      }
      await sendPasswordResetEmail(auth, email);
      setModalMessage("Password reset email sent to " + email);
      setShowModal(true);
      setError("");
    } catch (err) {
      setError("Failed to send reset email. Check the address and try again.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="left-panel">
          <h1>💸 Expense Manager</h1>
          <p>Track your finances smartly.</p>
        </div>

        <div className="right-panel">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2 className="fade-in">{isSignup ? "Sign Up" : "Welcome Back"}</h2>

            {isSignup && (
              <>
                <div className="input-with-icon">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      validateFields();
                    }}
                  />
                  {fieldValid.username && <span className="valid-tick">✔</span>}
                </div>
                {fieldErrors.username && <p className="error-msg">{fieldErrors.username}</p>}
              </>
            )}

            <div className="input-with-icon">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateFields();
                }}
              />
              {fieldValid.email && <span className="valid-tick">✔</span>}
            </div>
            {fieldErrors.email && <p className="error-msg">{fieldErrors.email}</p>}

            <div className="password-input-wrapper input-with-icon">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateFields();
                }}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
              {fieldValid.password && <span className="valid-tick">✔</span>}
            </div>
            {fieldErrors.password && <p className="error-msg">{fieldErrors.password}</p>}

            {!isSignup && (
              <div className="forgot-password" onClick={handlePasswordReset}>
                <span>Forgot Password?</span>
              </div>
            )}

            {error && <p className="error-msg slide-down">{error}</p>}

            <button type="submit" className="submit-btn">
              {isSignup ? "Sign Up" : "Sign In"}
            </button>

            <p className="toggle-link" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </p>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>{modalMessage}</p>
            <button onClick={closeModal} className="modal-close">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthPage;
