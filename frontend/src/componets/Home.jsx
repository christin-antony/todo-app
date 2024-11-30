import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:1008/tasks');
      setTasks(response.data);
    } catch (error) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.trim()) {
      setError('Task cannot be empty');
      return;
    }

    try {
      if (editingTask) {
        // Update existing task
        const response = await axios.put(`http://localhost:1008/tasks/${editingTask._id}`, {
          title: newTask,
          completed: editingTask.completed
        });

        setTasks(tasks.map(t => 
          t._id === editingTask._id ? response.data : t
        ));
        setEditingTask(null);
      } else {
        // Create new task
        const response = await axios.post('http://localhost:1008/tasks', {
          title: newTask,
          completed: false
        });

        setTasks([response.data, ...tasks]);
      }

      setNewTask('');
      setError('');
    } catch (error) {
      setError('Failed to save task. Please try again.');
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:1008/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const response = await axios.put(`http://localhost:1008/tasks/${task._id}`, {
        title: task.title,
        completed: !task.completed
      });

      setTasks(tasks.map(t => 
        t._id === task._id ? response.data : t
      ));
    } catch (error) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask(task.title);
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setNewTask('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
  
    return true;
  });

  return (
    <div className="todo-app-fullscreen">
      <div className="todo-container">
        <div className="task-header">
          <h1>Task Manager</h1>
        </div>
        
        <form onSubmit={handleAddTask} className="task-form">
          <input 
            type="text" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder={editingTask ? "Edit your task" : "Enter a new task"}
            className="task-input"
          />
          <div className="form-actions">
            <button 
              type="submit" 
              className="task-submit"
            >
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
            {editingTask && (
              <button 
                type="button" 
                className="task-cancel"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="task-list-header">
          <h2>Task List</h2>
          <div className="task-filter">
            <button 
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'active' : ''}
            >
              All Tasks
            </button>
 
            <button 
              onClick={() => setFilter('completed')}
              className={filter === 'completed' ? 'active' : ''}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <p className="no-tasks">No tasks found</p>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task._id} 
                className={`task-card ${task.completed ? 'completed' : ''} ${editingTask && editingTask._id === task._id ? 'editing' : ''}`}
              >
                <div className="task-content">
                  <input 
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task)}
                    className="task-checkbox"
                  />
                  <span className="task-text">
                    {task.title}
                  </span>
                </div>
                
                <div className="task-actions">
                  {!(editingTask && editingTask._id === task._id) ? (
                    <>
                      <button 
                        onClick={() => handleEditTask(task)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;