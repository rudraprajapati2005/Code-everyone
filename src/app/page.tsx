"use client";

import { useRouter } from "next/navigation";
import "./globals.css";

export default function Home() {
  const router = useRouter();
  return (
    <div className="homepage-bg">
      <main className="homepage-main">
        <h1 className="homepage-title">
          Welcome to CollabCode Project Manager
        </h1>
        <p className="homepage-desc">
          Organize your projects, assign tasks, and collaborate securely with your
          team. Enjoy file/folder access control, smooth GitHub sync, and a
          built-in code editor.
        </p>
        <button
          className="homepage-btn"
          onClick={() => router.push("/login")}
        >
          Login / Sign Up
        </button>
      </main>
      <style>{`
        .homepage-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #fbc2eb 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .homepage-main {
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 6px 32px rgba(37,99,235,0.08);
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 32rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }
        .homepage-title {
          font-size: 2.2rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 1rem;
          background: linear-gradient(90deg, #2563eb, #ec4899, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          text-shadow: 0 2px 8px rgba(124,58,237,0.08);
        }
        .homepage-desc {
          color: #64748b;
          text-align: center;
          font-size: 1.1rem;
        }
        .homepage-btn {
          background: linear-gradient(90deg, #2563eb, #ec4899);
          color: #fff;
          border: none;
          border-radius: 9999px;
          padding: 0.75rem 2rem;
          font-weight: 700;
          font-size: 1.1rem;
          box-shadow: 0 2px 8px rgba(37,99,235,0.10);
          cursor: pointer;
          transition: transform 0.15s, background 0.2s;
        }
        .homepage-btn:hover {
          transform: scale(1.05);
          background: linear-gradient(90deg, #ec4899, #2563eb);
        }
      `}</style>
    </div>
  );
}
