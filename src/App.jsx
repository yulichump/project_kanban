import { useState, useEffect } from 'react';
import './App.css';
import './components/button.css'
import { useEditTask } from './components/editTask';

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
        <div className="task-view" style={{pointerEvents: 'none'}}>
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
              style={{pointerEvents: 'auto'}} 
            >✎
            </button>
            <button 
              className="delete-button"
              onClick={() => deleteTask(task.id, columnId)}
              title="Удалить задачу"
              style={{pointerEvents: 'auto'}}
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
      >
        <div className="column-title">
          <p>PROGRESS</p>
        </div>
        <div className="column"        >
          {tasks.progress.map(task => (
            <Task key={task.id} task={task} columnId="progress" />
          ))}
        </div>
      </div>

      <div 
        className='column-wrapper'
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