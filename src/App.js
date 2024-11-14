import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [isEditing, setIsEditing] = useState(null);
  const [editTask, setEditTask] = useState('');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
    setFilter('all');
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() !== '') {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask('');
    }
  };

  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const toggleComplete = (index) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  const startEditing = (index) => {
    setIsEditing(index);
    setEditTask(tasks[index].text);
  };

  const saveEdit = (index) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, text: editTask } : t
    );
    setTasks(updatedTasks);
    setIsEditing(null);
    setEditTask('');
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>Список завдань</h1>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Введіть завдання"
      />
      <button onClick={addTask}>Додати</button>

      <div className="filter-buttons">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          Всі
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'active' : ''}
        >
          Завершені
        </button>
        <button
          onClick={() => setFilter('incomplete')}
          className={filter === 'incomplete' ? 'active' : ''}
        >
          Незавершені
        </button>
      </div>

      <ul className="task-list">
        {filteredTasks.map((task, index) => (
          <li key={index} className="task-item">
            {isEditing === index ? (
              <input
                type="text"
                value={editTask}
                onChange={(e) => setEditTask(e.target.value)}
                className="edit-input"
              />
            ) : (
              <span className="task-text">{task.text}</span>
            )}
            {isEditing === index ? (
              <button onClick={() => saveEdit(index)}>Зберегти</button>
            ) : (
              <div className="action-buttons">
                <button onClick={() => toggleComplete(index)}>
                  {task.completed ? 'Позначити як незавершене' : 'Позначити як завершене'}
                </button>
                <button onClick={() => startEditing(index)}>Редагувати</button>
                <button onClick={() => removeTask(index)}>Видалити</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
