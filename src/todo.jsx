import { useState, useEffect } from 'react';
import './todo.css';

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState('');
  const [newTaskInputValue, setNewTaskInputValue] = useState('');
  const apiUrl = 'http://localhost:8080/api/tasks';

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    setUserName(username);

    const fetchTasks = async () => {
      try {
        const response = await fetch(`${apiUrl}/byUser/${username}`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    const taskName = newTaskInputValue.trim();
    if (taskName) {
      try {
        const response = await fetch(`${apiUrl}/createTask/${userName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ taskName, completed: false })
        });
        const data = await response.json();
        setNewTaskInputValue('');
        setTasks(prevTasks => [...prevTasks, data]);
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const toggleTask = async (taskId, completed) => {
    try {
      const response = await fetch(`${apiUrl}/Completed/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed })
      });
      if (response.ok) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.taskId === taskId ? { ...task, completed } : task
          )
        );
      } else {
        console.error('Error toggling task:', response.statusText);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async taskId => {
    try {
      const response = await fetch(`${apiUrl}/deleteTask/${taskId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setTasks(prevTasks => prevTasks.filter(task => task.taskId !== taskId));
      } else {
        console.error('Error deleting task:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="container">
      <h1>{userName ? `Todo List - ${userName}'s` : 'Todo List'}</h1>
      <input
        type="text"
        id="newTodo"
        placeholder="What would you like to do today?"
        value={newTaskInputValue}
        onChange={(e) => setNewTaskInputValue(e.target.value)}
      />
      <button onClick={addTask}>Add</button>
      <ul id="todoList">
        {tasks.map(task => (
          <li key={task.taskId} className={task.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.taskId, !task.completed)}
            />
            <span>{task.taskName}</span>
            <button onClick={() => deleteTask(task.taskId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
