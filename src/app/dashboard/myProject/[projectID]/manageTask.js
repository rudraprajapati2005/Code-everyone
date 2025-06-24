import { getDatabase, ref, set, get } from "firebase/database";

// Function to add a new task
export const addTask = async (userId, projectId, task, columnIndex, rowIndex) => {
  const db = getDatabase();
  const taskId = Date.now().toString();
  await set(ref(db, `users/${userId}/projects/${projectId}/tasks/${taskId}`), {
    id: taskId,
    content: task,
    column: columnIndex,
    row: rowIndex,
    createdAt: new Date().toISOString(),
  });
  return taskId;
};

// Function to update task position
export const updateTaskPosition = async (userId, projectId, taskId, columnIndex, rowIndex) => {
  const db = getDatabase();
  await set(ref(db, `users/${userId}/projects/${projectId}/tasks/${taskId}/column`), columnIndex);
  await set(ref(db, `users/${userId}/projects/${projectId}/tasks/${taskId}/row`), rowIndex);
};

// Function to edit task content
export const editTask = async (userId, projectId, taskId, newContent) => {
  const db = getDatabase();
  await set(ref(db, `users/${userId}/projects/${projectId}/tasks/${taskId}/content`), newContent);
};

// Function to get all tasks
export const getTasks = async (userId, projectId) => {
  const db = getDatabase();
  const snapshot = await get(ref(db, `users/${userId}/projects/${projectId}/tasks`));
  return snapshot.exists() ? snapshot.val() : {};
};

// Function to delete task
export const deleteTask = async (userId, projectId, taskId) => {
  const db = getDatabase();
  await set(ref(db, `users/${userId}/projects/${projectId}/tasks/${taskId}`), null);
};