"use client";

import { useState } from "react";
import "./login.css";
import { registerUser, loginUser } from "./firebaseAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await loginUser(email, password);
        setSubmitted(true);
        // Send login email notification
        fetch("/api/send-login-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            subject: "Login Successful",
            text: `Hello,\n\nYou have successfully logged in to CollabCode.`,
          }),
        });
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        console.log("Registering new user...");
        await registerUser(email, password);
        // Send signup email notification
        console.log("Sending signup email notification...");
        fetch("/api/send-login-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            subject: "Welcome to CollabCode!",
            text: `Hello,\n\nThank you for signing up for CollabCode! We are excited to have you on board.`,
          }),
        });
        // Redirect immediately after registration
        console.log("Redirecting to dashboard after registration...");
        router.push("/dashboard");
        
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed");
    }
  };

  return (
    <div className="login-bg">
      <main className="login-main">
        <div className="flex flex-col items-center">
          <div className="login-icon">
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zm0 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm0 8v-2a4 4 0 00-4-4H5a2 2 0 00-2 2v4h18v-4a2 2 0 00-2-2h-3a4 4 0 00-4 4z"
              />
            </svg>
          </div>
          <h1 className="login-title">{isLogin ? "Login" : "Sign Up"}</h1>
          <p className="login-desc">
            Welcome to your collaborative project manager!
          </p>
        </div>
        {error && (
          <div
            className="login-success"
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              borderColor: "#fca5a5",
            }}
          >
            {error}
          </div>
        )}
        {submitted && isLogin ? (
          <div className="login-success">
            <p>
              Thank you for{" "}
              {isLogin ? "logging in" : "signing up"} to our web application!
            </p>
            <p>
              A confirmation message has been sent to <b>{email}</b>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <label className="login-label">
              Email:
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="you@example.com"
              />
            </label>
            <label className="login-label">
              Password:
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                placeholder="Your password"
              />
            </label>
            <button type="submit" className="login-btn">
              {isLogin ? "Login" : "Sign Up"}
            </button>
            <button
              type="button"
              className="login-btn"
              style={{
                background: "#fff",
                color: "#2563eb",
                marginTop: "0.5rem",
                border: "1px solid #2563eb",
              }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Need an account? Sign Up"
                : "Already have an account? Login"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
