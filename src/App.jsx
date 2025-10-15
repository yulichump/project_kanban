import { useState, useEffect } from 'react';
import './App.css';
import './components/button.css'
import { useEditTask } from './components/editTask';
import { useDropTask } from './components/drop';

function App() {
  const [tasks, setTasks] = useState({
    todo: [],
    progress: [],
    done: []
  });

  // Добавляем состояние для отслеживания первой загрузки
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Загрузка из localStorage при монтировании
  useEffect(() => {
    const savedTasks = localStorage.getItem('kanban-tasks');
    if (savedTasks && savedTasks !== 'null' && savedTasks !== 'undefined') {
      const parsed = JSON.parse(savedTasks);
      setTasks(parsed);
    }
    setIsInitialLoad(false);
  }, []);

  // Сохранение в localStorage при изменении задач
  useEffect(() => {
    // Не сохраняем при первой загрузке, чтобы не перезаписать данные из localStorage
    if (isInitialLoad) {
      return;
    }
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
  }, [tasks, isInitialLoad]); // Добавляем isInitialLoad в зависимости

  const {
    editingTask,
    editText,
    setEditText,
    startEditing,
    saveEdit,
    cancelEdit
  } = useEditTask();

  const {
    handleDragOver,
    handleDragStart,
    handleDrop,
    setDraggedTask,
    setDraggedFrom,
    draggedFrom,
    draggedTask
  } = useDropTask();

  // Проверьте, что при добавлении задачи структура сохраняется
  const addTask = (columnId) => {
    const newTask = {
      id: Date.now(),
      content: 'Новая задача'
    };

    setTasks(prevTasks => {
      const newTasks = {
        ...prevTasks,
        [columnId]: [...prevTasks[columnId], newTask]
      };
      console.log('Новые задачи после добавления:', newTasks);
      return newTasks;
    });
  };

  // Функция удаления задачи
  const deleteTask = (taskId, columnId) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [columnId]: prevTasks[columnId].filter(task => task.id !== taskId)
    }));
  };

  // Компонент для отображения задачи
  const Task = ({ task, columnId }) => {
    const isEditing = editingTask && editingTask.id === task.id;
    
    return (
      <div 
        draggable={!isEditing} // Запрещаем перетаскивание в режиме редактирования
        onDragStart={(e) => handleDragStart(e, task, columnId)}
        onDoubleClick={() => startEditing(task.id, task.content, columnId)}
        className="task"
      >
        {isEditing ? (
          // Режим редактирования - здесь перетаскивание запрещено
          <div className="edit-mode">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-input"
              autoFocus
            />
            <div className="edit-buttons">
              <button onClick={() => saveEdit(setTasks)} className="save-button" title='Сохранить'>✓</button>
              <button onClick={() => cancelEdit(setTasks)} className="cancel-button" title="Отменить">
                ×
              </button>
            </div>
          </div>
        ) : (
          <div className="task-view">
            <span className="task-content">
              {task.content}
            </span>
            <div className="task-actions">
              <button 
                className="edit-button"
                onClick={() => startEditing(task.id, task.content, columnId)}
                title="Редактировать"
              >✎
              </button>
              <button 
                className="delete-button"
                onClick={() => deleteTask(task.id, columnId)}
                title="Удачить задачу"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='wrapper'>
      <div 
        className='column-wrapper'
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'todo', setTasks)}
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
        className='column-wrapper'
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'progress', setTasks)}
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
        className='column-wrapper'
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'done', setTasks)}
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