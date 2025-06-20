const tasks = document.querySelectorAll('.task');
const taskList = document.getElementById('taskList');

let draggedItem = null;

tasks.forEach(task => {
  task.addEventListener('dragstart', (e) => {
    draggedItem = task;
    setTimeout(() => task.style.display = 'none', 0);
  });

  task.addEventListener('dragend', () => {
    setTimeout(() => {
      draggedItem.style.display = 'block';
      draggedItem = null;
    }, 0);
  });

  task.addEventListener('dragover', (e) => e.preventDefault());

  task.addEventListener('dragenter', (e) => {
    e.preventDefault();
    task.style.borderTop = '2px solid #000';
  });

  task.addEventListener('dragleave', () => {
    task.style.borderTop = '';
  });

  task.addEventListener('drop', () => {
    if (draggedItem !== task) {
      taskList.insertBefore(draggedItem, task);
    }
    task.style.borderTop = '';
  });
});