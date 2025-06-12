"use client";

import { useState } from "react";
import "./dashboard.css";

export default function Dashboard() {
  // Example state for projects and members
  const [projects, setProjects] = useState([
    { id: 1, name: "Website Redesign", members: ["Alice", "Bob"] },
    { id: 2, name: "Mobile App", members: ["Charlie"] },
  ]);
  const [newProject, setNewProject] = useState("");
  const [newMember, setNewMember] = useState("");
  const [selectedProject, setSelectedProject] = useState(1);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (newProject.trim()) {
      setProjects([
        ...projects,
        { id: Date.now(), name: newProject, members: [] },
      ]);
      setNewProject("");
    }
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (newMember.trim()) {
      setProjects(
        projects.map((proj) =>
          proj.id === selectedProject
            ? { ...proj, members: [...proj.members, newMember] }
            : proj
        )
      );
      setNewMember("");
    }
  };

  const currentProject = projects.find((p) => p.id === selectedProject);

  return (
    <div className="dashboard-bg">
      <main className="dashboard-main">
        <h1 className="dashboard-title">Project Dashboard</h1>
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
                {proj.name}
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
        </section>
        {currentProject && (
          <section className="dashboard-section">
            <h2>Project: {currentProject.name}</h2>
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
          </section>
        )}
      </main>
    </div>
  );
}
