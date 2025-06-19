"use client";

import { useState, useEffect } from "react";
import { deleteAccount } from "../login/firebaseAuth";
import { useRouter } from "next/navigation";
import "./dashboard.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, push, set, onValue, remove } from "firebase/database";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [newMember, setNewMember] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSection, setSelectedSection] = useState("home");
  const [dark, setDark] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showProjectDeleteConfirmation, setShowProjectDeleteConfirmation] = useState(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Theme effect
  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  // Auth and fetch projects from Firebase Realtime Database on mount
  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const db = getDatabase();
        const projectsRef = ref(db, `users/${firebaseUser.uid}/projects`);
        const unsubscribeProjects = onValue(projectsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const loadedProjects = Object.entries(data).map(([id, value]) => ({
              id,
              name: value.name,
              members: value.members || [],
            }));
            setProjects(loadedProjects);
            // Restore selected project from localStorage if possible
            const savedSelected = localStorage.getItem("selectedProject");
            if (savedSelected && data[savedSelected]) {
              setSelectedProject(savedSelected);
            } else if (loadedProjects.length > 0) {
              setSelectedProject(loadedProjects[0].id);
            }
          } else {
            setProjects([]);
            setSelectedProject(null);
          }
        });
        // Clean up projects listener
        return () => unsubscribeProjects();
      } else {
        setProjects([]);
        setSelectedProject(null);
      }
    });
    // Clean up auth listener
    return () => unsubscribeAuth();
  }, []);

  // Persist selectedProject in localStorage
  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem("selectedProject", selectedProject);
    }
  }, [selectedProject]);

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.trim() || !user) return;
    const db = getDatabase();
    const projectsRef = ref(db, `users/${user.uid}/projects`);
    const newProjectRef = push(projectsRef);
    await set(newProjectRef, { name: newProject, members: [] });
    setNewProject("");
  };

  const handleDeleteProject = async (projectId) => {
    if (!user) return;
    const db = getDatabase();
    const projectRef = ref(db, `users/${user.uid}/projects/${projectId}`);
    await remove(projectRef);
    if (selectedProject === projectId) setSelectedProject(null);
    setShowProjectDeleteConfirmation(null);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.trim() || !user || !selectedProject) return;
    const db = getDatabase();
    const membersRef = ref(db, `users/${user.uid}/projects/${selectedProject}/members`);
    onValue(membersRef, (snapshot) => {
      const members = snapshot.val() || [];
      set(membersRef, [...members, newMember]);
      setNewMember("");
    }, { onlyOnce: true });
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
    setDeletePassword("");
    setDeleteError("");
  };

  const confirmDeleteAccount = async (e) => {
    if (e) e.preventDefault();
    setDeleteError("");
    if (!user || !user.email) {
      setDeleteError("No user is currently logged in.");
      return;
    }
    if (!deletePassword) {
      setDeleteError("Password is required.");
      return;
    }
    try {
      await deleteAccount(deletePassword);
      router.push("/");
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setDeleteError("Incorrect password. Please try again.");
      } else {
        setDeleteError(err.message || "Failed to delete account.");
      }
    }
  };

  const currentProject = projects.find((p) => p.id === selectedProject);

  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-list">
          <li>
            <button
              className={"navbar-link" + (selectedSection === "home" ? " active" : "")}
              onClick={() => setSelectedSection("home")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={"navbar-link" + (selectedSection === "projects" ? " active" : "")}
              onClick={() => setSelectedSection("projects")}
            >
              Projects
            </button>
          </li>
          <li>
            <button
              className={"navbar-link" + (selectedSection === "requests" ? " active" : "")}
              onClick={() => setSelectedSection("requests")}
            >
              Requests
            </button>
          </li>
          <li>
            <button
              className={"navbar-link" + (selectedSection === "profile" ? " active" : "")}
              onClick={() => setSelectedSection("profile")}
            >
              My Profile
            </button>
          </li>
          <li style={{ marginLeft: "auto" }}>
            <button
              className="theme-toggle"
              title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              onClick={() => setDark((d) => !d)}
            >
              {dark ? "🌙" : "☀️"}
            </button>
          </li>
        </ul>
      </nav>
      <main className="dashboard-main">
        {selectedSection === "home" && (
          <section className="dashboard-section">
            <h1 className="dashboard-title">Welcome to the Website!</h1>
            <p>
              This platform helps you manage projects, collaborate with others, and
              join exciting new work. Use the navigation bar to explore features.
            </p>
            <ul>
              <li>
                <b>Projects:</b> Create, manage, and link your projects with
                GitHub.
              </li>
              <li>
                <b>Requests:</b> View and respond to invitations to join projects.
              </li>
              <li>
                <b>My Profile:</b> View and edit your user details.
              </li>
            </ul>
          </section>
        )}
        {selectedSection === "projects" && (
          <section className="dashboard-section">
            <h2>Your Projects</h2>
            <ul className="dashboard-project-list">
              {projects.map((proj) => (
                <li
                  key={proj.id}
                  className={
                    "dashboard-project-item" +
                    (proj.id === selectedProject ? " selected" : "")
                  }
                  onClick={() => setSelectedProject(proj.id)}
                >
                  <span>{proj.name}</span>
                  <span>
                    <button className="github-link-btn" style={{ marginLeft: 8 }}>
                      GitHub
                    </button>
                    <button
                      className="delete-project-btn"
                      style={{ marginLeft: 8 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowProjectDeleteConfirmation(proj.id);
                      }}
                    >
                      Delete
                    </button>
                  </span>
                  {showProjectDeleteConfirmation === proj.id && (
                    <div className="delete-confirmation">
                      Are you sure you want to delete this project?
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="confirm-delete-btn"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setShowProjectDeleteConfirmation(null)}
                        className="cancel-delete-btn"
                      >
                        No
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddProject} className="dashboard-form">
              <input
                type="text"
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                placeholder="Add new project"
                className="dashboard-input"
              />
              <button type="submit" className="dashboard-btn">
                Add Project
              </button>
            </form>
            {currentProject && (
              <div style={{ marginTop: "2rem" }}>
                <h3>Members</h3>
                <ul className="dashboard-member-list">
                  {currentProject.members.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
                <form onSubmit={handleAddMember} className="dashboard-form">
                  <input
                    type="text"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    placeholder="Add member to this project"
                    className="dashboard-input"
                  />
                  <button type="submit" className="dashboard-btn">
                    Add Member
                  </button>
                </form>
              </div>
            )}
          </section>
        )}
        {selectedSection === "requests" && (
          <section className="dashboard-section">
            <h2>Requests to Join Projects</h2>
            <p>No requests at this time. (Feature coming soon!)</p>
          </section>
        )}
        {selectedSection === "profile" && (
          <section className="dashboard-section">
            <h2>My Profile</h2>
            <p>
              Details of the current user will be shown here. (Feature coming soon!)
            </p>
            <button
              onClick={handleDeleteAccount}
              className="dashboard-btn"
              style={{
                background: "#fff",
                color: "#b91c1c",
                border: "1px solid #b91c1c",
                marginTop: "2rem",
              }}
            >
              Delete Account
            </button>
            {showDeleteDialog && (
              <div className="modal-overlay">
                <div className="modal-dialog">
                  <h3>Confirm Account Deletion</h3>
                  {deleteError && (
                    <div className="delete-error">{deleteError}</div>
                  )}
                  <form onSubmit={confirmDeleteAccount}>
                    <label>
                      Please enter your password to confirm:
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={e => setDeletePassword(e.target.value)}
                        className="dashboard-input"
                        required
                        autoFocus
                      />
                    </label>
                    <div style={{marginTop: '1rem', display: 'flex', gap: '1rem'}}>
                      <button type="submit" className="dashboard-btn" style={{background: '#b91c1c'}}>Delete</button>
                      <button type="button" className="dashboard-btn" onClick={() => setShowDeleteDialog(false)} style={{background: '#fff', color: '#18181b', border: '1px solid #d1d5db'}}>Cancel</button>
                    </div>
                  </form>
                </div>
                <style>{`
                  .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.35);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                  }
                  .modal-dialog {
                    background: #fff;
                    border-radius: 12px;
                    padding: 2rem 2.5rem;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
                    min-width: 320px;
                    max-width: 90vw;
                  }
                  .delete-error {
                    color: #b91c1c;
                    background: #fee2e2;
                    border: 1px solid #fca5a5;
                    border-radius: 6px;
                    padding: 0.5rem 1rem;
                    margin-bottom: 1rem;
                  }
                `}</style>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}