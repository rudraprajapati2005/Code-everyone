"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import "../../dashboard.css";
import "./aboutProject.css"
import "./manageTask.js";
import { app } from "../../../firebaseConfig";

interface Project {
    name: string;
    members: string[];
}

export default function MyProjectPage() {
    const { projectID } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [selectedSection, setSelectedSection] = useState("home");
    const [dark, setDark] = useState(false);
    const router = useRouter();
    
    // Initialize Firebase auth with the app instance
    const auth = getAuth(app);

    // Theme effect
    useEffect(() => {
        if (dark) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [dark]);

    // Add drag and drop functionality
    useEffect(() => {
        let draggedItem: HTMLElement | null = null;
        const tasks = document.querySelectorAll('.task');
        const taskList = document.getElementById('taskList');

        tasks.forEach(task => {
            task.setAttribute('draggable', 'true');  // Make tasks draggable
            
            task.addEventListener('dragstart', () => {
                draggedItem = task as HTMLElement;
                setTimeout(() => {
                    if (draggedItem) draggedItem.style.display = 'none';
                }, 0);
            });

            task.addEventListener('dragend', () => {
                setTimeout(() => {
                    if (draggedItem) {
                        draggedItem.style.display = 'block';
                        draggedItem = null;
                    }
                }, 0);
            });

            task.addEventListener('dragover', (e) => e.preventDefault());

            task.addEventListener('dragenter', (e) => {
                e.preventDefault();
                (task as HTMLElement).style.borderTop = '2px solid #000';
            });

            task.addEventListener('dragleave', () => {
                (task as HTMLElement).style.borderTop = '';
            });

            task.addEventListener('drop', () => {
                if (draggedItem && draggedItem !== task && taskList) {
                    taskList.insertBefore(draggedItem, task);
                }
                (task as HTMLElement).style.borderTop = '';
            });
        });

        // Cleanup function to remove event listeners
        return () => {
            tasks.forEach(task => {
                task.removeAttribute('draggable');
                task.replaceWith(task.cloneNode(true));
            });
        };
    }, [project]); // Re-run when project changes

    // Firebase auth effect
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            
            if (firebaseUser && projectID) {
                const db = getDatabase(app);
                const projectRef = ref(db, `users/${firebaseUser.uid}/projects/${projectID}`);
                
                const unsubscribeProject = onValue(projectRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        setProject(data as Project);
                    }
                });

                return () => unsubscribeProject();
            }
        });

        return () => unsubscribe();
    }, [projectID, auth]);

    if (!user) {
        return <div className="dashboard-section">Please log in to view this project.</div>;
    }

    if (!project) {
        return <div className="dashboard-section">Loading project...</div>;
    }

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
                            onClick={() => router.push("/dashboard")}
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
                <div className="project-detail dashboard-section">
                    <h1>{project.name}</h1>
                    <p>Project ID: {projectID}</p>
                    <h2>Members:</h2>
                    <ul className="dashboard-member-list">
                        {project.members?.map((member: string, index: number) => (
                            <li key={index}>{member}</li>
                        ))}
                    </ul>
                </div>
            </main>
            <div className="task-list" id="taskList">
                <div className="task" draggable="true">
                    <div className="innerTask">Task 1</div>
                </div>
                <div className="task" draggable="true">Task 2</div>
                <div className="task" draggable="true">Task 3</div>
                <div className="task" draggable="true">Task 4</div>
                <div className="task" draggable="true">Task 5</div>
                <div className="task" draggable="true">Task 6</div>
                <div className="task" draggable="true">Task 7</div>
                <div className="task" draggable="true">Task 8</div>
            </div>
        </div>
    );
}
