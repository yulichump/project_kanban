import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState({
    todo: [
      { id: 1, content: 'Тестовая задача' }
    ],
    progress: [],
    done: []
  });

  const [draggedTask, setDraggedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null); // ID задачи в режиме редактирования
  const [editText, setEditText] = useState(''); // Текст для редактирования

  useEffect(() => {
    const savedTasks = localStorage.getItem('kanban-tasks');
    if(savedTasks){
      const parsed = JSON.parse(savedTasks);
      setTasks(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (columnId) => {
    const newTask = {
      id: Date.now(),
      content: 'Новая задача'
    };

    setTasks(prevTasks => ({
      ...prevTasks,
      [columnId]: [...prevTasks[columnId], newTask]
    }));
  };

  // Функция удаления задачи
  const deleteTask = (taskId, columnId) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [columnId]: prevTasks[columnId].filter(task => task.id !== taskId)
    }));
  };

  // Начало редактирования
  const startEditing = (taskId, currentContent, columnId) => {
    setEditingTask({ id: taskId, columnId });
    setEditText(currentContent);
  };

  // Сохранение изменений
  const saveEdit = () => {
    if (!editingTask) return;

    setTasks(prevTasks => ({
      ...prevTasks,
      [editingTask.columnId]: prevTasks[editingTask.columnId].map(task =>
        task.id === editingTask.id ? { ...task, content: editText } : task
      )
    }));

    setEditingTask(null);
    setEditText('');
  };

  // Отмена редактирования
  const cancelEdit = () => {
    setEditingTask(null);
    setEditText('');
  };

  // Обработка нажатия Enter при редактировании
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const handleDragStart = (e, taskId, fromColumn) => {
    // Не позволяем перетаскивать задачу в режиме редактирования
    if (editingTask && editingTask.id === taskId) return;
    
    setDraggedTask({ id: taskId, fromColumn });
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragEnd = (e) => {
    setDraggedTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, toColumn) => {
    e.preventDefault();
    
    if (!draggedTask) return;

    const taskId = draggedTask.id;
    const fromColumn = draggedTask.fromColumn;

    if (fromColumn !== toColumn) {
      setTasks(prevTasks => {
        const taskToMove = prevTasks[fromColumn].find(t => t.id == taskId);
        const newFromColumn = prevTasks[fromColumn].filter(t => t.id != taskId);
        const newToColumn = [...prevTasks[toColumn], taskToMove];

        return {
          ...prevTasks,
          [fromColumn]: newFromColumn,
          [toColumn]: newToColumn
        };
      });
    }

    setDraggedTask(null);
  };

  // Компонент для отображения задачи
  const Task = ({ task, columnId }) => {
    const isEditing = editingTask && editingTask.id === task.id;

    return (
      <div 
        className="task"
        draggable={!isEditing} // Запрещаем перетаскивание при редактировании
        onDragStart={(e) => handleDragStart(e, task.id, columnId)}
        onDragEnd={handleDragEnd}
      >
        {isEditing ? (
          // Режим редактирования
          <div className="edit-mode">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="edit-input"
              autoFocus
            />
            <div className="edit-buttons">
              <button onClick={saveEdit} className="save-button" title="Сохранить">
                ✓
              </button>
              <button onClick={cancelEdit} className="cancel-button" title="Отменить">
                ×
              </button>
            </div>
          </div>
        ) : (
          // Режим просмотра
          <>
            <span 
              className="task-content"
              onDoubleClick={() => startEditing(task.id, task.content, columnId)}
            >
              {task.content}
            </span>
            <div className="task-actions">
              <button 
                className="edit-button"
                onClick={() => startEditing(task.id, task.content, columnId)}
                title="Редактировать"
              >
                ✎
              </button>
              <button 
                className="delete-button"
                onClick={() => deleteTask(task.id, columnId)}
                title="Удалить задачу"
              >
                ×
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className='wrapper'>
      <div 
        className="column-wrapper"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'todo')}
      >
        <div className="column-title">
          <p>TO DO</p>
          <button onClick={() => addTask('todo')} className='add-button'>+</button>
        </div>
        <div className="column">
          {tasks.todo.map(task => (
            <Task key={task.id} task={task} columnId="todo" />
          ))}
        </div>
      </div>

      <div 
        className="column-wrapper"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'progress')}
      >
        <div className="column-title">
          <p>PROGRESS</p>
        </div>
        <div className="column">
          {tasks.progress.map(task => (
            <Task key={task.id} task={task} columnId="progress" />
          ))}
        </div>
      </div>

      <div 
        className="column-wrapper"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'done')}
      >
        <div className="column-title">
          <p>DONE</p>
        </div>
        <div className="column">
          {tasks.done.map(task => (
            <Task key={task.id} task={task} columnId="done" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;