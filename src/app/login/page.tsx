"use client";

import { useState } from "react";
import "./login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
          <h1 className="login-title">Login / Sign Up</h1>
          <p className="login-desc">
            Welcome to your collaborative project manager!
          </p>
        </div>
        {submitted ? (
          <div className="login-success">
            <p>Thank you for logging in/signing up to our web application!</p>
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
              Login / Sign Up
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
