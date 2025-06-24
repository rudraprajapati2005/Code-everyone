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

interface Task {
    id: string;
    description: string;
    status: "todo" | "in-progress" | "done";
    row: number;
    column: number;
    rowSpan: number;
    colSpan: number;
}
function drawTable(taskList: Task[]) {
    return (
        <table className="task-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {taskList.map((task) => (
                    <tr  key={task.id}>
                        <td className="task">{task.description}</td>
                        
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default function MyProjectPage() {
    const [tasks, setTasks] = useState<string[]>([]);
    const [newTask, setNewTask] = useState("");
    const { projectID } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [selectedSection, setSelectedSection] = useState("home");
    const [dark, setDark] = useState(false);
    const router = useRouter();
    // Initialize Firebase auth with the app instance
    const auth = getAuth(app);
    const [taskListdata,settaskListdata] = useState([
        { id: "1", description: "Task 1", status: "todo", row: 1, column: 0, rowSpan: 1, colSpan: 1 },
        { id: "2", description: "Task 2", status: "in-progress", row: 2, column: 1, rowSpan: 1, colSpan: 1 },
        { id: "3", description: "Task 3", status: "done", row: 1, column: 1, rowSpan: 1, colSpan: 1 },
        { id: "4", description: "Task 4", status: "todo", row: 3, column: 1, rowSpan: 1, colSpan: 1 }
    ]);
    const [num_rows, setNumRows] = useState(0);
    const [num_cols, setNumCols] = useState(0);
    // Theme effect

    
    useEffect(() => {
        if (dark) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [dark]);
    useEffect(() => {
        setTimeout(() => {
        let row_divs = document.querySelectorAll('.new-row');
       const newTaskRows : string[][]=[];
       row_divs.forEach((row_div)=>{
        const rowTasks: string[] = [];
        row_div.querySelectorAll('.task').forEach((task) => {
            const taskText = task.textContent?.trim() || '';
            if(taskText){
                rowTasks.push(taskText);
            }
            newTaskRows.push(rowTasks);
        });
        });
    console.log("Number of rows : hell : ",newTaskRows.length);
        }, 2000); // Delay to ensure DOM is ready
    }, []);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, [auth, router]);

    useEffect(() => {
        if (user && projectID) {
            // Load project details
            const db = getDatabase();
            const projectRef = ref(db, `users/${user.uid}/projects/${projectID}`);
            
            const unsubscribe = onValue(projectRef, (snapshot) => {
                if (snapshot.exists()) {
                    setProject(snapshot.val());
                }
            });

            return () => unsubscribe();
        }
    }, [user, projectID]);

  function handleAddTask() {

    const str = newTask.trim();
    if (str === "") {
        alert("Task cannot be empty");
        return;
    }
    setNewTask("");
    const newTasksList= tasks;
    newTasksList.push(str);
    setTasks(newTasksList);
  }
    return (
        <>
            <div>
                <h1>{project?.name || "Loading..."}</h1>
            </div>
            <div className="task-container">
                <div className="taskprompt">
                    <input
                        type="text"
                        placeholder="Add a new task"
                        className="task-input"
                        value= {newTask}
                        onChange= {(e)=>setNewTask(e.target.value)}
                    />
                    <button className="add-task-button" onClick={handleAddTask}>Add Task</button>
                </div>
            </div>
            <div className="task-table-container">
                 <table className="task-table">
                  {drawTable(taskListdata)}
                </table>
              </div>
        </>
    );
}
